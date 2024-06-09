import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { useTranslation } from "react-i18next";
import { Fragment, useContext, useState } from "react";
import { TimerContext } from "@/contexts/TimerContext";
import { getNumbersBySeconds } from "@/lib/timeUtils";
import { Check, Search, X } from "lucide-react";
import { useDebounce } from "@react-hook/debounce";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Timer } from "@/App";
import { set } from "date-fns";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type TimerPickerProps = {
    picked: string[]
    setPicked: (timers: string[]) => void
}
const TimerPicker = ({picked,setPicked}:TimerPickerProps) => {
    const {t} = useTranslation();
    const {timers,seconds,selectedTimerID} = useContext(TimerContext);

    const pickTimer = (id:string)=>{
        if(picked.includes(id)){
            const newPicked = [...picked];
            newPicked.splice(picked.indexOf(id),1);
            setPicked(newPicked);
        }else{
            setPicked([...picked,id]);
        }

    }
    const [parent,] = useAutoAnimate();
    const [searchInput, setSearchInput] = useDebounce('');

    const filteredTimers = timers && Object.entries(timers).filter(([,timer])=> timer.name.toLowerCase().includes(searchInput.toLowerCase())).map(([id,timer]) => {
        const isCurrent = id===selectedTimerID;
        const isPicked = picked.includes(id);
        return (<Fragment key={id}>
            <div  
                className="flex gap-0 items-center justify-between w-full">
                    <div className="flex flex-col gap-0 relative cursor-pointer flex-grow " >
                        <h2 className=" font-bold text-xl truncate max-w-48 ">{timer.name}</h2>
                        <p  className=" text-muted-foreground truncate max-w-48">
                            {t("Time")}: {getNumbersBySeconds(timer.totalTime,(isCurrent ? seconds : undefined))}
                        </p>
                    </div>
                    <Button size="icon" className="aspect-square "
                        onClick={()=>{
                                pickTimer(id);
                            }
                        } 
                        variant={isPicked ? "default" : "outline"}>
                            {
                                !isPicked ? 
                                <Check />:
                                <X/>
                            }
                    </Button>
            </div>
            <Separator />
            </Fragment>
        )
    });

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t("pick Timers")}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                <div className="relative mr-4">
                    <Search size={16}
                        className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
                    <Input placeholder={t("Sidebar search")} className="pl-8" onChange={(e)=>{setSearchInput(e.target.value)}}></Input>
                </div>
                <ScrollArea className="flex-grow  relative w-full h-[40dvh]">

                    <div className="flex flex-col gap-2 pr-4 relative w-full"
                    ref={parent}>
                        {filteredTimers}
                    </div>
                    
                </ScrollArea>
            </div>
        </CardContent>
    </Card>
  )
}

export default TimerPicker