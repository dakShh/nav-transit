'use server';

// Third Party
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { AIMessage, createAgent, HumanMessage, SystemMessage } from 'langchain';

// Custom Tools
import { searchPlacesTool, getDirectionsTool, getPlaceDetailsTool } from '@/lib/tools/googleMaps';

const WAY_TRANSIT_SYSTEM_PROMPT =
    'You are a helpful assistant with access to Google Maps. Help users find places, get directions, and discover information about locations.';

export async function POST(req: Request) {
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

        // Define tools
        const tools = [searchPlacesTool, getDirectionsTool, getPlaceDetailsTool];

        const agent = createAgent({
            model,
            tools,
            systemPrompt: WAY_TRANSIT_SYSTEM_PROMPT,
        });

        const result = await agent.invoke({ messages: formattedMessages });
        return Response.json({
            response: result.messages[result.messages.length - 1].content,
        });
    } catch (error) {
        console.error('Agent error:', error);
        return Response.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
