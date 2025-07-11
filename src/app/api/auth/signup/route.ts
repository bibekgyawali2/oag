import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { DatabaseService } from '@/lib/db';


export async function OPTIONS() {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        const db = DatabaseService.getInstance('sqlite');
        await db.connect();

        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Save user with hashed password
        await db.saveUser(email, password);

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Error in signup:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } finally {
        await DatabaseService.getInstance().close();
    }
}