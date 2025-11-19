'use client';

// Core
import { useState } from 'react';

// Utils
import { cn } from '@/lib/utils';

// Components
import StopSearch from './StopSearch';

export default function SearchStops() {
    return (
        <div className="min-h-screen ">
            <div
                className={cn(
                    'mx-auto border shadow-xl min-h-screen',
                    'p-4',
                    'bg-white',
                    'flex flex-col space-y-4'
                )}
            >
                <StopSearch />
            </div>
        </div>
    );
}
