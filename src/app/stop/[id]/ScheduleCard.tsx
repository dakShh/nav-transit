'use client';

import { Departure } from '@/types/stops';
import { useEffect, useState } from 'react';

function getModeIcon(routeType: number) {
    if (routeType === 700) return '🚌'; // Bus
    if (routeType === 900) return '🚋'; // Streetcar
    if (routeType === 400) return '🚇'; // Subway
    return '🚏';
}

function formatCountdown(ms: number): string {
    if (ms <= 0) return 'Now';

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

function formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export default function ScheduleCard({ departure }: { departure: Departure }) {
    const [countdown, setCountdown] = useState<string>('');
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const [hours, minutes, seconds] = departure.arrival_time.split(':').map(Number);

            // Create target date for today
            const target = new Date();
            target.setHours(hours, minutes, seconds || 0, 0);

            // If the time has already passed today, assume it's for tomorrow
            if (target < now) {
                target.setDate(target.getDate() + 1);
            }

            const diff = target.getTime() - now.getTime();
            setCountdown(formatCountdown(diff));
        };

        // Update immediately
        updateCountdown();

        // Update every second
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [departure.arrival_time]);

    return (
        <div className="border rounded-lg p-4 shadow-sm flex justify-between items-center">
            <div>
                <p className="text-lg font-bold flex items-center gap-2">
                    {getModeIcon(departure.route_type)} {departure.route_short_name}
                </p>
                <p className="text-gray-600">{departure.trip_headsign}</p>
            </div>

            <div className="text-right">
                <p className="text-lg font-semibold">{formatTime(departure.arrival_time)}</p>
                <p className="text-gray-500 text-sm">Departure</p>
                {countdown && <p className="text-blue-600 font-medium text-sm mt-1">{countdown}</p>}
            </div>
        </div>
    );
}
