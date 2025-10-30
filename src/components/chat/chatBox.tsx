'use client';

import { Send, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

import { useTripChat } from '@/hooks/useTripChat';
import { ChatMessage } from './chatMessages';
import { useState } from 'react';

import { Message, TripData } from '@/types/trip';
import ChatLoader from '../custom/chatLoader';

export default function ChatBox({
    messages,
    isLoading,
    sendMessage,
}: {
    messages: Message[];
    isLoading: boolean;
    sendMessage: (content: string) => Promise<void>;
}) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    const examplePrompts = [
        'From Times Square to JFK Airport',
        'From Central Park to Brooklyn Bridge',
        'From Empire State Building to Statue of Liberty',
    ];

    return (
        <div className="flex flex-col">
            <ScrollArea className="h-full">
                <div className="p-4">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && <ChatLoader />}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-border shrink-0">
                <div className="flex gap-2">
                    <Input
                        placeholder="Where do you want to go?"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
