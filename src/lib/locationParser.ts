// Simple location extraction from natural language
export function parseLocations(text: string): { origin?: string; destination?: string } {
    const fromMatch = text.match(/from\s+([^to]+?)(?:\s+to|\s*$)/i);
    const toMatch = text.match(/to\s+(.+?)(?:\s*$)/i);

    return {
        origin: fromMatch?.[1]?.trim(),
        destination: toMatch?.[1]?.trim(),
    };
}

// Mock geocoding - in real app would call Mapbox Geocoding API
export async function geocodeLocation(location: string, apiKey?: string): Promise<[number, number] | null> {
    // Common locations for demo
    const mockLocations: Record<string, [number, number]> = {
        'times square': [-73.985428, 40.758896],
        'jfk airport': [-73.778925, 40.639751],
        'central park': [-73.968285, 40.785091],
        'brooklyn bridge': [-73.996864, 40.706086],
        'empire state building': [-73.985656, 40.748817],
        'statue of liberty': [-74.044502, 40.689247],
    };

    const normalized = location.toLowerCase().trim();

    // Check mock locations first
    for (const [key, coords] of Object.entries(mockLocations)) {
        if (normalized.includes(key)) {
            return coords;
        }
    }

    // If we have API key, use Mapbox Geocoding
    if (apiKey) {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    location
                )}.json?access_token=${apiKey}&limit=1`
            );
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                return data.features[0].center as [number, number];
            }
        } catch (error) {
            console.error('Geocoding error:', error);
        }
    }

    return null;
}

// Mock route calculation
export async function calculateRoutes(
    origin: [number, number],
    destination: [number, number],
    apiKey?: string
) {
    // Calculate straight-line distance for mock data
    const distance = calculateDistance(origin, destination);

    const modes = [
        {
            mode: 'driving' as const,
            duration: Math.round(distance * 80), // ~45 km/h average
            distance: distance * 1000,
            cost: Math.round(distance * 2),
            icon: 'car',
            label: 'Driving',
        },
        {
            mode: 'transit' as const,
            duration: Math.round(distance * 120),
            distance: distance * 1100,
            cost: 2.75,
            icon: 'train',
            label: 'Public Transit',
        },
        {
            mode: 'cycling' as const,
            duration: Math.round(distance * 240),
            distance: distance * 1000,
            icon: 'bike',
            label: 'Cycling',
        },
        {
            mode: 'walking' as const,
            duration: Math.round(distance * 720),
            distance: distance * 1000,
            icon: 'walk',
            label: 'Walking',
        },
    ];

    return modes;
}

function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}
