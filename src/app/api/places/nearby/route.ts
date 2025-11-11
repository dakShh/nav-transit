import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { location, radius = 500, includedTypes } = await request.json();

        // Validate input
        if (!location || !location.lat || !location.lng) {
            return NextResponse.json({ error: 'Location with lat and lng is required' }, { status: 400 });
        }

        if (!includedTypes || includedTypes.length === 0) {
            return NextResponse.json({ error: 'includedTypes array is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Google Maps API key not configured' }, { status: 500 });
        }

        // Use the NEW Places API (searchNearby)
        const url = 'https://places.googleapis.com/v1/places:searchNearby';

        const requestBody = {
            includedTypes: includedTypes,
            maxResultCount: 20,
            locationRestriction: {
                circle: {
                    center: {
                        latitude: location.lat,
                        longitude: location.lng,
                    },
                    radius: radius,
                },
            },
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                // Request specific fields to optimize cost
                'X-Goog-FieldMask':
                    'places.id,places.displayName,places.location,places.types,places.formattedAddress,places.rating,places.currentOpeningHours',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Places API error:', errorText);
            return NextResponse.json(
                { error: `Places API error: ${response.status}`, details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        // Transform the response to a cleaner format
        const places = (data.places || []).map((place: any) => ({
            id: place.id,
            name: place.displayName?.text || 'Unknown',
            location: {
                lat: place.location?.latitude,
                lng: place.location?.longitude,
            },
            types: place.types || [],
            vicinity: place.formattedAddress || '',
            rating: place.rating,
            openNow: place.currentOpeningHours?.openNow,
        }));

        return NextResponse.json({
            places,
            count: places.length,
        });
    } catch (error) {
        console.error('Error in places API route:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// GET endpoint to test the API
export async function GET() {
    return NextResponse.json({
        message: 'Places API endpoint is working',
        usage: 'Send POST request with { location: { lat, lng }, radius, includedTypes: [] }',
    });
}
