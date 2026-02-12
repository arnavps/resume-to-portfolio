import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me-in-prod';
const JWT_EXPIRES_IN = '7d';

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function signJWT(payload: any): Promise<string> {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRES_IN)
        .sign(secret);
}

export async function verifyJWT(token: string): Promise<any> {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}
