import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { TypographyH1, TypographyH2, TypographyMuted} from "./ui/typography"
import {
  Card,

  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNumbersBySeconds } from "@/lib/timeUtils";
import { useContext } from "react";
import { TimerContext } from "@/contexts/TimerContext";
import {  useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from 'lucide-react';
import { useTranslation } from "react-i18next";
const EmptyDashboard = () => {
  const {
    timers,setIsTutorialOpened
  } = useContext(TimerContext);
  const {t} = useTranslation();
  const sumOfALlTimers = timers ? Object.entries(timers).reduce((acc, [,timer]) => {
    return acc + timer.totalTime;
  }, 0) : 0;

  const mostPopularTimer: {
    name:string,
    id:string,
    totalTime:number
  } = timers ? Object.entries(timers).reduce((acc, [id,timer]) => {
    if(timer.totalTime > acc.totalTime) {
      return {
        name: timer.name,
        id,
        totalTime: timer.totalTime
      }
    }
    return acc;
  }, {name: '', id: '', totalTime: -1}) : {name: '', id: '', totalTime: 0};

  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col gap-4">
        <div>
          <TypographyH1 className="lg:h-16">{t("EmptyDashboard:no timer selected")}</TypographyH1>
          <TypographyMuted>{t("EmptyDashboard:no timer description")}</TypographyMuted>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{ getNumbersBySeconds(sumOfALlTimers || 0) }</CardTitle>
              <CardDescription>{t("EmptyDashboard:total all time")}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{ timers ? Object.keys(timers).length : 0 }</CardTitle>
              <CardDescription>{t("EmptyDashboard:created timers")}</CardDescription>
            </CardHeader>
          </Card>
          <Card onClick={()=>{
            if(mostPopularTimer.id!=='')
              navigate(`/${mostPopularTimer.id}`)
          }} className={`${mostPopularTimer.id!=='' ? "cursor-pointer hover:bg-accent transition-colors" : ""}`}>
            <CardHeader className="relative">
                <CardTitle className="truncate max-w-32 lg:max-w-48 sm:max-w-sm" >
                {
                  mostPopularTimer.name!== '' ? mostPopularTimer.name : (t("EmptyDashboard:no timer"))
                }
                
                </CardTitle>
                <ArrowRight className={cn("absolute bottom-4 right-4 ",(mostPopularTimer.id!=='' ? "" : "hidden"))}/>
              <CardDescription>{t("EmptyDashboard:most used timer")}</CardDescription>
            </CardHeader>
          </Card>
          
        </div>
        {/* <Button onClick={()=>setIsTutorialOpened(true)} variant="outline">
          {t("Tutorial")}
        </Button> */}
        <div>
          <TypographyH2 className=" mt-2 w-full text-center">FAQ</TypographyH2>
          <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
              <AccordionTrigger>{t("FAQ question1")}</AccordionTrigger>
              <AccordionContent>
              {t("FAQ answer1")}
              </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
              <AccordionTrigger>{t("FAQ question2")}</AccordionTrigger>
              <AccordionContent>
              {t("FAQ answer2")}
              </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
              <AccordionTrigger>{t("FAQ question3")}</AccordionTrigger>
              <AccordionContent>
              {t("FAQ answer3")}
              </AccordionContent>
          </AccordionItem>
          </Accordion>
        </div>
    </div>
  )
}

export default EmptyDashboard