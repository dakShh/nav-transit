import { useEffect, useState } from 'react';

import { APIProvider, Map, useMapsLibrary, useMap, Marker } from '@vis.gl/react-google-maps';
import MapLoader from '../custom/loaders/mapLoader';

import { User } from '@/types/user';
import { useUserLocation } from '@/hooks/useUserLocation';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const DEFAULT_MAP_COORDINATES = {
    lat: 0,
    lng: 0,
};

export default function TransitMap({ user }: { user: User | null }) {
    const { isGettingLocation, locationError } = useUserLocation();

    return (
        <div className="relative lg:flex lg:col-span-2 flex-col gap-6 h-full overflow-auto">
            {locationError && (
                <div className="absolute z-50 top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-3xl text-sm">
                    {locationError}
                </div>
            )}
            {(isGettingLocation && <WayTransitMapLoader />) || (
                <div className="h-full border border-border rounded-2xl overflow-hidden">
                    <APIProvider apiKey={API_KEY} onError={(error) => console.error('map error: ', error)}>
                        <Map
                            defaultCenter={user?.location || DEFAULT_MAP_COORDINATES}
                            defaultZoom={11}
                            gestureHandling={'greedy'}
                            fullscreenControl={false}
                        >
                            {user?.location && <Marker position={user.location} />}
                        </Map>
                    </APIProvider>
                </div>
            )}
        </div>
    );
}

function WayTransitMapLoader() {
    return (
        <div className="flex justify-center items-center h-full">
            <MapLoader />
        </div>
    );
}
