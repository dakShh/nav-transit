import { pool } from '../db/db';

/**
 * SQL Query: Get nearby stops using the database function
 */
export async function getNearbyStops(lat: number, lon: number, radius: number = 300) {
    const query = `
    SELECT *
    FROM get_nearby_stops($1, $2, $3)
    LIMIT 50;
  `;
    console.log('getNearbyStops: ', radius);
    const { rows } = await pool.query(query, [lat, lon, radius]);
    return rows;
}

/**
 * SQL Query: Get route types (modes) for a specific stop
 */
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

/**
 * SQL Query: Get stop information by stop_id
 */
export async function getStopInfo(stopId: string) {
    const query = `
      SELECT stop_id, stop_name, stop_lat, stop_lon
      FROM stops
      WHERE stop_id = $1
    `;
    const { rows } = await pool.query(query, [stopId]);
    return rows[0] || null;
}

/**
 * SQL Query: Get upcoming departures for a stop
 */
export async function getUpcomingDepartures(stopId: string, limit: number = 3) {
    const query = `
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
    LIMIT $2;
  `;

    const { rows } = await pool.query(query, [stopId, limit]);
    return rows;
}

/**
 * SQL Query: Get all stops for a trip ordered by stop_sequence
 */
export async function getRemainingStopsForTrip(tripId: string) {
    const query = `
          SELECT 
            st.stop_sequence,
            st.stop_id,
            s.stop_name,
            st.arrival_time,
            st.departure_time,
            st.trip_id
          FROM stop_times st
          JOIN stops s ON st.stop_id = s.stop_id
          WHERE st.trip_id = $1
          ORDER BY st.stop_sequence ASC;
        `;
    const { rows } = await pool.query(query, [tripId]);
    return rows;
}
