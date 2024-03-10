import {Timer,TimerDates} from '../App';
import { getNumbersBySeconds } from '@/lib/timeUtils';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { TypographyH1, TypographyLead, TypographyMuted, TypographyP } from './ui/typography';
  

type DashboardProps={
    currentTimerDate:TimerDates,
    currentTimer:Timer,
    isPaused:boolean,
    selectedTimerID:string,
    seconds:number,
}



const Dashboard = ({currentTimerDate,currentTimer,isPaused, selectedTimerID,seconds}:DashboardProps) => {
    

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
                hours:round(currentTimerDate[key] / 3600 ,3)
            }
        }) : [];
    
    const renderDashboard = (
        <>
            <TypographyH1 ><div className="truncate max-w-3xl">{currentTimer?.name}</div></TypographyH1>
        <TypographyMuted>Обраний таймер</TypographyMuted>
        <div className="grid grid-cols-4 gap-4 h-full mt-4">
        <Card>
            <CardHeader>
                <CardTitle>{
                    getNumbersBySeconds(currentTimer?.totalTime,seconds)
                }</CardTitle>
                <CardDescription>Часу витрачено</CardDescription>
            </CardHeader>
        </Card>      
        <Card>
            <CardHeader>
                <CardTitle>{
                    getNumbersBySeconds(currentTimerDate[new Date().toDateString()],
                    seconds)
                }</CardTitle>
                <CardDescription>Сьогодні</CardDescription>
            </CardHeader>
        </Card>
        <Card>
        <CardHeader>
                <CardTitle>{
                   0
                }</CardTitle>
                <CardDescription>За останній тиждень</CardDescription>
            </CardHeader>
        </Card>
        <Card >
            <CardHeader>
                 <CardTitle>{
                   seconds
                }
                </CardTitle>
                <CardDescription>Тест додаткові секунди</CardDescription>
            </CardHeader>
            
        </Card>
        <Card className="col-span-4 ">
            
            <CardHeader>
                <CardDescription>Активність за останній тиждень</CardDescription>
            </CardHeader>
            <CardContent >
            <ResponsiveContainer width="100%" height={356} >
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
            </CardContent>
        </Card>
        </div>
        </>
    )
    return (
      <div className="h-full">
        {selectedTimerID ? renderDashboard : <TypographyLead>Оберіть таймер</TypographyLead>}
    </div>
    )
}


export default Dashboard