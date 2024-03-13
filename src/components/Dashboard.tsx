import { Timer, TimerDates } from "../App";
import { getNumbersBySeconds, getTimerDatesByRange ,round } from "@/lib/timeUtils";

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

type DashboardProps = {
  currentTimerDate: TimerDates,
  currentTimer: Timer,
  selectedTimerID: string,
  seconds: number,
};

const Dashboard = ({
  currentTimerDate,
  currentTimer,
  selectedTimerID,
  seconds,
}: DashboardProps) => {

  

  //make data for graph only for last 7 days
  const sevenDaysObj = getTimerDatesByRange(
    new Date(new Date().setDate(new Date().getDate() - 7)),
    new Date(),
    currentTimerDate,
    seconds
  );
  const data = sevenDaysObj.map((day) => {
    return {
      name: day.name,
      hours: round(day.ms / 1000 / 60 / 60, 2),
    };
  });
  const sevenDaysSeconds = sevenDaysObj.reduce((acc, cur) => {
    return acc + cur.ms;
  }, 0);

  const renderDashboard = (
    <>
      <TypographyH1>
        <div className="truncate max-w-3xl">{currentTimer?.name}</div>
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
                seconds
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
            <CardTitle>{seconds}</CardTitle>
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
                <YAxis />
                <Tooltip formatter={(value) => [value + " год.", "Час"]} />
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
