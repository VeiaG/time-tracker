import {Timer,TimerDates} from '../App';

import { IconButton } from '@chakra-ui/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heading,Card,CardBody,Text, Stack } from '@chakra-ui/react'

type DashboardProps={
    currentTimerDate:TimerDates,
    currentTimer:Timer,
    isPaused:boolean,
    currentID:string,
    startTimer:()=>void,
    stopTimer:()=>void,
}



const Dashboard = ({currentTimerDate,currentTimer,isPaused,startTimer,stopTimer, currentID}:DashboardProps) => {
    
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

    //make data for graph only for last 7 days
    const currentDate = new Date();

    currentDate.setDate(currentDate.getDate() - 7);
    const data = currentTimerDate ? Object.keys(currentTimerDate)
        .filter(key => new Date(key) >= currentDate && new Date(key) <= new Date())
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((key) => {
            return {
                name: key,
                hours: round(currentTimerDate[key] / 3600, 3)
            }
        }) : [];
    
    return (
      <div className="dashboard">
        <Heading size="xl">{currentTimer?.name}</Heading>
        <Text fontSize="xl">Обраний таймер</Text>
        
        <div className="dashboard__grid">
        <Card>
            <CardBody>
                <Text>Часу витрачено:</Text>
                <Heading size="lg">{
                    getStringByTimerObject(getNumbersBySeconds(currentTimer?.totalTime))
                }</Heading>
                
            </CardBody>
        </Card>
        
        <Card>
            <CardBody>
                <Text>Сьогодні:</Text>
                <Heading size="lg">{
                    getStringByTimerObject(getNumbersBySeconds(currentTimerDate[new Date().toDateString()]))
                }</Heading>
            </CardBody>
        </Card>
        <Card>
            <CardBody>
                <Text>За останній тиждень:</Text>
                <Heading size="lg">{
                    getStringByTimerObject(getNumbersBySeconds(currentTimerDate[new Date().toDateString()]))
                }</Heading>
            </CardBody>
        </Card>
        <Card align="center">
            <CardBody>
                <Text textAlign="center" fontSize="xl">Управління</Text>
                <Stack direction="row" spacing={4} align="center">
                    <IconButton onClick={()=>{ 

                        }} 
                        size="sm"
                        aria-label="zen-mode"
                        icon={<i className="fa-solid fa-angle-right"></i>} 
                    />
                    <IconButton onClick={()=>{ 
                            isPaused ? startTimer() : stopTimer()
                        }} 
                        isRound={true}
                        colorScheme='blue'
                        aria-label={isPaused ? 'Старт' : 'Продовжити'}
                        icon={<i className={`fa fa-${isPaused ? "play" :"pause" }`}></i>} 
                    />
                    <IconButton onClick={()=>{ 
                            
                        }} 
                        size="sm"
                        aria-label="zen-mode"
                        icon={<i className="fa-solid fa-expand"></i>} 
                    />
                </Stack>
            </CardBody>
        </Card>
        <Card className="dashboard__graph">
            <CardBody>
            <ResponsiveContainer width="100%" height="100%" >
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
                    <XAxis dataKey="name" tickFormatter={(value)=>new Date(value).toLocaleDateString()}/>
                    <YAxis />
                    <Tooltip formatter={(value) => [value +' год.' ,"Час",]}/>
                    <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </CardBody>
        </Card>
        </div>
    </div>
    )
}


export default Dashboard