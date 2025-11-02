import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export const searchPlacesTool = new DynamicStructuredTool({
    name: 'search_places',
    description: 'Search for places using Google Maps. Returns name, address, rating, and coordinates.',
    schema: z.object({
        query: z.string().describe("The search query (e.g., 'pizza near times square')"),
        location: z.string().optional().describe('Optional location to center search'),
    }),
    func: async ({ query, location }) => {
        try {
            const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
            url.searchParams.append('query', query);
            if (location) url.searchParams.append('location', location);
            url.searchParams.append('key', GOOGLE_MAPS_API_KEY!);

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.status !== 'OK') {
                return `Error: ${data.status}`;
            }

            const results = data.results.slice(0, 5).map((place: any) => ({
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
            }));

            return JSON.stringify(results, null, 2);
        } catch (error) {
            return `Error searching places: ${error}`;
        }
    },
});

export const getDirectionsTool = new DynamicStructuredTool({
    name: 'get_directions',
    description: 'Get driving directions between two locations',
    schema: z.object({
        origin: z.string().describe('Starting location (address or place name)'),
        destination: z.string().describe('Destination location (address or place name)'),
        mode: z.enum(['driving', 'walking', 'bicycling', 'transit']).optional().default('driving'),
    }),
    func: async ({ origin, destination, mode }) => {
        try {
            const url = new URL('https://maps.googleapis.com/maps/api/directions/json');
            url.searchParams.append('origin', origin);
            url.searchParams.append('destination', destination);
            url.searchParams.append('mode', mode);
            url.searchParams.append('key', GOOGLE_MAPS_API_KEY!);

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.status !== 'OK') {
                return `Error: ${data.status}`;
            }

            const route = data.routes[0];
            const leg = route.legs[0];

            return JSON.stringify(
                {
                    distance: leg.distance.text,
                    duration: leg.duration.text,
                    start_address: leg.start_address,
                    end_address: leg.end_address,
                    steps: leg.steps.map((step: any) => ({
                        instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
                        distance: step.distance.text,
                        duration: step.duration.text,
                    })),
                },
                null,
                2
            );
        } catch (error) {
            return `Error getting directions: ${error}`;
        }
    },
});

export const getPlaceDetailsTool = new DynamicStructuredTool({
    name: 'get_place_details',
    description: 'Get detailed information about a specific place including hours, phone, website',
    schema: z.object({
        placeId: z.string().describe('The Google Place ID'),
    }),
    func: async ({ placeId }) => {
        try {
            const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
            url.searchParams.append('place_id', placeId);
            url.searchParams.append('key', GOOGLE_MAPS_API_KEY!);

            const response = await fetch(url.toString());
            const data = await response.json();

            if (data.status !== 'OK') {
                return `Error: ${data.status}`;
            }

            const place = data.result;
            return JSON.stringify(
                {
                    name: place.name,
                    address: place.formatted_address,
                    phone: place.formatted_phone_number,
                    website: place.website,
                    rating: place.rating,
                    opening_hours: place.opening_hours?.weekday_text,
                },
                null,
                2
            );
        } catch (error) {
            return `Error getting place details: ${error}`;
        }
    },
});
