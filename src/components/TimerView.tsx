import { useState } from 'react';
import {Timer,TimerDates, AllTimers} from '../App';
import localforage from 'localforage';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, IconButton } from '@chakra-ui/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabList, TabPanels, Tab, TabPanel ,Heading,Card,CardBody,CardFooter } from '@chakra-ui/react'
type TimerProps={
    selectedID:string,
    timers:AllTimers,
    isPaused:boolean,
    startTimer:(id:string)=>void,
    stopTimer:()=>void,
    setSelectedTimerID:(id:string)=>void,
}



const TimerView = ({timers,selectedID,isPaused,startTimer,stopTimer,setSelectedTimerID} :TimerProps) => {
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
            const hours = Math.floor(seconds/3600);
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
            <Tabs>
                <TabList>
                    <Tab>Таймер</Tab>
                    <Tab>Графік</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Heading>{currentTimer?.name}</Heading>
                        <div className="timer__time">
                            <Card>
                                <CardBody>
                                    Часу витрачено:
                                    <Heading size="lg">{
                                        getStringByTimerObject(getNumbersBySeconds(currentTimer?.totalTime))
                                    }</Heading>
                                </CardBody>
                            </Card>
                            <Card align="center">
                                <CardBody>
                                    Сьогодні:
                                    <Heading size="lg">{
                                        getStringByTimerObject(getNumbersBySeconds(currentTimerDate[new Date().toDateString()]))
                                    }</Heading>
                                </CardBody>
                            </Card>
                        </div>
                        <Card>
                            <CardBody>
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
                            </CardBody>
                        </Card>
                                
                        <IconButton onClick={()=>{ 
                            isCurrentPaused ? startTimer(currentId) : stopTimer()
                        }} 
                            aria-label={isCurrentPaused ? 'Старт' : 'Продовжити'}
                            icon={<i className={`fa fa-${isCurrentPaused ? "play" :"pause" }`}></i>} 
                        />
                        <Button isDisabled={currentId === selectedID} onClick={()=>setSelectedTimerID(currentId)}>Select this</Button>
                        
                    </TabPanel>
                    <TabPanel>
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
                    </TabPanel>
                </TabPanels>
                </Tabs>
            
            

        </div>
    )
}

export default TimerView