import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        // Initialize Gemini
        const model = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-pro',
            temperature: 0.7,
            maxRetries: 2,
            apiKey: process.env.GOOGLE_API_KEY,
            maxOutputTokens: 2048,

            // other params...
        });

        // Convert message history to LangChain format
        const formattedMessages = messages.map((msg: any) => {
            if (msg.role === 'system') {
                return new SystemMessage(msg.content);
            } else if (msg.role === 'user') {
                return new HumanMessage(msg.content);
            } else {
                return new AIMessage(msg.content);
            }
        });

        // Add system message if not present
        if (formattedMessages[0]?.constructor.name !== 'SystemMessage') {
            formattedMessages.unshift(
                new SystemMessage(
                    'You are a helpful AI trip planning assistant. Help users plan their journeys by providing information about routes, transportation modes, and travel times. Be concise and friendly.'
                )
            );
        }

        // Get response from Gemini
        const response = await model.invoke(formattedMessages);

        return NextResponse.json({
            message: response.content,
        });
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process chat request' },
            { status: 500 }
        );
    }
}
