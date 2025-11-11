// hooks/useNearbyPlaces.ts
'use client';

import { useState, useCallback } from 'react';

interface Location {
    lat: number;
    lng: number;
}

export interface Place {
    id: string;
    name: string;
    location: Location;
    types: string[];
    vicinity: string;
    rating?: number;
    openNow?: boolean;
}

interface UseNearbyPlacesOptions {
    radius?: number;
}

export function useNearbyPlaces(options: UseNearbyPlacesOptions = {}) {
    const { radius = 500 } = options;

    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchNearby = useCallback(
        async (location: Location, includedTypes: string[]) => {
            if (!location || includedTypes.length === 0) {
                setPlaces([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/places/nearby', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        location,
                        radius,
                        includedTypes,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch places');
                }

                const data = await response.json();
                // Remove duplicates based on place ID
                const uniquePlaces = Array.from(
                    new Map((data.places || []).map((place: Place) => [place.id, place])).values()
                ) as Place[];

                setPlaces(uniquePlaces);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching nearby places:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch places');
                setLoading(false);
            }
        },
        [radius]
    );

    const clearPlaces = useCallback(() => {
        setPlaces([]);
        setError(null);
    }, []);

    return {
        places,
        loading,
        error,
        searchNearby,
        clearPlaces,
    };
}
