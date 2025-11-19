'use client';

// Components
import Header from '@/components/custom/header';
import { useTripChat } from '@/hooks/useTripChat';

// Icons
import ChatBox from '@/components/chat/chatBox';

// Maps integration
import TransitMap from '@/components/map/transitMap';
// import WayTransitMap from '@/components/map/wayTransitMap';
// import DirectionsMap from '@/components/map/directionsMap';

// Context
import { useUser } from '@/lib/contexts/userContext';

// Utils
import { cn } from '@/lib/utils';
import Link from 'next/link';

const BASIC_LLM_CHAT = '/api/chat';
const AGENT_LLM_CHAT = '/api/maps-agent';

export default function Home() {
    // const { messages, tripData, isLoading, sendMessage, resetChat } = useTripChat(AGENT_LLM_CHAT);
    const { user } = useUser();
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted">
            <div
                className={cn(
                    'mx-auto border shadow-xl min-h-screen',
                    'p-4',
                    'bg-white',
                    'flex flex-col space-y-4'
                )}
            >
                <TransitMap user={user} />
                {/* <ChatBox messages={messages} isLoading={isLoading} sendMessage={sendMessage} /> */}

                <Link href="/search" className="bg-primary rounded-2xl font-bold text-white px-4 py-2">
                    Search stops
                </Link>
            </div>
        </div>
    );
}
