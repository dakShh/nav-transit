import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import MapLoader from '../custom/loaders/mapLoader';

import { User } from '@/types/user';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useEffect, useState } from 'react';
import { Stop } from '@/lib/db/db';
import { CustomAdvancedMarker } from './customAdvMarker';
import { fetchNearbyStops } from '@/lib/queries/serverFunctions';
import { cn } from '@/lib/utils';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const DEFAULT_MAP_COORDINATES = {
    lat: 0,
    lng: 0,
};

export default function TransitMap({ user }: { user: User | null }) {
    const { isGettingLocation, locationError } = useUserLocation();
    const [nearbyStop, setNearbyStops] = useState<Stop[]>([]);

    useEffect(() => {
        if (user?.location) {
            fetchNearbyStops({
                lat: user.location.lat,
                lon: user.location.lng,
            })
                .then((stops) => {
                    if (stops?.length) {
                        setNearbyStops(stops);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching nearby stops: ', error);
                });
        }
    }, [user?.location]);

    return (
        <div className="relative lg:flex lg:col-span-2 flex-col gap-6 h-full overflow-auto">
            {locationError && (
                <div className="absolute z-50 top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-3xl text-sm">
                    {locationError}
                </div>
            )}
            {(isGettingLocation && <WayTransitMapLoader />) || (
                <div
                    className={cn(
                        'max-h-[55vh]',
                        'h-full border border-border rounded-2xl overflow-hidden'
                    )}
                >
                    <APIProvider apiKey={API_KEY} onError={(error) => console.error('map error: ', error)}>
                        <Map
                            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID! as string}
                            defaultCenter={user?.location || DEFAULT_MAP_COORDINATES}
                            defaultZoom={18}
                            gestureHandling={'greedy'}
                            fullscreenControl={false}
                            disableDefaultUI
                        >
                            {user?.location && <Marker position={user.location} />}
                            {nearbyStop.length > 0 &&
                                nearbyStop.map((s, i) => (
                                    <CustomAdvancedMarker
                                        key={i}
                                        position={{ lat: s.stop_lat, lng: s.stop_lon, timestamp: 0 }}
                                        stop={s}
                                    ></CustomAdvancedMarker>
                                ))}
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
