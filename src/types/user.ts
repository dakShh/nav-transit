export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
    location?: Location;
}

export type Location = {
    lat: number;
    lng: number;
    timestamp: number;
};
