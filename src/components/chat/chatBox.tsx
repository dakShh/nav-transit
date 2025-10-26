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
            {/* <div className="p-4 border-b border-border flex items-center gap-2 shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Chat Assistant</h2>
            </div> */}
            {/* flex-1 min-h-0 max- */}
            <ScrollArea className="h-[75vh]  ">
                <div className="p-4">
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-primary-foreground animate-pulse" />
                            </div>
                            <div className="bg-card border border-border rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* {!tripData && messages.length === 1 && (
            <div className="p-4 border-t border-border shrink-0">
                <p className="text-xs text-muted-foreground mb-2">Try these examples:</p>
                <div className="flex flex-wrap gap-2">
                    {examplePrompts.map((prompt, i) => (
                        <Button
                            key={i}
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                                setInput(prompt);
                            }}
                            className="text-xs"
                        >
                            {prompt}
                        </Button>
                    ))}
                </div>
            </div>
        )} */}

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
