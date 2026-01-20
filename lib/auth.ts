import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const SALT_ROUNDS = 10;
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key');

// --- PIN Management ---

export async function hashPin(pin: string): Promise<string> {
    return await bcrypt.hash(pin, SALT_ROUNDS);
}

export async function verifyPin(pin: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(pin, hash);
}

// --- Session Management (Jose for Edge Compatibility) ---

export async function createSession(userId: string) {
    return await new SignJWT({ userId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(SECRET_KEY);
}

export async function verifySession(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}
