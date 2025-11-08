'use client';

// Components
import Header from '@/components/custom/header';
import { useTripChat } from '@/hooks/useTripChat';

// Icons
import ChatBox from '@/components/chat/chatBox';
// import WayTransitMap from '@/components/map/wayTransitMap';
import DirectionsMap from '@/components/map/directionsMap';

const BASIC_LLM_CHAT = '/api/chat';
const AGENT_LLM_CHAT = '/api/maps-agent';

export default function Home() {
    const { messages, tripData, isLoading, sendMessage, resetChat } = useTripChat(AGENT_LLM_CHAT);

    return (
        <div className="min-h-screen bg-linear-to-br from-background via-background to-muted">
            {/* Header */}
            <Header resetChat={resetChat} />
            {/* container mx-auto  h-[calc(100vh-140px)] */}
            <div className="h-[calc(100vh-100px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full md:px-4 md:pt-5">
                    <ChatBox messages={messages} isLoading={isLoading} sendMessage={sendMessage} />
                    <DirectionsMap />
                </div>
            </div>
        </div>
    );
}
