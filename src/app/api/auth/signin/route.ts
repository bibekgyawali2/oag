import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const db = DatabaseService.getInstance('sqlite');
        await db.connect();

        // Find user
        const user = await db.getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key', // Store secret in .env
            { expiresIn: '1h' }
        );

        return NextResponse.json({ token }, { status: 200 });
    } catch (error: any) {
        console.error('Error in signin:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await DatabaseService.getInstance().close();
    }
}