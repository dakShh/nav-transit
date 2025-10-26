import { MapPin, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

export default function Header({ resetChat }: { resetChat: () => void }) {
    return (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">TripPlanner AI</h1>
                        <p className="text-xs text-muted-foreground">Your journey companion</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={resetChat}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        New Trip
                    </Button>
                </div>
            </div>
        </header>
    );
}
