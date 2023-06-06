import { hashPassword, comparePassword } from '$lib/server/crypto';
import { v4 } from 'uuid';
import { db } from '$lib/database';

const emailExists = async (email: string): Promise<boolean> => {
	const conn = db.connection();
	const query = `SELECT COUNT(*) AS count FROM auth_user WHERE email = ?;`;
	const result = await conn.execute(query, [email]);
	const record_count = result.rows[0] as { count: string };
	return parseInt(record_count.count) > 0;
};

export const getAllSessions = async (user_id: string): Promise<string[]> => {
	const conn = db.connection();
	const query = 'SELECT id FROM auth_session WHERE auth_user_id = ?';
	const { rows } = await conn.execute(query, [user_id]);
	const sessions = rows as { id: string }[];
	return sessions.map((session) => session.id);
};

export const getUser = async (email: string): Promise<string> => {
	const conn = db.connection();
	const query = 'SELECT id FROM auth_user WHERE email = ?';
	const { rows } = await conn.execute(query, [email]);
	const user = rows[0] as { id: string };
	return user.id as string;
};

export const createUser = async (
	email: string,
	password: string,
	name: string
): Promise<string> => {
	const email_exists = await emailExists(email);

	if (email_exists) {
		throw Error('AUTH_DUPLICATE_EMAIL');
	}

	const conn = db.connection();

	// Create auth_user
	const user_id = v4();
	const query = `INSERT INTO auth_user (id, email) VALUES (?, ?);`;
	const user_result = await conn.execute(query, [user_id, email]);

	if (user_result.insertId === null) {
		console.error('Unable to insert auth_user');
		throw Error('DB_INSERT_FAILED');
	}

	// Create auth_key
	const key_id = v4();
	const hashed_password = await hashPassword(password);
	const key_query = 'INSERT INTO auth_key (id, auth_user_id, hashed_password) VALUES (?, ?, ?);';
	const key_result = await conn.execute(key_query, [key_id, user_id, hashed_password]);

	if (key_result.insertId === null) {
		console.error('Unable to insert auth_key');
		throw new Error('DB_INSERT_FAILED');
	}

	// Create User Profile
	const user_profile_query = 'INSERT INTO User (auth_user_id, name, email) VALUES (?, ?, ?);';
	const user_profile_result = await conn.execute(user_profile_query, [user_id, name, email]);

	if (user_profile_result.insertId === null) {
		console.error('Unable to insert User');
		throw Error('DB_INSERT_FAILED');
	}

	return user_id;
};

export const login = async (email: string, password: string): Promise<string> => {
	const conn = db.connection();
	const getAuthUser = 'SELECT id FROM auth_user WHERE email = ?';
	const authUserResult = await conn.execute(getAuthUser, [email]);
	const user = authUserResult.rows[0] as { id: string };

	if (user === undefined) {
		console.error('AuthUser Not Found');
		throw Error('AUTH_INVALID_CREDENTIALS');
	}

	if (user.id === undefined) {
		console.error('AuthUser Not Found');
		throw Error('AUTH_INVALID_CREDENTIALS');
	}

	const getHashedPassword =
		'SELECT hashed_password as hashedPassword FROM auth_key WHERE auth_user_id = ?';
	const hashedPasswordResult = await conn.execute(getHashedPassword, [user.id]);

	if (hashedPasswordResult === undefined) {
		console.error('AuthKey not found');
		throw Error('DB_SELECT_FAILED');
	}
	const { hashedPassword } = hashedPasswordResult.rows[0] as { hashedPassword: string };

	if (hashedPassword === undefined) {
		console.error('AuthKey not found');
		throw Error('DB_SELECT_FAILED');
	}

	const isValid = await comparePassword(password, hashedPassword);

	if (!isValid) {
		console.error('Invalid Password');
		throw Error('AUTH_INVALID_CREDENTIALS');
	}

	const sessionId = v4();
	const createSession =
		'INSERT INTO auth_session (id, auth_user_id, expires) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))';
	const sessionResult = await conn.execute(createSession, [sessionId, user.id]);

	if (sessionResult.insertId === null) {
		console.error('Unable to create session');
		throw Error('DB_INSERT_FAILED');
	}

	return sessionId;
};

export const logout = async (session_id: string): Promise<void> => {
	const conn = db.connection();
	const select_query = 'SELECT id FROM auth_session WHERE id = ?';
	const select_result = await conn.execute(select_query, [session_id]);

	if (select_result.rows.length !== 1) {
		console.error('Session not found');
		throw Error('AUTH_INVALID_SESSION');
	}

	const delete_session_query = 'DELETE FROM auth_session WHERE id = ?';
	const result = await conn.execute(delete_session_query, [session_id]);

	if (result.rowsAffected === 0) {
		console.error('Unable to delete session');
		throw Error('DB_DELETE_FAILED');
	}

	return;
};

export const logoutAll = async (auth_user_id: string): Promise<void> => {
	const conn = db.connection();
	const find_user_query = 'SELECT id FROM auth_user WHERE id = ?';
	const find_user_result = await conn.execute(find_user_query, [auth_user_id]);
	if (find_user_result.rows.length !== 1) {
		console.error('User not found');
		throw Error('AUTH_INVALID_SESSION');
	}

	const find_sessions_query = 'SELECT id FROM auth_session WHERE auth_user_id = ?';
	const find_sessions_result = await conn.execute(find_sessions_query, [auth_user_id]);
	if (find_sessions_result.rows.length === 0) {
		console.error('No sessions found for User');
		throw Error('AUTH_INVALID_SESSION');
	}

	const delete_sessions_query = 'DELETE FROM auth_session WHERE auth_user_id = ?';
	const delete_sessions_result = await conn.execute(delete_sessions_query, [auth_user_id]);
	if (delete_sessions_result.rowsAffected === 0) {
		console.error('Unable to delete sessions');
		throw Error('DB_DELETE_FAILED');
	}

	return;
};

export const validateSession = async (session_id: string): Promise<boolean> => {
	const conn = db.connection();
	const query = 'SELECT id FROM auth_session WHERE id = ?';
	const result = await conn.execute(query, [session_id]);
	return result.rows.length === 1;
};
