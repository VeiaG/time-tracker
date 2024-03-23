import { ReactElement, useContext, useState } from 'react';
import {Timer,TimerDates,} from '../App';
import localforage from 'localforage';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TypographyH1, TypographyLead, TypographyMuted } from "./ui/typography";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
  } from "@/components/ui/dropdown-menu"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
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

const TimerView = () => {
    const {unselectTimer,timers,selectedTimerID,isPaused,toggleTimer,seconds,setTimers,deleteTimer,setSecondPage} = useContext(TimerContext);
    
    
    const [currentTimer,setCurrentTimer] = useState<Timer>();
    const params = useParams();
    const id = params?.id as string;
    const [currentId,setCurrentId] = useState<string>(id);
    const [currentTimerDate,setCurrentTimerDate] = useState<TimerDates>({});
    
    const [isCurrentPaused , setIsCurrentPaused] = useState<boolean>(true);
    
    const [additionalSeconds , setAdditionalSeconds] = useState<number>(seconds);

    useEffect(() => {
        if(currentId && timers){
            setCurrentId(currentId);
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

    useEffect(() => {
        if(selectedTimerID !== currentId){
            setAdditionalSeconds(0);
        }
        else{
            setAdditionalSeconds(seconds);
        }
    },[currentId,selectedTimerID,seconds]);

    useEffect(()=>{
        if(currentId === selectedTimerID){
            setIsCurrentPaused(isPaused);
        }
        else{
            setIsCurrentPaused(true);
        }
    },[selectedTimerID,isPaused,currentId]);

    
    const allDates = getTimerDatesAll(currentTimerDate,additionalSeconds);
    
    const allDatesData = allDates.map((day) => {
        return {
        name: day.name,
        hours: day.ms,
        };
    });

    const allDatesMedium = round(
        (allDates.reduce((acc, cur) => {
            return acc + cur.ms;
        }, 0)/allDates.length),2
    );
    

    const [renameInput, setRenameInput] = useState<string>('');
    
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    
   

    return (

        <div className="flex flex-col gap-4 items-start ">
            <div className="flex items-center justify-between w-full relative" >
                <TypographyH1 className="w-full flex justify-center items-center">
                    <div className="truncate max-w-screen-sm text-center h-16 ">{currentTimer?.name}</div>
                </TypographyH1>
                <Dialog onOpenChange={(open:boolean)=>{
                    if(!open){setRenameInput('') ;}
                    setEditDialogOpen(open);
                }} open={editDialogOpen}><AlertDialog>
                <DropdownMenu>
                
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" className='aspect-square absolute right-0 top-0' variant="outline">
                            <i className="fa-solid fa-gear"></i>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                        <DropdownMenuGroup>
                        <DropdownMenuItem>  
                            <DialogTrigger><span>Редагувати</span></DialogTrigger>

                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <span className=" text-red-800 dark:text-red-400">Видалити</span>
                            </AlertDialogTrigger>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Ви впевнені ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Видалення таймера не може бути відмінено . 
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Відміна</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>{
                            if(currentId === selectedTimerID){
                                unselectTimer();
                            }
                            deleteTimer(currentId);
                            navigate('/')
                            setSecondPage(undefined);
                        }}>Видалити</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    <DialogContent >
                        <DialogHeader>
                            <DialogTitle>Редагувати таймер</DialogTitle>
                            <DialogDescription>
                                Тут ви можете змінити назву таймера та інші параметри
                            </DialogDescription>
                        </DialogHeader>
                        <Label htmlFor='name'>Назва таймера</Label>
                        <Input 
                            id="name"
                            value={renameInput}
                            onChange={(e)=>setRenameInput(e.target.value)}/>
                        <DialogFooter>
                            <Button type="submit" onClick={()=>{
                                setTimers({...timers,[currentId]:{...currentTimer,name:renameInput, totalTime: currentTimer?.totalTime || 0}});
                                setEditDialogOpen(false);
                                setSecondPage(
                                    {name:renameInput || '',url:`/${currentId}`}
                                )
                                setRenameInput('');
                            }}>Зберегти значення</Button>
                        </DialogFooter>
                            
                    </DialogContent>
                </AlertDialog></Dialog>
                
            </div>
            <Tabs defaultValue="main" className="flex flex-col w-full justify-center items-center relative">
            <TabsList >
                <TabsTrigger value="main">Основна інформація</TabsTrigger>
                <TabsTrigger value="details">Детальніше</TabsTrigger>
            </TabsList>
            <TabsContent value="main" className='w-full'>
            <div className="grid grid-cols-3 gap-4 h-full mt-4 ">
                <Card>
                <CardHeader>
                    <CardTitle>
                    {getNumbersBySeconds(currentTimer?.totalTime, additionalSeconds)}
                    </CardTitle>
                    <CardDescription>Часу витрачено</CardDescription>
                </CardHeader>
                </Card>
                <Card>
                <CardHeader className='items-center h-full justify-center'>
                    {/* <CardTitle>Управління</CardTitle> */}
                    <Button onClick={()=>toggleTimer(currentId)} 
                        aria-label={isCurrentPaused ? 'Старт' : 'Продовжити'}>
                        <i className={`fa fa-${isCurrentPaused ? "play" :"pause" }`}></i>
                    </Button>
                </CardHeader>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>
                    {getNumbersBySeconds(allDatesMedium)}
                    </CardTitle>
                    <CardDescription>В середньому на день</CardDescription>
                </CardHeader>
                </Card>
                
                <Card className="col-span-3 ">
                <CardHeader>
                    <CardDescription>Загальна активність</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={356}>
                    <AreaChart
                        width={400}
                        height={300}
                        data={allDatesData}
                        margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                        dataKey="name"
                        tickFormatter={(value) =>
                            new Date(value).toLocaleDateString()
                        }
                        />
                        <YAxis tick={false} />
                        <Tooltip  content={(<CustomTooltip />)}/>
                        <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#8884d8"
                        fill="#8884d8"
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
                </Card>
            </div>
            </TabsContent>
            <TabsContent value="details" className='w-full'>
                <DetailsView 
                currentTimerDate={currentTimerDate} 
                additionalSeconds={additionalSeconds}/>
            </TabsContent>
            </Tabs>
            
            

            
            
        </div>
    )
}
type DetailsViewProps = {
    currentTimerDate:TimerDates,
    additionalSeconds:number
}
const DetailsView = ({currentTimerDate,additionalSeconds}:DetailsViewProps)=>{
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const [viewRange, setViewRange] = useState<DateRange | undefined>({
        from:today,
        to:today
    });
    

    const startDate = viewRange?.from || today;

    const endDate = viewRange?.to || startDate;

    
    const timerDates = 
        getTimerDatesByRange(startDate,endDate,currentTimerDate,additionalSeconds);
    
    const data = timerDates.map((day) => {
        return {
        name: day.name,
        hours: day.ms ,
        };
    });
    const rangeTotal = round(
        (timerDates.reduce((acc, cur) => {
            return acc + cur.ms;
        }, 0)),2
    );
    const rangeMedium = round(rangeTotal / timerDates.length,2);
    
    
    return (
            <div className="grid grid-cols-3 gap-4 w-full h-full mt-4 ">
                <Calendar
                    mode="range"
                    selected={viewRange}
                    onSelect={setViewRange}
                    numberOfMonths={2}
                    className="rounded-md border row-span-3 col-span-2 items-center justify-center flex"
                    locale={uk}
                />
                <Card >
                    <CardHeader>
                        <CardTitle>
                            Період
                        </CardTitle>
                        <CardDescription>
                            {format(startDate,'d MMMM yyyy', { locale: uk })} - {format(endDate,'d MMMM yyyy', { locale: uk })}
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>
                    {getNumbersBySeconds(rangeTotal)}
                    </CardTitle>
                    <CardDescription>Часу витрачено</CardDescription>
                </CardHeader>
                </Card>
                <Card>
                <CardHeader>
                    <CardTitle>
                    {getNumbersBySeconds(rangeMedium)}
                    </CardTitle>
                    <CardDescription>В середньому</CardDescription>
                </CardHeader>
                </Card>
                
                <Card className="col-span-3 ">
                <CardHeader>
                    <CardDescription>Активність в цей період</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={356}>
                    <AreaChart
                        width={400}
                        height={300}
                        data={data}
                        margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                        dataKey="name"
                        tickFormatter={(value) =>
                            new Date(value).toLocaleDateString()
                        }
                        />
                        
                        <Tooltip  content={<CustomTooltip/>}/>
                        <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#8884d8"
                        fill="#8884d8"
                        />
                        <YAxis tick={false} />
                    </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
                </Card>
            </div>
    )
}

export default TimerView