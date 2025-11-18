import { StopScheduleResponse } from '@/types/stops';
import ScheduleCard from './ScheduleCard';
import RouteViewer from './RouteViewer';

async function fetchStopSchedule(stopId: string): Promise<StopScheduleResponse> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stops/${stopId}/schedule`, {
        next: { revalidate: 20 },
    });
    if (!res.ok) throw new Error('Failed to load stop');
    return res.json();
}

type Props = { params: Promise<{ id: string }> };

export default async function StopPage({ params }: Props) {
    const { id: stopId } = await params;
    const data = await fetchStopSchedule(stopId);
    console.log('data: ', data);
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">🚏 {data.stop.stop_name}</h1>

            {/* Departures */}
            <section>
                <h2 className="text-xl font-semibold mb-3">Upcoming Departures</h2>
                <div className="space-y-4">
                    {data.departures.map((d) => (
                        <ScheduleCard key={d.trip_id} departure={d} />
                    ))}
                </div>
            </section>

            {/* Route Viewer */}
            {/* <section>
                <h2 className="text-xl font-semibold mb-3">Routes Serving This Stop</h2>
                <div className="space-y-4">
                    {data.routes.map((route, idx) => (
                        <RouteViewer key={idx} route={route} />
                    ))}
                </div>
            </section> */}
        </div>
    );
}
