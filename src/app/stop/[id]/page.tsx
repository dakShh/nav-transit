import { StopScheduleResponse } from '@/types/stops';
import ScheduleCard from '../schedule/ScheduleCard';
import RouteViewer from './RouteViewer';
import ScheduleList from '../schedule/ScheduleList';
import { fetchSchedules } from '@/lib/queries/serverFunctions';

type Props = { params: Promise<{ id: string }> };

export default async function StopPage({ params }: Props) {
    const { id: stopId } = await params;
    const result = await fetchSchedules(stopId, 3);

    if (!result.stop) {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <h1 className="text-3xl font-bold">Stop not found</h1>
            </div>
        );
    }

    // Transform the result to match StopScheduleResponse type
    const data: StopScheduleResponse = {
        stop: result.stop,
        upcomingDepartures: result.upcomingDepartures || [],
        routes: result.routes || [],
    };

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold">🚏 {data.stop.stop_name}</h1>

            {/* Departures */}
            <section>
                <h2 className="text-xl font-semibold mb-3">Upcoming Departures</h2>
                <div className="space-y-4">
                    <ScheduleList upcomingDepartures={data.upcomingDepartures || []} stopId={stopId} />
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
