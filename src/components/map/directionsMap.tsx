import { useEffect, useState } from 'react';

import { APIProvider, Map, useMapsLibrary, useMap, Marker } from '@vis.gl/react-google-maps';
import MapLoader from '../custom/loaders/mapLoader';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function DirectionsMap() {
    const [loading, setLoading] = useState(true);

    const [center, setCenter] = useState({
        lat: 43.69091398202488,
        lng: -79.3150643224835,
    });

    useEffect(() => {
        function getCurrentPosition() {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('position: ', position.coords);
                setLoading(false);
                setCenter({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            });
        }

        getCurrentPosition();
    }, []);

    if (loading) return <WayTransitMapLoader />;

    return (
        <div className="hidden lg:flex lg:col-span-2 flex-col gap-6 h-full overflow-auto">
            {/* Map */}
            <div className="h-full border border-border rounded-2xl overflow-hidden">
                <APIProvider apiKey={API_KEY}>
                    <Map
                        defaultCenter={center}
                        defaultZoom={9}
                        gestureHandling={'greedy'}
                        fullscreenControl={false}
                    >
                        <Marker position={center} />
                    </Map>
                    <Directions />
                </APIProvider>
            </div>
        </div>
    );
}

function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    // Initialize directions service and renderer
    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(
            new routesLibrary.DirectionsRenderer({
                draggable: false, // Only necessary for draggable markers
                map,
            })
        );
    }, [routesLibrary, map]);

    // Add the following useEffect to make markers draggable
    useEffect(() => {
        if (!directionsRenderer) return;

        // Add the listener to update routes when directions change
        const listener = directionsRenderer.addListener('directions_changed', () => {
            const result = directionsRenderer.getDirections();
            if (result) {
                setRoutes(result.routes);
            }
        });

        return () => google.maps.event.removeListener(listener);
    }, [directionsRenderer]);

    // Use directions service
    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;
        directionsService
            .route({
                origin: '1168 woodbine ave',
                destination: '101 lawton blvd',
                travelMode: google.maps.TravelMode.TRANSIT,
                provideRouteAlternatives: true,
            })
            .then((response) => {
                console.log('direction service response: ', response);
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            });

        return () => directionsRenderer.setMap(null);
    }, [directionsService, directionsRenderer]);

    // Update direction route
    useEffect(() => {
        if (!directionsRenderer) return;
        directionsRenderer.setRouteIndex(routeIndex);
    }, [routeIndex, directionsRenderer]);

    return <div></div>;
}

function WayTransitMapLoader() {
    return (
        <div className="flex justify-center items-center h-full">
            <MapLoader />
        </div>
    );
}
