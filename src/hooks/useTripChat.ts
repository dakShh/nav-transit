import { useState, useCallback } from 'react';
import { Message, TripData } from '@/types/trip';
import { parseLocations, geocodeLocation, calculateRoutes } from '@/lib/locationParser';

export function useTripChat(apiKey?: string) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content:
                "Hi! I'm your trip planning assistant. Tell me where you'd like to go, and I'll help you find the best way to get there.\n\nFor example: 'I need to get from Times Square to JFK Airport'",
            timestamp: new Date('Sun Oct 26 2025 16:36:51 GMT-0400 (Eastern Daylight Time)'),
        },
    ]);
    const [tripData, setTripData] = useState<TripData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(
        async (content: string) => {
            const userMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);

            try {
                // Parse locations from message
            } catch (error) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I encountered an error planning your trip. Please try again.',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, assistantMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [apiKey]
    );

    const resetChat = useCallback(() => {
        setMessages([
            {
                id: '1',
                role: 'assistant',
                content:
                    "Hi! I'm your trip planning assistant. Tell me where you'd like to go, and I'll help you find the best way to get there.\n\nFor example: 'I need to get from Times Square to JFK Airport'",
                timestamp: new Date(),
            },
        ]);
        setTripData(null);
    }, []);

    return {
        messages,
        tripData,
        isLoading,
        sendMessage,
        resetChat,
    };
}
