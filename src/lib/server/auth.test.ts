/**
 * @vitest-environment jsdom
 */
import { db } from '$lib/database';
import {
	createUser,
	login,
	getAllSessions,
	logout,
	logoutAll,
	validateSession
} from '$lib/server/auth';

const accounts = [
	{
		email: 'jackmiller@gmail.com',
		name: 'Jack Miller',
		password: 'password',
		hashedPassword: '$2b$10$kAf6zKTdEIL.Xogd3xSizekP93x0w3yJry2e3cB2rB0FvCXEoHCeq'
	},
	{
		email: 'jordansmith@hotmail.com',
		name: 'Jordan Smith',
		password: 'password123',
		hashedPassword: '$2b$10$uY7dZXLZnkexrJdvvzoHJuuzsDPR0NuQUSspkpWbuJTyZH6Hw1eiu'
	},
	{
		email: 'testuser1@example.com',
		name: 'John Doe',
		password: 'P@$$w0Rd',
		hashedPassword: '$2b$10$zR0tq5WF/aI46blB3nTUIeJYKav5Dr7us7e3APdm6z1DXAQlsp7pe'
	},
	{
		email: 'sveltekit123@gmail.com',
		name: 'Jane Smith',
		password: 'testytesttest123',
		hashedPassword: '$2b$10$o8FwYlkExQif5OT9oeyuX.LRrm8YsUqvkFqhlUMJ1lTND2fEQ3AXC'
	},
	{
		email: 'superfakeemail@suspicious.net',
		name: 'Leroy Jenkinsonsmithers',
		password: 'IHonestlyHaveNoIdeaWhatImDoing',
		hashedPassword: '$2b$10$Gb6Lf7yunn/XrGThk3jtFevdApUjpUh9DOIN1cyxbgwNOWWckvj5S'
	}
];

