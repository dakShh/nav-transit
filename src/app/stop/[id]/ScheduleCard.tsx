'use client';

import { Departure } from '@/types/stops';

function getModeIcon(routeType: number) {
    if (routeType === 700) return '🚌'; // Bus
    if (routeType === 900) return '🚋'; // Streetcar
    if (routeType === 400) return '🚇'; // Subway
    return '🚏';
}

export default function ScheduleCard({ departure }: { departure: Departure }) {
    return (
        <div className="border rounded-lg p-4 shadow-sm flex justify-between items-center">
            <div>
                <p className="text-lg font-bold flex items-center gap-2">
                    {getModeIcon(departure.route_type)} {departure.route_short_name}
                </p>
                <p className="text-gray-600">{departure.trip_headsign}</p>
            </div>

            <div className="text-right">
                <p className="text-lg font-semibold">{departure.arrival_time}</p>
                <p className="text-gray-500 text-sm">Departure</p>
            </div>
        </div>
    );
}
