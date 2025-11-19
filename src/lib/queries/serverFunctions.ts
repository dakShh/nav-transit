'use server';

import {
    getNearbyStops,
    getModesForStop,
    getStopInfo,
    getUpcomingDepartures,
    getRemainingStopsForTrip,
    getTripsByStopId,
} from './sqlQueries';

/**
 * Server Function: Fetch nearby stops with their modes
 */
export const fetchNearbyStops = async ({
    lat,
    lon,
    radius,
}: {
    lat: number;
    lon: number;
    radius?: number;
}) => {
    try {
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

        return results;
    } catch (error) {
        console.log('Error fetching nearby stops: ', error);
        throw error;
    }
};

/**
 * Server Function: Fetch remaining stops for a trip
 * @param tripId - The trip ID
 * @param fromStopId - Optional: filter stops after this stop_id
 */
export const fetchRemainingStops = async (tripId: string, fromStopId?: string) => {
    try {
        const allStops = await getRemainingStopsForTrip(tripId);

        // Filter: only stops with valid stop_id
        const remaining = allStops.filter((r: any) => r.stop_id != null);

        let filtered = remaining;
        if (fromStopId) {
            const index = remaining.findIndex((r: any) => r.stop_id === fromStopId);
            if (index !== -1) {
                filtered = remaining.slice(index + 1); // after this stop
            }
        }

        return filtered;
    } catch (error) {
        console.log('Error fetching remaining stops: ', error);
        throw error;
    }
};

/**
 * Server Function: Fetch schedule information for a stop
 * @param stopId - The stop ID
 * @param limit - Number of upcoming departures to return (default: 3)
 */
export const fetchSchedules = async (stopId: string, limit: number = 3) => {
    try {
        // Get stop info
        const stop = await getStopInfo(stopId);

        if (!stop) {
            return {
                stop: null,
                upcomingDepartures: [],
                routes: [],
            };
        }

        // Get upcoming departures
        const upcomingDepartures = await getUpcomingDepartures(stopId, limit);

        return {
            stop,
            upcomingDepartures: upcomingDepartures || [],
            routes: [],
        };
    } catch (error) {
        console.log('Error fetching schedules: ', error);
        throw error;
    }
};

export const fetchStops = async (stopId: number) => {
    try {
        const trips = await getTripsByStopId(stopId);

        return {
            trips,
        };
    } catch (error) {
        console.log('Error fetching schedules: ', error);
        throw error;
    }
};
