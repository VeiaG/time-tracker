import { useNavigate,  } from "react-router-dom"
import { TypographyH3 } from "./ui/typography";

import { ScrollArea } from "@/components/ui/scroll-area"

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useContext } from "react";
import { TimerContext } from "@/contexts/TimerContext";
import {useDebounce} from '@react-hook/debounce'
import { getNumbersBySeconds } from "@/lib/timeUtils";
const SideBar = () => {
    const {timers,selectedTimerID,isPaused,seconds,toggleTimer,setSecondPage} = useContext(TimerContext);
    const [searchInput, setSearchInput] = useDebounce('');

    const navigate = useNavigate();
    
  return (
    <div className=" w-64 flex flex-col gap-3 h-full sticky top-0 max-h-full box-border pb-8 ">
        
        
        <TypographyH3>Усі таймери:</TypographyH3>
        <div className="relative mr-4">
            <i className="fa fa-search absolute left-2.5 top-2.5 h-3 w-3 text-gray-500 dark:text-gray-400" />
            <Input placeholder="Пошук" className="pl-8" onChange={(e)=>{setSearchInput(e.target.value)}}></Input>
        </div>
       
        <ScrollArea className="flex-grow h-[calc(100dvh-16rem)] relative w-full" >
            <div className="flex flex-col gap-4 pr-4 relative w-full">
                {timers && Object.entries(timers).filter(([,timer])=> timer.name.includes(searchInput)).map(([id,timer]) => {
                    const isCurrent = id===selectedTimerID;
                    return (
                        <div key={id} 
                            className="flex gap-0 items-center justify-between w-full">
                                <div className="flex flex-col gap-0 relative cursor-pointer flex-grow " 
                                    onClick={()=>{  
                                        setSecondPage({
                                            name:timer.name,
                                            url:`/${id}`
                                        })
                                        navigate(`/${id}`)
                                    }} >
                                    <h2 className=" font-bold text-xl truncate max-w-48 ">{timer.name}</h2>
                                    <p  className=" text-muted-foreground truncate max-w-48">
                                        Час: {getNumbersBySeconds(timer.totalTime,(isCurrent ? seconds : 0))}
                                    </p>
                                </div>
                                <Button size="icon" className="aspect-square "
                                    onClick={()=>toggleTimer(id)} 
                                    variant={isCurrent ? "default" : "outline"}>
                                    <i className={`fa fa-${isCurrent && !isPaused ? 'pause': 'play'} text-xl`} ></i>   
                                </Button>
                        </div>
                    
                    )
                })}
            </div>
        </ScrollArea>
    </div>
  )
}

export default SideBar