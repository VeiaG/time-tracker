import { Timer, TimerDates } from "../App";
import { getNumbersBySeconds, getTimerDatesByRange ,round } from "@/lib/timeUtils";
import { useContext, useEffect, useState } from "react";
import CustomTooltip from "./CustomTooltip";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH1, TypographyLead, TypographyMuted } from "./ui/typography";
import { TimerContext } from "@/contexts/TimerContext";


const Dashboard = () => {

  
  const {
    currentTimerDate,
    currentTimer,
    selectedTimerID,
    seconds,
  } = useContext(TimerContext);

  //make data for graph only for last 7 days
  type Data ={
    name:string,
    ms:number
  }
  const [sevenDaysObj, setSevenDaysObj] = useState<Data[]>([]);
  useEffect(() => {
    const sevenDaysObj = getTimerDatesByRange(
      new Date(new Date().setDate(new Date().getDate() - 7)),
      new Date(),
      currentTimerDate,
      seconds
    );
    setSevenDaysObj(sevenDaysObj);
  }, [currentTimerDate, seconds]);
  const data = sevenDaysObj.map((day) => {
    return {
      name: day.name,
      hours: day.ms,
    };
  });
  const sevenDaysSeconds = sevenDaysObj.reduce((acc, cur) => {
    return acc + cur.ms;
  }, 0);

  const renderDashboard = (
    <>
      <TypographyH1>
        <div className="truncate max-w-3xl h-16 ">{currentTimer?.name}</div>
      </TypographyH1>
      <TypographyMuted>Обраний таймер</TypographyMuted>
      <div className="grid grid-cols-4 gap-4 h-full mt-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {getNumbersBySeconds(currentTimer?.totalTime, seconds)}
            </CardTitle>
            <CardDescription>Часу витрачено</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              {getNumbersBySeconds(
                currentTimerDate[new Date().toDateString()],
                seconds,new Date().toDateString()
              )}
            </CardTitle>
            <CardDescription>Сьогодні</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{getNumbersBySeconds(sevenDaysSeconds)}</CardTitle>
            <CardDescription>За останній тиждень</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{0}</CardTitle>
            <CardDescription>Тест додаткові секунди</CardDescription>
          </CardHeader>
        </Card>
        <Card className="col-span-4 ">
          <CardHeader>
            <CardDescription>Активність за останній тиждень</CardDescription>
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
                
                <Tooltip formatter={(value) => [value + " год.", "Час"]} 
                content={<CustomTooltip/>}/>
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
    </>
  );
  return (
    <div className="h-full">
      {selectedTimerID ? (
        renderDashboard
      ) : (
        <TypographyLead>Оберіть таймер</TypographyLead>
      )}
    </div>
  );
};

export default Dashboard;