describe('auth', () => {
	beforeAll(async () => {
		const conn = db.connection();
		const deleteAuthUser = 'DELETE FROM auth_user WHERE email = ?';
		const deleteUser = 'DELETE FROM User WHERE email = ?';

		return Promise.all(
			accounts.map(async (account) => {
				const del_auth_user = await conn.execute(deleteAuthUser, [account.email]);
				const del_user = await conn.execute(deleteUser, [account.email]);
				console.log(
					`Deleted ${account.email} | (AuthUser): ${del_auth_user.rowsAffected} | (User): ${del_user.rowsAffected}`
				);
			})
		);
	}, 20000);

	it('should create a valid user from createUser()', async () => {
		const conn = db.connection();

		const act_idx = 0;

		const user_id = await createUser(
			accounts[act_idx].email,
			accounts[act_idx].hashedPassword,
			accounts[act_idx].name
		);
		expect(user_id).toBeDefined();
		expect(user_id).toBeTruthy();

		const auth_user_result = await conn.execute('SELECT * FROM auth_user WHERE email = ?', [
			accounts[act_idx].email
		]);
		expect(auth_user_result.rows.length).toBe(1);
		expect(auth_user_result.rows[act_idx]).toBeTruthy();

		const user_result = await conn.execute('SELECT * FROM User WHERE email = ?', [
			accounts[act_idx].email
		]);
		expect(user_result.rows.length).toBe(1);
		expect(user_result.rows[act_idx]).toBeTruthy();

		const auth_key_result = await conn.execute('SELECT * FROM auth_key WHERE auth_user_id = ?', [
			user_id
		]);
		expect(auth_key_result.rows.length).toBe(1);
		expect(auth_key_result.rows[act_idx]).toBeTruthy();
	});

	it('should fail to create a user from createUser() if they already have an account', async () => {
		const act_idx = 1;
		await createUser(
			accounts[act_idx].email,
			accounts[act_idx].hashedPassword,
			accounts[act_idx].name
		);
		expect(() =>
			createUser(accounts[act_idx].email, accounts[act_idx].hashedPassword, accounts[act_idx].name)
		).rejects.toThrow('AUTH_DUPLICATE_EMAIL');
	});

	it('should successfully login a valid user from login()', async () => {
		const act_idx = 2;
		const user_id = await createUser(
			accounts[act_idx].email,
			accounts[act_idx].password,
			accounts[act_idx].name
		);
		expect(user_id).toBeDefined();
		expect(user_id).toBeTruthy();

		const session = await login(accounts[act_idx].email, accounts[act_idx].password);
		expect(session).toBeDefined();
		expect(session).toBeTruthy();

		const all_sessions_results = await getAllSessions(user_id);
		expect(all_sessions_results).toBeDefined();
		expect(all_sessions_results).toBeTruthy();
		expect(all_sessions_results.length).toBe(1);

		const new_session = await login(accounts[act_idx].email, accounts[act_idx].password);
		expect(new_session).toBeDefined();
		expect(new_session).toBeTruthy();
		expect(new_session).not.toBe(session);

		const all_sessions_results_2 = await getAllSessions(user_id);
		expect(all_sessions_results_2).toBeDefined();
		expect(all_sessions_results_2).toBeTruthy();
		expect(all_sessions_results_2.length).toBe(2);
	});

	it('should fail to login a user from login() if they do not have an account', async () => {
		const act_idx = 3;
		expect(() => login(accounts[act_idx].email, accounts[act_idx].password)).rejects.toThrow(
			'AUTH_INVALID_CREDENTIALS'
		);
	});

	it('should be able to remove one or multiple sessions and validate existing sessions', async () => {
		const act_idx = 4;
		const user_id = await createUser(
			accounts[act_idx].email,
			accounts[act_idx].password,
			accounts[act_idx].name
		);
		expect(user_id).toBeDefined();

		const session_id_1 = await login(accounts[act_idx].email, accounts[act_idx].password);
		expect(session_id_1).toBeDefined();

		let all_sessions_results = await getAllSessions(user_id);
		expect(all_sessions_results).toBeTruthy();
		expect(all_sessions_results.length).toBe(1);
		expect(all_sessions_results.includes(session_id_1)).toBe(true);

		let session_id_1_is_valid = await validateSession(session_id_1);
		expect(session_id_1_is_valid).toBe(true);

		const session_id_2 = await login(accounts[act_idx].email, accounts[act_idx].password);
		expect(session_id_2).toBeDefined();

		all_sessions_results = await getAllSessions(user_id);
		expect(all_sessions_results).toBeTruthy();
		expect(all_sessions_results.length).toBe(2);
		expect(
			[session_id_1, session_id_2].every((session_id) => all_sessions_results.includes(session_id))
		).toBe(true);

		let session_id_2_is_valid = await validateSession(session_id_2);
		expect(session_id_2_is_valid).toBe(true);

		const session_id_3 = await login(accounts[act_idx].email, accounts[act_idx].password);
		expect(session_id_3).toBeDefined();

		all_sessions_results = await getAllSessions(user_id);
		expect(all_sessions_results).toBeTruthy();
		expect(all_sessions_results.length).toBe(3);
		expect(
			[session_id_1, session_id_2, session_id_3].every((session_id) =>
				all_sessions_results.includes(session_id)
			)
		).toBe(true);

		let session_id_3_is_valid = await validateSession(session_id_3);
		expect(session_id_3_is_valid).toBe(true);

		await logout(session_id_2);

		session_id_2_is_valid = await validateSession(session_id_2);
		expect(session_id_2_is_valid).toBe(false);

		all_sessions_results = await getAllSessions(user_id);
		expect(all_sessions_results).toBeTruthy();
		expect(all_sessions_results.length).toBe(2);
		expect(
			[session_id_1, session_id_3].every((session_id) => all_sessions_results.includes(session_id))
		).toBe(true);

		await logoutAll(user_id);
		all_sessions_results = await getAllSessions(user_id);
		expect(all_sessions_results).toBeTruthy();
		expect(all_sessions_results.length).toBe(0);

		session_id_1_is_valid = await validateSession(session_id_1);
		expect(session_id_1_is_valid).toBe(false);
		session_id_3_is_valid = await validateSession(session_id_3);
		expect(session_id_3_is_valid).toBe(false);
	});
});
