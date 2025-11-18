import React, { FunctionComponent, useState } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

import { CircleDotIcon } from 'lucide-react';
import { Location } from '@/types/user';
import { mode, Stop } from '@/lib/db/db';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const CustomAdvancedMarker = ({ position, stop }: { position: Location; stop: Stop }) => {
    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);
    const router = useRouter();
    // const renderCustomPin = () => {
    //     return (
    //         <div className="h-[34px] w-fit max-w-[34px] relative p-4  flex justify-center items-center rounded-full ">
    //             <span className="h-3 w-3 absolute z-50 bg-blue-700 border-2 border-blue-200 rounded-full"></span>
    //             <div className="absolute right-[-200px] h-30 w-50 bg-white"></div>
    //         </div>
    //     );
    // };

    const modesMap = {
        bus: 'bg-red-700',
        subway: 'bg-yellow-500',
        streetcar: 'bg-green-500',
    } as Record<mode, string>;

    function handleClick() {
        router.push(`/stop/${stop.stop_id}`);
    }

    return (
        <>
            <AdvancedMarker
                position={position}
                title={'AdvancedMarker with custom html content.'}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => handleClick()}
            >
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="h-[24px] w-fit max-w-[24px] relative p-3 bg-neutral-200 shadow-xl shadow-neutral-700 flex justify-center items-center rounded-full ">
                            <span
                                className={cn(
                                    // `${modesMap[stop]}`,
                                    stop.modes && `${modesMap[stop.modes[0] as mode]}`,
                                    'h-3 w-3 absolute z-50  border-2 border-white  rounded-full'
                                )}
                            ></span>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent
                        className={cn('[&_svg]:hidden!', 'bg-neutral-800 text-white font-bold px-10 py-2 ')}
                    >
                        {stop.stop_name}
                    </TooltipContent>
                </Tooltip>
            </AdvancedMarker>
        </>
    );
};
