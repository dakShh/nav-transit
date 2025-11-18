// lib/db.ts
import { Pool } from 'pg';
import path from 'path';

import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Create a connection pool (reuse connections)
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export type mode = 'bus' | 'subway' | 'streetcar';

// Type definitions
export interface Stop {
    stop_id: string;
    stop_code: string | null;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    stop_desc?: string | null;
    distance_meters?: number;
    modes?: mode[];
}

export interface Route {
    route_id: string;
    route_short_name: string;
    route_long_name: string;
    route_desc: string | null;
    route_type: number;
    route_color: string | null;
    route_text_color: string | null;
}

export interface StopSchedule {
    trip_id: string;
    route_short_name: string;
    route_long_name: string;
    route_type: number;
    route_color: string | null;
    arrival_time: string;
    departure_time: string;
    trip_headsign: string | null;
    stop_sequence: number;
}
