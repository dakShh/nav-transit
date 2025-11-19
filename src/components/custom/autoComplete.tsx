'use client';
// Core
import { useState, useCallback, useEffect } from 'react';

// Components
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';

// utils
import { debounce } from '@/lib/utils';

interface Stops {
    stop_id: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
}

export default function AutoComplete() {
    const [userInput, setUserInput] = useState('');
    const [stops, setStops] = useState<Stops[]>([]);

    const handleUserInput = useCallback(
        debounce((input: string) => {
            setUserInput(input);
        }, 1000),
        []
    );

    useEffect(() => {
        if (userInput.length < 2) return setStops([]);

        async function searchStops() {
            const res = await fetch(`/api/stops/search?q=${userInput}`);
            const data = await res.json();
            setStops(data?.stops || []);
        }

        searchStops();
    }, [userInput]);

    return (
        <div className="flex flex-col  relative">
            <div className="flex">
                <Command className="rounded-lg border" shouldFilter={false}>
                    <CommandInput
                        placeholder="Search by stop name"
                        defaultValue={userInput}
                        onValueChange={(v) => handleUserInput(v)}
                        className="bg-transparent"
                    />
                    {stops.length > 0 && (
                        <CommandList>
                            {/* <CommandEmpty>No results found.</CommandEmpty> */}
                            <CommandGroup>
                                {stops.map((s, i) => (
                                    <CommandItem
                                        key={i}
                                        value={s.stop_id}
                                        // onSelect={(value) => handleSelectedPlace(value)}
                                    >
                                        {s.stop_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                        </CommandList>
                    )}
                </Command>
            </div>
        </div>
    );
}
