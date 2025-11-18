import { pool } from '@/lib/db/db';
import { NextResponse } from 'next/server';

export async function GET(eq: Request, { params }: { params: Promise<{ stop_id: string }> }) {
    const { stop_id } = await params;
    const stopId = stop_id; // You can rename it if you want

    // 1️⃣ Get stop info
    const stopQuery = `
      SELECT stop_id, stop_name, stop_lat, stop_lon
      FROM stops
      WHERE stop_id = $1
    `;
    const { rows: stopRows } = await pool.query(stopQuery, [stopId]);

    if (stopRows.length === 0) {
        return NextResponse.json({ error: 'Stop not found' }, { status: 404 });
    }

    const stop = stopRows[0];

    // 1. Get upcoming departures
    const upcomingQuery = `
    SELECT 
      st.trip_id,
      st.arrival_time,
      st.departure_time,
      st.stop_sequence,
      t.route_id,
      t.trip_headsign,
      r.route_short_name,
      r.route_long_name,
      r.route_type
    FROM stop_times st
    JOIN trips t ON st.trip_id = t.trip_id
    JOIN routes r ON t.route_id = r.route_id
    WHERE st.stop_id = $1
      AND st.arrival_time > TO_CHAR(NOW()::time, 'HH24:MI:SS')
    ORDER BY st.arrival_time
    LIMIT 20;
  `;

    const { rows: departures } = await pool.query(upcomingQuery, [stopId]);

    // No departures now
    if (departures.length === 0) {
        return NextResponse.json({
            stop,
            departures: [],
            routes: [],
        });
    }

    // 2. For each departure, load remaining stops
    const schedules = await Promise.all(
        departures.map(async (dep) => {
            const remainingQuery = `
        SELECT 
          st2.stop_id,
          s.stop_name,
          st2.arrival_time,
          st2.departure_time,
          st2.stop_sequence
        FROM stop_times st_cur
        JOIN stop_times st2 ON st2.trip_id = st_cur.trip_id
        JOIN stops s ON s.stop_id = st2.stop_id
        WHERE st_cur.stop_id = $1
          AND st2.trip_id = $2
          AND st2.stop_sequence >= st_cur.stop_sequence
        ORDER BY st2.stop_sequence;
      `;

            const { rows: remainingStops } = await pool.query(remainingQuery, [stopId, dep.trip_id]);

            return {
                ...dep,
                remainingStops,
            };
        })
    );

    // 3️⃣ Get full route path (all stops) for each trip
    // const routesMap = new Map();

    // await Promise.all(
    //     departures.map(async (dep) => {
    //         const routeId = dep.route_id;

    //         // Skip if already fetched this route
    //         if (routesMap.has(routeId)) return;

    //         const routeStopsQuery = `
    //           SELECT
    //             st.stop_id,
    //             s.stop_name,
    //             st.stop_sequence
    //           FROM stop_times st
    //           JOIN stops s ON s.stop_id = st.stop_id
    //           JOIN trips t ON t.trip_id = st.trip_id
    //           WHERE t.route_id = $1
    //           ORDER BY st.stop_sequence;
    //   `;

    //         const { rows: routeStops } = await pool.query(routeStopsQuery, [routeId]);

    //         routesMap.set(routeId, {
    //             route_id: routeId,
    //             route_short_name: dep.route_short_name,
    //             route_long_name: dep.route_long_name,
    //             route_type: dep.route_type,
    //             stops: routeStops,
    //         });
    //     })
    // );
    // routes: Array.from(routesMap.values())
    return NextResponse.json({
        stop,
        departures,
        routes: [],
    });
}
