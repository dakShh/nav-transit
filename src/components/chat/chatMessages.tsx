import { Message } from '@/types/trip';

// Icons
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex gap-3 mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
            )}
            <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isUser
                        ? 'bg-linear-to-br from-primary to-accent text-primary-foreground shadow-md'
                        : 'bg-card border border-border text-card-foreground shadow-sm'
                }`}
            >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                    12:40 pm
                    {/* {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })} */}
                </span>
            </div>
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-secondary-foreground" />
                </div>
            )}
        </div>
    );
}
