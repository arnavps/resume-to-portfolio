import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/onboarding'];
const authRoutes = ['/login', '/signup'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth-token')?.value;

    let isValidToken = false;
    if (token) {
        const payload = await verifyJWT(token);
        isValidToken = !!payload;
    }

    // specific logic for protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        if (!isValidToken) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // specific logic for auth routes (login/signup)
    if (authRoutes.some(route => pathname.startsWith(route))) {
        if (isValidToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
