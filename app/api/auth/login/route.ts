import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import { User } from '@/lib/models/index';
import { hashPin, verifyPin, createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        if (!pin || pin.length < 4) {
            return NextResponse.json(
                { error: 'PIN must be at least 4 digits' },
                { status: 400 }
            );
        }

        await dbConnect();

        const existingUser = await User.findOne();

        if (!existingUser) {
            // --- Setup Mode ---
            // No user exists, so the first PIN entry becomes the admin PIN.
            const hashedPin = await hashPin(pin);
            const newUser = await User.create({ pinHash: hashedPin });

            const sessionToken = await createSession(newUser._id.toString());

            (await cookies()).set('session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return NextResponse.json({ message: 'Setup successful', setup: true });
        } else {
            // --- Login Mode ---
            const isValid = await verifyPin(pin, existingUser.pinHash);

            if (!isValid) {
                return NextResponse.json(
                    { error: 'Invalid PIN' },
                    { status: 401 }
                );
            }

            const sessionToken = await createSession(existingUser._id.toString());

            (await cookies()).set('session', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return NextResponse.json({ message: 'Login successful', setup: false });
        }

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
