import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    // Paths that don't require authentication
    const publicPaths = ['/login', '/api/auth/login'];

    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isPublicPath) {
        // If user is already logged in and tries to go to login, redirect to dashboard
        if (session) {
            const payload = await verifySession(session);
            if (payload) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        }
        return NextResponse.next();
    }

    // Check for session on protected routes
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifySession(session);
    if (!payload) {
        // Invalid session
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
