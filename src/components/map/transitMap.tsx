import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
    Marker,
    AdvancedMarker,
    Pin,
    MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import MapLoader from '../custom/loaders/mapLoader';

import { Location, User } from '@/types/user';
import { useUserLocation } from '@/hooks/useUserLocation';

// icons
import { Loader2, Navigation, Bus, Train, Bike, CircleDashed } from 'lucide-react';
import { Place } from '@/hooks/useNearbyPlaces';
import { cn, debounce } from '@/lib/utils';

// components
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
const DEFAULT_MAP_COORDINATES = {
    lat: 0,
    lng: 0,
} as Location;

interface TransitPlace {
    id: string;
    name: string;
    location: { lat: number; lng: number };
    types: string[];
    vicinity: string;
    rating?: number;
    openNow?: boolean;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function TransitMap({ user }: { user: User | null }) {
    const { isGettingLocation, locationError } = useUserLocation();
    const [center, setCenter] = useState<Location>(DEFAULT_MAP_COORDINATES);
    const markersRef = useRef<any[]>([]);

    const [transitPlaces, setTransitPlaces] = useState<TransitPlace[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([
        'transit_station',
        'bus_station',
        'subway_station',
    ]);

    // Debounced camera change callback
    const handleCameraChanged = useCallback((event: MapCameraChangedEvent) => {
        const { center } = event.detail;
        searchNearbyTransit(center as Location);
        // You can fetch nearby data here
    }, []);

    const debouncedCameraChange = useMemo(() => debounce(handleCameraChanged, 1000), [handleCameraChanged]);

    async function searchNearbyTransit(center: Location) {
        console.log('searchNearbyTransit called....');
        setTransitPlaces([]);

        setLoading(true);
        setError(null);

        if (selectedTypes.length === 0) {
            setTransitPlaces([]);
            setLoading(false);
            return;
        }

        try {
            // Use the NEW Places API - send all types in one request
            const response = await fetch('/api/places/nearby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: center,
                    radius: 400,
                    includedTypes: selectedTypes, // New API accepts multiple types
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch places');
            }

            const data = await response.json();
            console.log('places: ', data.places);
            setTransitPlaces(data.places || []);
            setLoading(false);
        } catch (err) {
            console.error('Error searching transit:', err);
            setError(err instanceof Error ? err.message : 'Failed to search transit locations');
            setLoading(false);
        }
    }

    function getPlaceTypeLabel(types: string[]): string {
        if (types.includes('subway_station')) return '🚇';
        if (types.includes('bus_station')) return '🚌';
        if (types.includes('light_rail_station')) return '🚊';
        if (types.includes('train_station')) return '🚆';
        if (types.includes('transit_station')) return '🚉';
        return '📍 Transit Stop';
    }

    function toggleType(type: string) {
        setSelectedTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    }

    const CustomPin = ({ place }: { place: Place }) => {
        const placeLabel = getPlaceTypeLabel(place.types);
        return (
            <HoverCard>
                <HoverCardTrigger asChild>
                    <div className={cn('text-[24px]')}>{placeLabel}</div>
                </HoverCardTrigger>
                <HoverCardContent className="bg-neutral-800 w-fit px-2 py-1 text-neutral-100 ">
                    <div>{place.name}</div>
                </HoverCardContent>
            </HoverCard>
        );
    };

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
                            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
                            defaultCenter={user?.location || DEFAULT_MAP_COORDINATES}
                            defaultZoom={16}
                            gestureHandling={'greedy'}
                            fullscreenControl={false}
                            disableDefaultUI
                            // onCameraChanged={debouncedCameraChange}
                        >
                            {user?.location && <Marker position={user.location} />}

                            {transitPlaces?.map((place, index) => (
                                <AdvancedMarker key={place.id} position={place.location}>
                                    <CustomPin place={place} />
                                </AdvancedMarker>
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
