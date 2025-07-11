import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';
import { FormDataInterface } from '@/types/form';

// const db = DatabaseService.getInstance(process.env.DB_TYPE as 'sqlite' | 'mysql' || 'sqlite') || 'sqlite';
const db = DatabaseService.getInstance('sqlite')

export async function GET() {
    try {
        console.log(db);
        await db.connect();
        const records = await db.getRecords();
        return NextResponse.json(records);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 });
    } finally {
        await db.close();
    }
}

export async function POST(request: NextRequest) {
    try {
        const record: FormDataInterface = await request.json();
        await db.connect();
        await db.saveRecord(record);
        return NextResponse.json({ message: 'Record saved successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save record' }, { status: 500 });
    } finally {
        await db.close();
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await db.connect();
        await db.deleteRecord(id);
        return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
    } finally {
        await db.close();
    }
}