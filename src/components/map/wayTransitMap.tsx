import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from 'react';
import MapLoader from '../custom/loaders/mapLoader';

const containerStyle = { width: '100%', height: '100%' };

export default function WayTransitMap() {
    const [center, setCenter] = useState({
        lat: -3.745,
        lng: -38.523,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        function getCurrentPosition() {
            setLoading(true);
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position.coords);
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
        <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            loadingElement={<WayTransitMapLoader />}
        >
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
}

function WayTransitMapLoader() {
    return (
        <div className="flex justify-center items-center h-full">
            <MapLoader />
        </div>
    );
}
