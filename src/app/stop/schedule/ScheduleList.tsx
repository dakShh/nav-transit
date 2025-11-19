'use client';

import { UpcomingDeparture } from '@/types/stops';
import ScheduleCard from './ScheduleCard';
import { useState } from 'react';

interface ScheduleListProps {
    upcomingDepartures: UpcomingDeparture[];
    stopId: string;
}

export default function ScheduleList({ upcomingDepartures, stopId }: ScheduleListProps) {
    const [activeTripId, setActiveTripId] = useState<string | null>(null);

    const handleCardClick = (tripId: string) => {
        setActiveTripId(activeTripId === tripId ? null : tripId);
    };

    if (!upcomingDepartures || upcomingDepartures.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">No upcoming departures available</div>
        );
    }

    return (
        <div className="space-y-4">
            {upcomingDepartures.map((d) => (
                <ScheduleCard
                    key={d.trip_id}
                    upcomingDeparture={d}
                    stopId={stopId}
                    isActive={activeTripId === d.trip_id}
                    onCardClick={() => handleCardClick(d.trip_id)}
                />
            ))}
        </div>
    );
}
