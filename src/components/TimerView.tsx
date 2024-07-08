import {  useContext, useMemo, useState } from 'react';
import {Timer,TimerDates,} from '../App';
import localforage from 'localforage';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, BarChart } from 'recharts';
import { TypographyH1, TypographyLead } from "./ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,

    DropdownMenuTrigger,

  } from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent,
    CardDescription,

    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
import { getNumbersBySeconds, getTimerDatesByRange ,round,getTimerDatesAll } from "@/lib/timeUtils";
import { Input } from './ui/input';
import { Label } from "@/components/ui/label"
import CustomTooltip from "./CustomTooltip";
import { Calendar } from "@/components/ui/calendar"

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
import { DateRange } from 'react-day-picker';
import { TimerContext } from '@/contexts/TimerContext';
  
import { uk } from 'date-fns/locale';
import { format } from 'date-fns';
import { ElapsedTime } from '@/hooks/useTimer';
import { CalendarCheck, Circle, CircleDot, Maximize, Pause, Pencil, Play, Settings, Trash } from 'lucide-react';
import { GoogleContext } from '@/contexts/GoogleContext';
import { useTranslation } from 'react-i18next';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const TimerView = () => {
    const {
        unselectTimer,
        timers,
        selectedTimerID,
        isPaused,
        toggleTimer,
        seconds,
        setTimers,
        deleteTimer,
        setIsZenMode
    } = useContext(TimerContext);
    const {t} = useTranslation();
    const params = useParams();
    const id = params?.id as string;
    
    const [currentTimer,setCurrentTimer] = useState<Timer>(timers[id] || undefined);
    
    const [currentId,setCurrentId] = useState<string>(id);
    const [currentTimerDate,setCurrentTimerDate] = useState<TimerDates>({});
    
    const [isCurrentPaused , setIsCurrentPaused] = useState<boolean>(true);
    
    // const [additionalSeconds , setAdditionalSeconds] = useState<ElapsedTime>(seconds);

    useEffect(() => {
        if(currentId && timers){
            // setCurrentId(currentId);
            setCurrentTimer(timers[currentId]);
            localforage.getItem<TimerDates>(currentId).then((data) => {
                if(data){
                    setCurrentTimerDate(data);
                }
                else{
                    setCurrentTimerDate({});
                }
            });
        }
    },[currentId,timers]);

    useEffect(() => {
        if(currentId !== id){
            setCurrentId(id);
        }
    },[id,currentId]);

    const additionalSeconds =  selectedTimerID !== currentId ? undefined : seconds;


    useEffect(()=>{
        if(currentId === selectedTimerID){
            setIsCurrentPaused(isPaused);
        }
        else{
            setIsCurrentPaused(true);
        }
    },[selectedTimerID,isPaused,currentId]);

    
    const allDates = getTimerDatesAll(currentTimerDate,additionalSeconds);
    

    const allDatesMedium = useMemo(()=>{
        return round(
            (allDates.reduce((acc, cur) => {
                if (cur.ms > 0) {
                    return acc + cur.ms;
                }
                return acc;
            }, 0) / allDates.filter(cur => cur.ms > 0).length), 2
        ) || 0;
    },[allDates])
    

    const [renameInput, setRenameInput] = useState<string>('');
    
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const {syncWithGoogleDrive} = useContext(GoogleContext);
   
    const chartConfig = {
        ms:{
          label: t("Dashboard timeElapsed"),
          color: "#2563eb",
        },
      } satisfies ChartConfig;
    
    return currentTimer ? (
        <div className="flex flex-col gap-4 items-start ">
            <div className="flex items-center justify-between w-full relative" >
                <TypographyH1 className="w-full flex justify-center items-center">
                    <div className=" max-w-xs sm:max-w-sm lg:max-w-2xl
                    truncate text-center h-16 ">{currentTimer?.name}</div>
                </TypographyH1>
                <Dialog onOpenChange={(open:boolean)=>{
                    if(!open){setRenameInput('') ;}
                    setEditDialogOpen(open);
                }} open={editDialogOpen}><AlertDialog>
                <DropdownMenu>
                
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" className='aspect-square absolute right-0 top-0' variant="outline">
                            <Settings size={18} strokeWidth={2}  />
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
                            {t("Timer delete desc")}
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>{
                            if(currentId === selectedTimerID){
                                unselectTimer();
                            }
                            deleteTimer(currentId);
                            navigate('/')
                        }}>{t("Delete")}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    <DialogContent >
                        <DialogHeader>
                            <DialogTitle>{t("Edit timer title")}</DialogTitle>
                            <DialogDescription>
                                {t("Edit timer desc")}
                            </DialogDescription>
                        </DialogHeader>
                        <Label htmlFor='name'>{t("Edit timer name")}</Label>
                        <Input 
                            id="name"
                            value={renameInput}
                            onChange={(e)=>setRenameInput(e.target.value)}/>
                        <DialogFooter>
                            <Button type="submit" onClick={()=>{
                                setTimers({...timers,[currentId]:{...currentTimer,name:renameInput, totalTime: currentTimer?.totalTime || 0}});
                                setEditDialogOpen(false);
                                setRenameInput('');
                                syncWithGoogleDrive(true);
                            }}>{t("Edit timer save")}</Button>
                        </DialogFooter>
                            
                    </DialogContent>
                </AlertDialog></Dialog>
                
            </div>
            <Tabs defaultValue="main" className="flex flex-col w-full justify-center items-center relative" >
            <TabsList >
                <TabsTrigger value="main">{t("timers tab1")}</TabsTrigger>
                <TabsTrigger value="details">{t("timers tab2")}</TabsTrigger>
            </TabsList>
            <TabsContent value="main" className='w-full' >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full mt-4 ">
                    <Card className='order-1 lg:order-none'>
                    <CardHeader>
                        <CardTitle>
                        {getNumbersBySeconds(currentTimer?.totalTime, additionalSeconds)}
                        </CardTitle>
                        <CardDescription>{t("Dashboard timeElapsed")}</CardDescription>
                    </CardHeader>
                    </Card>
                    <Card className='order-3 sm:col-span-2 lg:order-none lg:col-span-1'>
                    <CardHeader className='sm:items-center h-full justify-center '>
                        <div className="flex gap-2 items-center">
                            <Button onClick={()=>{
                                    if(currentId === selectedTimerID){
                                        unselectTimer();
                                    }
                                    else{
                                        unselectTimer(currentId);
                                    }
                                }} 
                                    aria-label="Zen режим" variant='outline' size="sm">
                                    {
                                        currentId !== selectedTimerID ? 
                                        <Circle size={16} strokeWidth={3} /> :
                                        <CircleDot size={16} strokeWidth={3} />
                                        
                                    }
                            </Button>
                            <Button onClick={()=>toggleTimer(currentId)} size="icon"
                                aria-label={isCurrentPaused ? 'Старт' : 'Продовжити'}>
                                {isCurrentPaused? 
                                    <Play size={16} strokeWidth={4} fill="currentColor" /> : 
                                    <Pause size={16} strokeWidth={2} fill="currentColor"/>
                                }
                            </Button>
                            <Button disabled={!(currentId === selectedTimerID)} onClick={()=>{
                                if(currentId === selectedTimerID){
                                    setIsZenMode(true);
                                }
                            }} 
                                aria-label="Zen режим" variant='outline' size="sm">
                                <Maximize size={16} strokeWidth={4}/>
                            </Button>
                        </div>
                    </CardHeader>
                    </Card>
                    <Card className='order-1 lg:order-none'>
                    <CardHeader >
                        <CardTitle>
                        {getNumbersBySeconds(allDatesMedium)}
                        </CardTitle>
                        <CardDescription>{t("timers average")}</CardDescription>
                    </CardHeader>
                    </Card>
                    
                    <Card className=" lg:col-span-3 order-3 sm:col-span-2">
                    <CardHeader>
                        <CardDescription>{t("timers activity")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[128px] w-full max-h-[352px]">
                        <BarChart 
                            data={allDates}
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
                                    formatter={
                                        (value) => getNumbersBySeconds(value as number)
                                    }
                                    hideIndicator />}
                            />
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
            <TabsContent value="details" className='w-full' >
                <DetailsView 
                currentTimerDate={currentTimerDate} 
                additionalSeconds={additionalSeconds}/>
            </TabsContent>
            </Tabs>
        </div>
    ) : (
        <div className="flex flex-col gap-4 items-center justify-center min-h-32 w-full">
            <TypographyLead>{t("timer notFound")}</TypographyLead>
            <Link to="/">{t("back to main")}</Link>
        </div>
    
    )
}
type DetailsViewProps = {
    currentTimerDate:TimerDates,
    additionalSeconds:ElapsedTime
}

