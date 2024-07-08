import {  TimerDates } from "@/App";
import { TimerContext } from "@/contexts/TimerContext";
import { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import localforage from "localforage";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,

    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CustomTooltip from "./CustomTooltip";
import { useTranslation } from "react-i18next";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getNumbersBySeconds, round } from "@/lib/timeUtils";
import {  CalendarCheck, Pause, Pencil, Play, Settings, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { DateRange } from "react-day-picker";
import { uk } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,

    DropdownMenuTrigger,

  } from "@/components/ui/dropdown-menu"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ScrollArea } from "./ui/scroll-area";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import TimerPicker from "./TimerPicker";
import { MobileContext } from "@/contexts/MobileContext";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { TypographyH1, TypographyH3, TypographyLead, TypographyMuted } from "./ui/typography";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type TimerObject = {
    [key:string]:TimerDates
}
type TransformedObject = { name: string, [key: string]: number | string }[]
const GroupView = () => {
    const {
        isSidebarOpened,
    } = useContext(MobileContext);
    function rainbowHSL(numOfSteps, step, saturation = 100, lightness = 70) {
        const h = (step / numOfSteps) * 360; 
        return `hsla(${h}, ${saturation}%, ${lightness}%,1)`;
    }
    const {t,i18n} = useTranslation();
    const params = useParams();
    const id = params?.id as string;
    const {seconds,selectedTimerID,timers,groups,toggleTimer,isPaused,setGroups,deleteGroup} = useContext(TimerContext);
    const [timersObjects,setTimersObjects] = useState<TimerObject>({}); 
    function transformTimerObject(timerObject: TimerObject):TransformedObject {
        const result: Array<{ name: string, [key: string]: number | string }> = [];
    
        // Отримуємо всі можливі дати (ключі внутрішніх об'єктів)
        const allDates = new Set<string>();
        for (const id in timerObject) {
            for (const date in timerObject[id]) {
                allDates.add(date);
            }
        }
        
    
        // Створюємо об'єкт для кожної дати і додаємо відповідні значення
        allDates.forEach((date) => {
            const obj: { name: string, [key: string]: number | string } = { name: date };
            for (const id in timerObject) {
                const isCurrent = id===selectedTimerID;
                let addSeconds = {day:date,ms:0};
    
                if(seconds){
                    addSeconds = seconds?.find(({day})=>{
                        return day === date;
                    }) || {day:date,ms:0};
                }
                if (timerObject[id][date] !== undefined) {
                    

                    obj[id] = timerObject[id][date] + (isCurrent ? addSeconds?.ms : 0);
                    
                } else {
                    obj[id] = (isCurrent ? addSeconds?.ms : 0); 
                }
            }
            result.push(obj);
        });
        result.sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
        return result;
    }
    function getTransformedTimerObjectByRange(startDate:Date,endDate:Date,TransformedObject:TransformedObject):TransformedObject{

        const diff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const newObj = [...TransformedObject];
        for(let i = 0; i <= diff; i++){
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + i);
            const date = currentDate.toDateString();
            const emptyObject = {name:date};
            groups[id]?.timers.forEach((timerID) => {
                emptyObject[timerID] = 0;
            });
            if(!newObj.find((value)=>value.name === date)){
                newObj.push(emptyObject);
            }
        }
        if(startDate === endDate){
            return newObj.filter((value)=>value.name === startDate.toDateString());
        }
        return newObj.filter((value)=>new Date(value.name) >= startDate && new Date(value.name) <= endDate)
        .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
        
    }
    const getAllDates = (timerObject:TransformedObject):TransformedObject => {
       
        const firstDate = new Date(timerObject[0]?.name || new Date());
        const todayDate = new Date();
       
        return getTransformedTimerObjectByRange(firstDate,todayDate,timerObject)
    }
    const currentData = transformTimerObject(timersObjects);
    
    const resultObj = getAllDates(currentData);
    const sum : number = currentData.reduce((acc, obj) => {
        for (const key in obj) {
            if (key !== 'name') {
                acc +=  Number(obj[key]);
            }
        }
        return acc;
    },0);
    const medium = sum/currentData.length;
    const todayObj = resultObj.find((value)=>value.name === new Date().toDateString());
    const todaySum = todayObj ? Object.keys(todayObj).reduce((acc,cur)=>{
        if(cur !== 'name'){
            acc += Number(todayObj[cur]);
        }
        return acc;
    },0) : 0;
    




    
    const colors = groups[id]?.timers.map((value,index)=>rainbowHSL(groups[id]?.timers.length,index));
    useEffect(()=>{
        groups[id]?.timers.forEach((timerID) => {
            if(timers[timerID] === undefined){
                const currentGroup = groups[id];
                const newTimers = currentGroup.timers.filter((value)=>value!==timerID);
                setGroups({...groups,[id]:{...currentGroup,timers:newTimers}});

            }
        });
    },[timers,groups,id]);
    useEffect(()=>{
        const getData = async ()=>{
            if(groups[id]){
                const tempObject:TimerObject = {};
                for(const timerID of groups[id].timers){
                    await localforage.getItem(timerID).then((data)=>{
                        if(data){
                            tempObject[timerID] = data as TimerDates;
                            
                        }
                        else{
                            tempObject[timerID] = {};
                        }
                    });
                }

                setTimersObjects(tempObject);
            }
        }
        getData();
    },[groups,timers,id]);
    const navigate = useNavigate();
    const [parent,] = useAutoAnimate();
    const filteredTimers = groups[id]?.timers.map((timerID,index) => {
        const isCurrent = timerID===selectedTimerID;
        if(timers[timerID] === undefined){
            return null;
        }
        return (<Fragment key={timerID}>
            <div  
                className="flex gap-2 items-center justify-between w-full">
                    <div className="flex flex-col gap-0 relative cursor-pointer flex-grow " 
                        onClick={()=>{
                            navigate(`/${timerID}`);
                        }} >
                        <div className="flex gap-2 items-center ">
                            <div className="h-4 w-4" style={{background:colors[index]}}></div>
                            <h2 className=" font-bold text-xl truncate max-w-40  ">
                                
                                {timers[timerID].name}
                            </h2>
                        </div>
                        <p  className=" text-muted-foreground truncate max-w-40">
                            {t("Time")}: {getNumbersBySeconds(timers[timerID].totalTime,(isCurrent ? seconds : undefined))}
                        </p>
                    </div>
                    <Button size="icon" className="aspect-square "
                        onClick={()=>{
                            toggleTimer(timerID);
                            }
                        } 
                        variant={isCurrent ? "default" : "outline"}>
                            {(isCurrent && !isPaused)? 
                                <Pause size={16} strokeWidth={2} fill="currentColor"/>:
                                <Play size={16} strokeWidth={4} fill="currentColor" /> } 
                    </Button>
            </div>
            <Separator/>
            </Fragment>
        )
    });

    // details page

    const today = new Date();
    const [viewRange, setViewRange] = useState<DateRange | undefined>({
        from:today,
        to:today
    });
    const locale = useMemo(() => {
        return i18n.language==="uk" ? { locale: uk }: {}
    }, [i18n.language]);
    const startDate = useMemo(() => {
        return viewRange?.from || today
    }, [viewRange]);


    const endDate = useMemo(()=>viewRange?.to || startDate ,[viewRange,startDate])

    
    const timerDates =  useMemo(
        ()=> getTransformedTimerObjectByRange(startDate,endDate,currentData)
    ,[startDate,endDate,currentData])
    const rangeTotal = useMemo(()=>{
        return timerDates.reduce((acc, obj) => {
            for (const key in obj) {
                if (key !== 'name') {
                    acc +=  Number(obj[key]);
                }
            }
            return acc;
        },0);
    },[timerDates]);
    
    const rangeMedium = useMemo(()=>{
        return round(rangeTotal / timerDates.filter(cur => {

            for(const key in cur){
                if(key !== 'name'){
                    if( Number(cur[key])  > 0){
                        return true;
                    }

                }
            }
            return false;
        }).length,2) || 0;
    },[rangeTotal,timerDates])

    const [isDialog, setIsDialog] = useState(false);
    const [value, setValue] = useState('' as string);
    const [pickedTimers,setPickedTimers] = useState<string[]>([]);
    const nullFunction = useCallback(()=>{
        setValue(groups[id]?.name || '');
        setPickedTimers(groups[id]?.timers || []);
    },[groups,id]);
    useEffect(()=>{
        if(!isDialog){
            nullFunction();
        }
    },[isDialog,nullFunction]);
    const [chartConfig,setChartConfig] = useState<ChartConfig>({
        ms:{
            label: t("Dashboard timeElapsed"),
            color: "#2563eb",
        }
    });
    useEffect(()=>{
        const tempConfig:ChartConfig = {}
        groups[id]?.timers.forEach((timerID,index)=>{
            tempConfig[timerID] = {
                label: timers[timerID]?.name,
                color: colors[index]
            }
        });
        console.log('tempConfg change')
        setChartConfig({...tempConfig});
    },[groups,timers]);
  return groups[id] ? (
    <div className="w-full h-full max-h-full gap-4 pt-8 flex container grow relative pb-16 sm:pb-4 items-start">
        <div className={
            cn(`
                lg:transform-none lg:sticky fixed left-0 w-full duration-300 transition-[transform,opacity] lg:w-64 flex flex-col 
            gap-3 h-full top-0 pt-8 sm:pt-24 pb-24 sm:pb-2 px-8 lg:px-0 lg:pt-0 lg:top-20  max-h-full box-border  shrink-0  bg-background z-10
            lg:opacity-100`,
            isSidebarOpened ? "translate-x-0 opacity-1" : "-translate-x-full opacity-0 ")
        }>
            <ScrollArea className="flex-grow h-[calc(100dvh-24rem)] relative w-full" >
                <div ref={parent} className="flex flex-col gap-2 pr-4 relative w-full">
                    {filteredTimers?.length>0 ? <>
                        <Separator/>
                        {filteredTimers}
                        </> : <p className="text-muted-foreground">{t("Sidebar noTimers")}</p>
                    }
                </div>
            </ScrollArea>

        </div>
        <div className="flex flex-col gap-2 items-start justify-start flex-grow">

        
       <div>
        <TypographyH1 className="w-full flex justify-start items-start">
                        <div className=" max-w-xs sm:max-w-sm lg:max-w-2xl
                        truncate  h-16 ">{groups?.[id]?.name}</div>
                    </TypographyH1>
            <TypographyMuted>{groups?.[id]?.timers.length || 0} {t("timers group")}</TypographyMuted>
       </div>
        <Dialog open={isDialog} onOpenChange={setIsDialog}><AlertDialog>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="absolute right-8 ">
                    <Settings/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
                <DropdownMenuGroup>
                <DialogTrigger asChild>
                <DropdownMenuItem>  
                    <Pencil className="mr-2 h-3 w-3"/>
                    <span>{t("Edit")}</span>
                </DropdownMenuItem>
                </DialogTrigger>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem className=" text-red-800 dark:text-red-400">
                        <Trash className="mr-2 h-3 w-3"/>
                        {t("Delete")}
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>{t("Are you sure?")}</AlertDialogTitle>
                <AlertDialogDescription>
                    {t("deleteGroup desc")}
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                    deleteGroup(id);
                    navigate('/groups')
                }}>{t("Delete")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            <DialogContent >
                    <DialogHeader>
                    <DialogTitle>{t("editGroup title")}</DialogTitle>
                    <DialogDescription>{t("editGroup desc")}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4">
                <Label>
                {t("groupName")}
                </Label>
                <Input value={value} onChange={(e)=>setValue(e.target.value)}  />
                </div>
                <div className="flex flex-col gap-4">
                    <TimerPicker picked={pickedTimers} setPicked={setPickedTimers}/>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={()=>setIsDialog(false)} >Cancel</Button>
                    <Button variant="default" onClick={()=>{
                        const currentGroup = groups[id];
                        currentGroup.name = value;
                        currentGroup.timers = pickedTimers;
                        setGroups({...groups,[id]:{...currentGroup}});
                        setIsDialog(false);
                    }}>Edit</Button>
                </DialogFooter>
                    
            </DialogContent>
        </AlertDialog></Dialog>
       
        <Tabs defaultValue="main" className="grow flex flex-col w-full justify-center items-center relative">
             <TabsList >
                <TabsTrigger value="main">{t("timers tab1")}</TabsTrigger>
                <TabsTrigger value="details">{t("timers tab2")}</TabsTrigger>
            </TabsList>
            <TabsContent value="main" className='w-full'>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full mt-4">
                    <Card className=''>
                        <CardHeader>
                            <CardTitle>
                            {getNumbersBySeconds(sum)}
                            </CardTitle>
                            <CardDescription>{t("Dashboard timeElapsed")}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className=''>
                        <CardHeader>
                            <CardTitle>
                            {getNumbersBySeconds(medium)}
                            </CardTitle>
                            <CardDescription>{t("timers average")}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className=''>
                        <CardHeader>
                            <CardTitle>
                            {getNumbersBySeconds(todaySum)}
                            </CardTitle>
                            <CardDescription>{t("Dashboard today")}</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="lg:col-span-3 order-3 sm:col-span-2">
                        <CardHeader>
                            <CardDescription>{t("timers activity")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[128px] w-full max-h-[352px]">
                        <BarChart 
                            data={resultObj}
                            accessibilityLayer

                        >
                            <CartesianGrid />

                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString()
                                }
                                />
                            <ChartTooltip
                                // cursor={false}
                                content={<ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString()
                                    }
                                    valueFormatter={(value) => getNumbersBySeconds(value)}
                                     />}
                            />
                            {
                                    resultObj && Object.keys(timersObjects).map((timerID,index)=>(
                                        <Bar
                                            key={timerID}
                                            dataKey={timerID}
                                            stackId={1}
                                            fill={colors[index]}
                                        />
                                    ))
                                }
                            <Bar
                            dataKey={"ms"}
                            radius={4} 
                            fill="var(--color-ms)"
                            />
                        </BarChart>
                        </ChartContainer>
                        </CardContent>
                    </Card>

                </div>
            </TabsContent>
            <TabsContent value="details" className='w-full'>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mt-4 ">
                    <Card >
                        <CardHeader className='flex-row sm:justify-between justify-center sm:space-y-1.5 space-y-0 relative'>
                            <div className='flex flex-col sm:space-y-1.5  items-center sm:items-start '>
                            <CardTitle>
                                {t("Range")}
                            </CardTitle>
                            <CardDescription>
                                {format(startDate,'d MMMM yyyy',locale)} - {format(endDate,'d MMMM yyyy',locale)}
                            </CardDescription>
                            </div>
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button variant='outline' size='icon' className='sm:relative absolute right-6 sm:right-auto'>
                                    <CalendarCheck size={18} strokeWidth={2} />
                                    {/* {t("pick range")} */}
                                    </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                mode="range"
                                selected={viewRange}
                                onSelect={setViewRange}
                                numberOfMonths={1}
                                {...locale}
                            />
                            </PopoverContent>
                        </Popover>
                        </CardHeader>
                    </Card>
                    <Card>
                    <CardHeader>
                        <CardTitle>
                        {getNumbersBySeconds(rangeTotal)}
                        </CardTitle>
                        <CardDescription>{t("Dashboard timeElapsed")}</CardDescription>
                    </CardHeader>
                    </Card>
                    <Card>
                    <CardHeader>
                        <CardTitle>
                        {getNumbersBySeconds(rangeMedium)}
                        </CardTitle>
                        <CardDescription>{t("Average")}</CardDescription>
                    </CardHeader>
                    </Card>
                    
                    <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardDescription>{t("activity on range")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[128px] w-full max-h-[352px]">
                        <BarChart 
                            data={timerDates}
                            accessibilityLayer
                        >
                            <CartesianGrid />

                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString()
                                }
                                />
                            <ChartTooltip
                                // cursor={false}
                                content={<ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString()
                                    }
                                    valueFormatter={(value) => getNumbersBySeconds(value)}
                                     />}
                            />
                            {
                                    timerDates && Object.keys(timersObjects).map((timerID,index)=>(
                                        <Bar
                                            key={timerID}
                                            dataKey={timerID}
                                            stackId={1}
                                            fill={colors[index]}
                                        />
                                    ))
                                }
                        </BarChart>
                        </ChartContainer>
                        
                    </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
        </div>
    </div>
  ) : (<div className="flex flex-col gap-4 items-center justify-center min-h-32 w-full">
        <TypographyLead>{t("group notFound")}</TypographyLead>
        <Link to="/groups">{t("back to groups")}</Link>
    </div>)

}

export default GroupView