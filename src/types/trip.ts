export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
}

export interface TransportMode {
    mode: 'driving' | 'walking' | 'cycling' | 'transit';
    duration: number;
    distance: number;
    cost?: number;
    icon: string;
    label: string;
}

export interface TripData {
    origin: string;
    destination: string;
    originCoords: [number, number];
    destinationCoords: [number, number];
    modes: TransportMode[];
}
