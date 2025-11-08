// hooks/useUserLocation.ts
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/lib/contexts/userContext';

export function useUserLocation() {
    const { user, updateUserLocation } = useUser();
    const [locationError, setLocationError] = useState<string | null>(null);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    useEffect(() => {
        // Only get location if user is logged in
        if (!user) return;

        // Check if we already have a recent location (within 5 minutes)
        // if (user.location) {
        //     const fiveMinutes = 5 * 60 * 1000;
        //     const isRecent = Date.now() - user.location.timestamp < fiveMinutes;
        //     if (isRecent) {
        //         return; // Skip if location is recent
        //     }
        // }

        getCurrentPosition();
    }, [user?.id]); // Run when user logs in or changes

    function getCurrentPosition() {
        setIsGettingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser');
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsGettingLocation(false);
                updateUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: Date.now(),
                });
            },
            (error) => {
                setIsGettingLocation(false);

                let errorMessage = 'An unknown error occurred';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out';
                        break;
                }

                setLocationError(errorMessage);
                console.error('Error getting location:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }

    return {
        location: user?.location,
        isGettingLocation,
        locationError,
        refreshLocation: getCurrentPosition,
    };
}
