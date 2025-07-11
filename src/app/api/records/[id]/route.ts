// import { NextRequest, NextResponse } from 'next/server';
// import { DatabaseService } from '@/lib/db';

// const db = DatabaseService.getInstance(process.env.DB_TYPE as 'sqlite' | 'mysql' || 'sqlite');

// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         await db.connect();
//         const records = await db.query('SELECT * FROM records WHERE id = ?', [params.id]);
//         if (records.length === 0) {
//             return NextResponse.json({ error: 'Record not found' }, { status: 404 });
//         }
//         return NextResponse.json(records[0]);
//     } catch (error) {
//         return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 });
//     } finally {
//         await db.close();
//     }
// }