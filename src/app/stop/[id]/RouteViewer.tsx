'use client';

import { RouteWithStops } from '@/types/stops';
import { useState } from 'react';

export default function RouteViewer({ route }: { route: RouteWithStops }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border rounded-lg">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between p-4 font-semibold text-left"
            >
                <span>
                    🚏 {route.route_short_name} — {route.route_long_name}
                </span>
                <span>{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="px-4 pb-4 space-y-2 max-h-72 overflow-y-scroll">
                    {route.stops.map((s, idx) => (
                        <div key={idx} className="flex justify-between border-b py-2 text-sm">
                            <span>
                                {s.stop_sequence}. {s.stop_name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
