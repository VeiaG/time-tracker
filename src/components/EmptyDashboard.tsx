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

const EmptyDashboard = () => {
  const {
    timers,setIsTutorialOpened
  } = useContext(TimerContext);

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
          <TypographyH1 className="lg:h-16">Таймер не обрано</TypographyH1>
          <TypographyMuted>Створіть новий таймер або оберіть існуючий з бокового меню.</TypographyMuted>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{ getNumbersBySeconds(sumOfALlTimers || 0) }</CardTitle>
              <CardDescription>Загально виміряно часу</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{ timers ? Object.keys(timers).length : 0 }</CardTitle>
              <CardDescription>Створено таймерів</CardDescription>
            </CardHeader>
          </Card>
          <Card onClick={()=>{
            if(mostPopularTimer.id!=='')
              navigate(`/${mostPopularTimer.id}`)
          }} className={`${mostPopularTimer.id!=='' ? "cursor-pointer hover:bg-accent transition-colors" : ""}`}>
            <CardHeader className="relative">
                <CardTitle className="truncate max-w-32 lg:max-w-48 sm:max-w-sm" >
                {
                  mostPopularTimer.name!== '' ? mostPopularTimer.name : 'Таймери відсутні'
                }
                
                </CardTitle>
                <ArrowRight className={cn("absolute bottom-4 right-4 ",(mostPopularTimer.id!=='' ? "" : "hidden"))}/>
              <CardDescription>Найчастіше використовуваний таймер.</CardDescription>
            </CardHeader>
          </Card>
          
        </div>
        <Button onClick={()=>setIsTutorialOpened(true)} variant="outline">
          Туторіал
        </Button>
        <div>
          <TypographyH2 className=" mt-2 w-full text-center">FAQ</TypographyH2>
          <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
              <AccordionTrigger>Куди зберігаються данні?</AccordionTrigger>
              <AccordionContent>
                Дані зберігаються в локальному сховищі браузера. Вони нікуди не відправляються. 

              </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
              <AccordionTrigger>Чи працює таймер якщо закрити вкладку?</AccordionTrigger>
              <AccordionContent>
                Так, таймер працює в фоновому режимі. Він продовжує відлік часу навіть якщо ви закриєте вкладку.
              </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
              <AccordionTrigger> Для чого взагалі таймер? </AccordionTrigger>
              <AccordionContent>
                Таймер допомагає відстежувати час, який ви витрачаєте на різні завдання. Це допомагає бути більш продуктивним та краще планувати свій час. 

              </AccordionContent>
          </AccordionItem>
          </Accordion>
        </div>
    </div>
  )
}

export default EmptyDashboard