import { useState } from 'react';
import {Timer,TimerDates, AllTimers} from '../App';
import localforage from 'localforage';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabList, TabPanels, Tab, TabPanel ,Heading,Card,CardBody,CardFooter } from '@chakra-ui/react'
type DashboardProps={
    currentTimerDate:TimerDates,
    currentTimer:Timer,
    isPaused:boolean,
    startTimer:()=>void,
    stopTimer:()=>void,
}



const Dashboard = ({currentTimerDate,currentTimer,isPaused,startTimer,stopTimer}:DashboardProps) => {
    
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


    const data = currentTimerDate ? Object.keys(currentTimerDate).map((key) => {
        return {
            name:key,
            hours:round(currentTimerDate[key]/3600,3)
        }
    }) : [];


    

    return (
      <div className="dashboard">
          <Card>
              <CardBody>
                <Heading>Current Timer : {currentTimer?.name}</Heading>
                  Часу витрачено:
                  <Heading size="lg">{
                      getStringByTimerObject(getNumbersBySeconds(currentTimer?.totalTime))
                  }</Heading>
                  
                    <IconButton onClick={()=>{ 
                        isPaused ? startTimer() : stopTimer()
                        }} 
                        aria-label={isPaused ? 'Старт' : 'Продовжити'}
                        icon={<i className={`fa fa-${isPaused ? "play" :"pause" }`}></i>} 
                    />
              </CardBody>
          </Card>
        <Card className="dashboard__graph">
            <CardBody>
            <ResponsiveContainer width="100%" height={300} >
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

                <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </CardBody>
        </Card>
              
      
    </div>
    )
}

export default Dashboard