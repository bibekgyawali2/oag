import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/db';
import { FormDataInterface } from '@/types/form';

const db = DatabaseService.getInstance('sqlite');

export const runtime = 'edge';


export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
    });
}


export async function GET() {
    try {
        await db.connect();
        const records = await db.getRecords();
        return NextResponse.json(records);
    } catch (error: any) {
        return NextResponse.json({ error: `Failed to fetch records: ${error.message}` }, { status: 500 });
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