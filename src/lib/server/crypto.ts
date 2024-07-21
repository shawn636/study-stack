import { PEPPER } from '$env/static/private';
import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt and a secret pepper value.
 *
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const pepperedPassword = password + PEPPER;

    return await bcrypt.hash(pepperedPassword, salt);
};

/**
 * Compares a password with a hash using bcrypt and a secret pepper value.
 *
 * @param {string} password - The password to compare.
 * @param {string} hash - The hash to compare against.
 * @returns {Promise<boolean>} A Promise that resolves to true if the password matches the hash, false otherwise.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    const pepperedPassword = password + PEPPER;
    console.debug('Pepper', PEPPER);
    return await bcrypt.compare(pepperedPassword, hash);
};

/**
 * Checks if a string is a valid UUID (Universally Unique Identifier).
 *
 * @param {string} uuid - The string to check.
 * @returns {boolean} Returns true if the string is a valid UUID, false otherwise.
 */
export const isUUID = (uuid: string): boolean => {
    const regex =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

    return regex.test(uuid);
};
