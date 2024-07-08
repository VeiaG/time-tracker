import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { getNumbersBySeconds, getTimerDatesByRange  } from "@/lib/timeUtils";
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
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TypographyH1, TypographyMuted } from "./ui/typography";
import { TimerContext } from "@/contexts/TimerContext";
import EmptyDashboard from "./EmptyDashboard";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';
import { useTranslation } from "react-i18next";
const Dashboard = () => {
  const {t} = useTranslation();
  
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
  const chartConfig = {
    ms:{
      label: t("Dashboard timeElapsed"),
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const sevenDaysSeconds = sevenDaysObj.reduce((acc, cur) => {
    return acc + cur.ms;
  }, 0);
  
  const navigate = useNavigate();
  const renderDashboard = (
    <>
      <TypographyH1 className="truncate max-w-xs sm:max-w-sm lg:max-w-2xl h-16 ">
        {currentTimer?.name}
      </TypographyH1>
      <TypographyMuted>{t("Dashboard selectedTimer")}</TypographyMuted>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full mt-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {getNumbersBySeconds(currentTimer?.totalTime, seconds)}
            </CardTitle>
            <CardDescription>{t("Dashboard timeElapsed")}</CardDescription>
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
            <CardDescription>{t("Dashboard today")}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{getNumbersBySeconds(sevenDaysSeconds)}</CardTitle>
            <CardDescription>{t("Dashboard forWeek")}</CardDescription>
          </CardHeader>
        </Card>
        <Card onClick={()=>{
            if(selectedTimerID!=='')
              navigate(`/${selectedTimerID}`)
          }} className="relative cursor-pointer hover:bg-accent transition-colors">
          <CardHeader className="relative">
            <CardTitle>{t("Dashboard details")}</CardTitle>
            <ArrowRight className=" absolute bottom-4 right-4 "/>
            <CardDescription>{t("Dashboard details desc")}</CardDescription>
          </CardHeader>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-4 ">
          <CardHeader>
            <CardDescription>{t("Dashboard activity")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[128px] w-full max-h-[384px]">
              <BarChart 
                data={sevenDaysObj}
                accessibilityLayer
              >
                <CartesianGrid vertical={false}/>
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
                  
                  content={<ChartTooltipContent hideIndicator
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                    formatter={
                        (value) => getNumbersBySeconds(value as number)
                    }
                     />}
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
    </>
  );
  return (
    <div className="h-full">
      {selectedTimerID ? (
        renderDashboard
      ) : (
        <EmptyDashboard/>
      )}
    </div>
  );
};

export default Dashboard;
