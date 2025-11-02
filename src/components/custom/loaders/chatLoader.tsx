// Icons
import { Sparkles } from 'lucide-react';

export default function ChatLoader() {
    return (
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
    );
}
