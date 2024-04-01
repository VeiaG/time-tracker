import { useNavigate,  } from "react-router-dom"
import { TypographyH3 } from "./ui/typography";

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Fragment, useContext } from "react";
import { TimerContext } from "@/contexts/TimerContext";
import {useDebounce} from '@react-hook/debounce'
import { getNumbersBySeconds } from "@/lib/timeUtils";
import { Separator } from "@/components/ui/separator"
import { MobileContext } from "@/contexts/MobileContext";
import { Pause, Play, Search } from "lucide-react";

const SideBar = () => {
    const {timers,selectedTimerID,isPaused,seconds,toggleTimer} = useContext(TimerContext);
    const {
        isSidebarOpened,
        setIsSidebarOpened,
    } = useContext(MobileContext);
    const [searchInput, setSearchInput] = useDebounce('');

    const navigate = useNavigate();
    const filteredTimers = timers && Object.entries(timers).filter(([,timer])=> timer.name.toLowerCase().includes(searchInput.toLowerCase())).map(([id,timer]) => {
        const isCurrent = id===selectedTimerID;
        return (<Fragment key={id}>
            <div  
                className="flex gap-0 items-center justify-between w-full">
                    <div className="flex flex-col gap-0 relative cursor-pointer flex-grow " 
                        onClick={()=>{
                            navigate(`/${id}`);
                            setIsSidebarOpened(false);
                        }} >
                        <h2 className=" font-bold text-xl truncate max-w-48 ">{timer.name}</h2>
                        <p  className=" text-muted-foreground truncate max-w-48">
                            Час: {getNumbersBySeconds(timer.totalTime,(isCurrent ? seconds : undefined))}
                        </p>
                    </div>
                    <Button size="icon" className="aspect-square "
                        onClick={()=>{
                            toggleTimer(id);
                            setIsSidebarOpened(false);
                            }
                        } 
                        variant={isCurrent ? "default" : "outline"}>
                            {(isCurrent && !isPaused)? 
                                <Pause size={16} strokeWidth={2} fill="currentColor"/>:
                                <Play size={16} strokeWidth={4} fill="currentColor" /> } 
                    </Button>
            </div>
            <Separator />
            </Fragment>
        )
    });

  return (
    <div className={
        cn(`lg:transform-none lg:sticky fixed left-0 w-full duration-300 transition-[transform,opacity] lg:w-64 flex flex-col 
        gap-3 h-full top-0  pt-8 sm:pt-24 pb-24 sm:pb-8 px-8 lg:px-0 lg:pt-0 lg:top-20  max-h-full box-border  shrink-0  bg-background z-10
        lg:opacity-100 `,
        isSidebarOpened ? "translate-x-0 opacity-1" : "-translate-x-full opacity-0 ")
    }>
        
        
        <TypographyH3>Усі таймери:</TypographyH3>
        <div className="relative mr-4">
            <Search size={16}
                className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
            <Input placeholder="Пошук" className="pl-8" onChange={(e)=>{setSearchInput(e.target.value)}}></Input>
        </div>
       
        <ScrollArea className="flex-grow h-[calc(100dvh-16rem)] relative w-full " >
            <div className="flex flex-col gap-2 pr-4 relative w-full">
                {filteredTimers.length>0 ? <>
                    <Separator/>
                    {filteredTimers}
                </> : <p className="text-muted-foreground">Таймерів не знайдено.</p>}
            </div>
        </ScrollArea>
    </div>
  )
}

export default SideBar