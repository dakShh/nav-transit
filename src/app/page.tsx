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

const BASIC_LLM_CHAT = '/api/chat';
const AGENT_LLM_CHAT = '/api/maps-agent';

export default function Home() {
    // const { messages, tripData, isLoading, sendMessage, resetChat } = useTripChat(AGENT_LLM_CHAT);
    const { user } = useUser();
    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted">
            <div className={cn('h-screen  mx-auto border shadow-xl', 'p-4', 'bg-white')}>
                <TransitMap user={user} />
                {/* <ChatBox messages={messages} isLoading={isLoading} sendMessage={sendMessage} /> */}
            </div>
        </div>
    );
}
