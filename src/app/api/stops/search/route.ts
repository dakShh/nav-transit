import { NextResponse } from 'next/server';
import { pool } from '@/lib/db/db'; // your Prisma or pg connector

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    if (!q) return NextResponse.json([]);

    const sqlQuery = `
    SELECT stop_id, stop_name, stop_lat, stop_lon
    FROM stops
    WHERE stop_name ILIKE $1
    ORDER BY stop_name
    LIMIT 5;
  `;

    const stops = await pool.query(sqlQuery, [`%${q}%`]);
    console.log({ stops: stops.rows });
    return NextResponse.json({ stops: stops.rows });
}
