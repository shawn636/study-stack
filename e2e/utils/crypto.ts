import bcrypt from 'bcryptjs';

import { PEPPER } from './env';

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt();
    const pepperedPassword = password + PEPPER;
    return await bcrypt.hash(pepperedPassword, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    const pepperedPassword = password + PEPPER;
    return await bcrypt.compare(pepperedPassword, hash);
};
