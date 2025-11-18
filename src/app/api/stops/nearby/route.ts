import { NextRequest, NextResponse } from 'next/server';
import { getModesForStop, getNearbyStops } from '@/lib/queries/getNearbyStops';

export async function GET(req: NextRequest) {
    const lat = Number(req.nextUrl.searchParams.get('lat'));
    const lon = Number(req.nextUrl.searchParams.get('lon'));
    const radius = Number(req.nextUrl.searchParams.get('radius') ?? 500);

    if (!lat || !lon) {
        return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
    }

    const stops = await getNearbyStops(lat, lon, radius);

    const results = await Promise.all(
        stops.map(async (stop) => {
            const modes = await getModesForStop(stop.stop_id);
            return {
                ...stop,
                modes,
            };
        })
    );

    return NextResponse.json(results);
}
