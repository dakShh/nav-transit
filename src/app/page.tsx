'use client';

// Components
import Header from '@/components/custom/header';
import { Card } from '@/components/ui/card';
import { useTripChat } from '@/hooks/useTripChat';

// Icons
import { MapPin } from 'lucide-react';
import ChatBox from '@/components/chat/chatBox';
import WayTransitMap from '@/components/map/wayTransitMap';

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
                    {/* Chat Panel */}
                    <ChatBox messages={messages} isLoading={isLoading} sendMessage={sendMessage} />

                    {/* Results Panel */}
                    <div className="hidden lg:flex lg:col-span-2 flex-col gap-6 h-full overflow-auto">
                        {/* Map */}
                        <div className="h-full border border-border rounded-2xl overflow-hidden">
                            <WayTransitMap />
                        </div>

                        {/* Transport Options */}
                        {tripData && (
                            <div className="flex-1 min-h-0">
                                <h3 className="text-lg font-semibold mb-4 text-foreground">
                                    Transport Options
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {tripData.modes.map((mode, i) => (
                                        <div>TransportCard</div>
                                        // <TransportCard key={i} mode={mode} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {tripData && (
                            <Card className="flex-1 flex items-center justify-center p-8 border-border bg-muted/30">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                        <MapPin className="w-8 h-8 text-primary-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                                        Ready to Plan Your Trip?
                                    </h3>
                                    <p className="text-sm text-muted-foreground max-w-sm">
                                        Tell me your origin and destination, and I'll show you the best ways
                                        to get there with time estimates and costs.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