const DetailsView = ({currentTimerDate,additionalSeconds}:DetailsViewProps)=>{
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const [viewRange, setViewRange] = useState<DateRange | undefined>({
        from:today,
        to:today
    });
    const {t, i18n } = useTranslation();
    const locale = useMemo(() => {
        return i18n.language==="uk" ? { locale: uk }: {}
    }, [i18n.language]);
    const startDate = useMemo(() => {
        
        return viewRange?.from || today
    }, [viewRange]);


    const endDate = useMemo(()=>viewRange?.to || startDate ,[viewRange,startDate])

    
    const timerDates = useMemo(()=>{
        return getTimerDatesByRange(startDate,endDate,currentTimerDate,additionalSeconds);
    },[startDate,endDate,currentTimerDate,additionalSeconds])
        
    const rangeTotal = useMemo(()=>{
        return round(
            (timerDates.reduce((acc, cur) => {
                return acc + cur.ms;
            }, 0)),2
        );
    },[timerDates])
    
    const rangeMedium = useMemo(()=>{
        return round(rangeTotal / timerDates.filter(cur => cur.ms > 0).length,2) || 0;
    },[rangeTotal,timerDates])
    const chartConfig = {
        ms:{
          label: t("Dashboard timeElapsed"),
          color: "#2563eb",
        },
      } satisfies ChartConfig;
    
    return (
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
                                    formatter={
                                        (value) => getNumbersBySeconds(value as number)
                                    }
                                    hideIndicator />}
                            />
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
    )
}

export default TimerView