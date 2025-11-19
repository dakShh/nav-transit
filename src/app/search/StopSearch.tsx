'use client';

import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

import AutoComplete from '@/components/custom/autoComplete';

export default function StopSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query.length < 2) return setResults([]);

        async function searchStops() {
            const res = await fetch(`/api/stops/search?q=${query}`);
            const data = await res.json();
            setResults(data);
        }

        searchStops();
    }, [query]);

    return (
        <div className="w-full max-w-lg mx-auto">
            {/* <Input
                className="w-full p-2 border rounded"
                placeholder="Search stops (Finch Station, Kennedy...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            /> */}

            <AutoComplete />
        </div>
    );
}
