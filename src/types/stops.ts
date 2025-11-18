export interface StopInfo {
    stop_id: string;
    stop_name: string;
}

export interface Departure {
    trip_id: string;
    route_id: string;
    route_short_name: string;
    route_long_name: string;
    route_type: number;
    trip_headsign: string;
    arrival_time: string;
    departure_time: string;
    stop_sequence: number;
}

export interface RouteStop {
    stop_id: string;
    stop_name: string;
    stop_sequence: number;
}

export interface RouteWithStops {
    route_id: string;
    route_short_name: string;
    route_long_name: string;
    route_type: number;
    stops: RouteStop[];
}

export interface StopScheduleResponse {
    stop: StopInfo;
    departures: Departure[];
    routes: RouteWithStops[];
}
