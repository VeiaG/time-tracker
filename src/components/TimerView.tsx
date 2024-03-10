import { useState } from 'react';
import {Timer,TimerDates, AllTimers} from '../App';
import localforage from 'localforage';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { Link } from 'react-router-dom'
type TimerProps={
    selectedID:string,
    timers:AllTimers,
    isPaused:boolean,
    toggleTimer:(id:string)=>void,
    setSelectedTimerID:(id:string)=>void,
}



const TimerView = ({timers,selectedID,isPaused,toggleTimer,setSelectedTimerID} :TimerProps) => {
    const [currentTimer,setCurrentTimer] = useState<Timer>();
    const params = useParams();
    const id = params?.id as string;
    const [currentId,setCurrentId] = useState<string>(id);
    const [currentTimerDate,setCurrentTimerDate] = useState<TimerDates>({});
    
    const [isCurrentPaused , setIsCurrentPaused] = useState<boolean>(true);
    
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

    useEffect(()=>{
        if(currentId === selectedID){
            setIsCurrentPaused(isPaused);
        }
        else{
            setIsCurrentPaused(true);
        }
    },[selectedID,isPaused,currentId]);

    const getNumbersBySeconds = (seconds:number | undefined) => {
        if(seconds){
            const days = Math.floor(seconds/86400);
            const hours = Math.floor((seconds/3600)%24);
            const minutes = Math.floor((seconds%3600)/60);
            const sec = seconds%60;
            return {
                days,
                hours,
                minutes,
                sec
            }
        }
        return {};
    }

    const getStringByTimerObject = (timerObject:{days?:number,hours?:number,minutes?:number,sec?:number}) => {
       let string ='';
         if(timerObject.days){
              string += timerObject.days + ' дн.';
         }
        if(timerObject.hours){
            string += timerObject.hours + ' год.';
        }
        if(timerObject.minutes){
            string += timerObject.minutes + ' хв.';
        }
        if(timerObject.sec){
            string += timerObject.sec + ' сек.';
        }
        return string;
    }

    const round = (num:number,decimals:number) => {
        return Number(Math.round(parseFloat(num + 'e' + decimals)) + 'e-' + decimals);
    }


    const data = currentTimerDate ? Object.keys(currentTimerDate)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((key) => {
            return {
                name: key,
                hours: round(currentTimerDate[key] / 3600, 3)
            }
        }) : [];
        
    

    return (
        <div className="timer">
            <h1>{currentTimer?.name}</h1>
            <div className="timer__time">
                <Card>
                    <CardContent>
                        Часу витрачено:
                        <h1>{
                            getStringByTimerObject(getNumbersBySeconds(currentTimer?.totalTime))
                        }</h1>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        Сьогодні:
                        <h1>{
                            getStringByTimerObject(getNumbersBySeconds(currentTimerDate[new Date().toDateString()]))
                        }</h1>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                    
                    <XAxis dataKey="name"  tickFormatter={(value)=>new Date(value).toLocaleDateString()} />
                    
                    {/* <Tooltip formatter={(value) => [value +' год.' ,"Час",]}/> */}
                    <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
                </CardContent>
            </Card>
                    
            <Button onClick={()=>toggleTimer(currentId)} 
                aria-label={isCurrentPaused ? 'Старт' : 'Продовжити'}
            ><i className={`fa fa-${isCurrentPaused ? "play" :"pause" }`}></i></Button>
            <Button disabled={currentId === selectedID} onClick={()=>setSelectedTimerID(currentId)}>Select this</Button>
            <ResponsiveContainer width="100%" height={600}>
                <AreaChart
                width={500}
                height={400}
                data={data}
                margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tickFormatter={(value)=>new Date(value).toLocaleDateString()}/>
                <YAxis />
                <Tooltip formatter={(value) => [value +' год.' ,"Час",]}/>
                <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default TimerView