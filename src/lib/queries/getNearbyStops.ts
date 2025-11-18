import { pool } from '../db/db';

export async function getNearbyStops(lat: number, lon: number, radius: number = 500) {
    const query = `
    SELECT *
    FROM get_nearby_stops($1, $2, $3)
    LIMIT 50;
  `;

    const { rows } = await pool.query(query, [lat, lon, radius]);
    return rows;
}

export async function getModesForStop(stopId: string) {
    const sql = `
    SELECT DISTINCT r.route_type
    FROM stop_times st
    JOIN trips t ON st.trip_id = t.trip_id  
    JOIN routes r ON t.route_id = r.route_id
    WHERE st.stop_id = $1
  `;

    const { rows } = await pool.query(sql, [stopId]);

    const routeTypes = rows.map((r) => Number(r.route_type));

    const modeMap = {
        700: 'bus',
        900: 'streetcar',
        400: 'subway',
    } as Record<number, string>;

    const modes = [...new Set(routeTypes.map((rt) => modeMap[rt]))];

    return modes;
}
