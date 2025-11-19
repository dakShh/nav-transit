'use client';

import MapLoader from '@/components/custom/loaders/mapLoader';
import { UpcomingDeparture } from '@/types/stops';
import { useEffect, useState } from 'react';
import { fetchRemainingStops } from '@/lib/queries/serverFunctions';
import { formatCountdown, formatTime, getModeIcon } from '@/lib/utils';

export interface RemainingStop {
    stop_sequence: number;
    stop_id: string;
    stop_name: string;
    arrival_time: string;
    departure_time: string;
    trip_id: string;
}

interface ScheduleCardProps {
    upcomingDeparture: UpcomingDeparture;
    stopId: string;
    isActive: boolean;
    onCardClick: () => void;
}
export default function ScheduleCard({
    upcomingDeparture,
    stopId,
    isActive,
    onCardClick,
}: ScheduleCardProps) {
    // TODO: create a hook for countdown timer
    const [countdown, setCountdown] = useState<string>('');
    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const [hours, minutes, seconds] = upcomingDeparture.arrival_time.split(':').map(Number);

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
    }, [upcomingDeparture.arrival_time]);

    const [remainingStops, setRemainingStops] = useState<RemainingStop[]>([]);
    const [loadingRemainingStops, setLoadingRemainingStops] = useState<boolean>(false);

    const handleScheduleClick = async () => {
        setLoadingRemainingStops(true);
        onCardClick();
        try {
            const data = await fetchRemainingStops(upcomingDeparture.trip_id, stopId);
            setRemainingStops(data || []);
        } catch (error) {
            console.error('Failed to fetch remaining schedules:', error);
            setRemainingStops([]);
        }
        setLoadingRemainingStops(false);
    };

    // Reset remaining stops when this card becomes inactive
    useEffect(() => {
        if (!isActive) {
            setRemainingStops([]);
            setLoadingRemainingStops(false);
        }
    }, [isActive]);

    return (
        <div
            onClick={() => handleScheduleClick()}
            className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
        >
            <div>
                <p className="text-lg font-bold flex items-center gap-2">
                    {getModeIcon(upcomingDeparture.route_type)} {upcomingDeparture.route_short_name}
                </p>
                <p className="text-gray-600">{upcomingDeparture.trip_headsign}</p>

                {(loadingRemainingStops && (
                    <div className="mt-2 py-3 px-2">
                        <MapLoader />
                    </div>
                )) ||
                    remainingStops.map((stop, idx) => (
                        <RemainingStops
                            key={idx}
                            stopName={stop.stop_name}
                            stopArrivalTime={stop.arrival_time}
                        />
                    ))}
            </div>

            <div className="text-right">
                <p className="text-lg font-semibold">{formatTime(upcomingDeparture.arrival_time)}</p>
                <p className="text-gray-500 text-sm">Departure</p>
                {countdown && <p className="text-blue-600 font-medium text-sm mt-1">{countdown}</p>}
            </div>
        </div>
    );
}

function RemainingStops({ stopName, stopArrivalTime }: { stopName: string; stopArrivalTime: string }) {
    return (
        <div className="flex justify-between py-2 border-b last:border-0">
            <div>
                <p className="font-semibold">{stopName}</p>
            </div>

            <div className="text-right">
                <p className="text-blue-600">{formatTime(stopArrivalTime)}</p>
                <p className="text-gray-500 text-xs">Arrives</p>
            </div>
        </div>
    );
}
