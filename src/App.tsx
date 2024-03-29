import {useState,useEffect} from 'react';
import Sidebar from './components/Sidebar'
import TimerView from './components/TimerView'
import Content from './components/Content';
import { HashRouter, Routes,Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { useLocalForage } from './hooks/useLocalForage';
import useTimer from './hooks/useTimer';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/themeProvider"
import localforage from 'localforage';
import { ScrollArea } from "@/components/ui/scroll-area"
import AboutPage from './components/AboutPage';
import { Card, CardContent , CardHeader,CardDescription ,CardTitle} from "@/components/ui/card"

import { TimerContext } from './contexts/TimerContext';
import BreadcrumbsMenu from './components/BreadcrumbsMenu';
import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog"
export type AllTimers ={
  [id:string]:Timer,
}
export type Timer ={
  name:string,
  totalTime:number,
}
export type TimerDates = {
  [key:string]:number
}

import { getStyledStringByTimerObject } from './lib/timeUtils';
import { Button } from './components/ui/button';
import { MobileContext } from './contexts/MobileContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


function App() {
  const [timers,setTimers] = useLocalForage<AllTimers>('timers',{});
  
  const [currentTimerDate,setCurrentTimerDate] = useState<TimerDates>({});

  const [currentTimer,setCurrentTimer] = useState<Timer | undefined>();

  const [currentID,setCurrentID] = useState<string | undefined>(undefined);

  const [selectedTimerID,setSelectedTimerID] = useLocalForage<string>('selectedTimerID','');
  const [isZenMode,setIsZenMode] = useLocalForage<boolean>('zenmode',false);

  const [isTutorialOpened,setIsTutorialOpened] = useState(false);


  const [isSidebarOpened,setIsSidebarOpened] = useState(false);
  const [isMenuOpened,setIsMenuOpened] = useState(false);
  
  useEffect(() => {
      if(selectedTimerID && timers){
          setCurrentID(selectedTimerID);
          setCurrentTimer(timers[selectedTimerID]);
          localforage.getItem<TimerDates>(selectedTimerID).then((data) => {
              if(data){
                  setCurrentTimerDate(data);
              }
              else{
                  setCurrentTimerDate({});
              }
          });
      }
  },[selectedTimerID,timers,setCurrentTimerDate]);


  const timerCallback =async (timeElapsed:[{ day: string; ms: number }])=>{
      // const newDate = new Date();

      // const dateString = newDate.toDateString();
      const newTimerDate = {...currentTimerDate};
      let sumOfTime = 0;

      timeElapsed.forEach((time) => {
          if(newTimerDate[time.day]){
              newTimerDate[time.day] += time.ms;
          }
          else{
              newTimerDate[time.day] = time.ms;
          }
          sumOfTime += time.ms;
      });
      const newTimers = {...timers};

      if(currentID){
        newTimers[currentID].totalTime += sumOfTime;
      }
      setCurrentTimerDate(newTimerDate);
      

      if(currentID){
        await localforage.setItem(currentID,newTimerDate);
      }
      await setTimers(newTimers);
      return;
    }
  const [startTimer,stopTimer,isPaused,seconds] = useTimer(timerCallback);

  const unselectTimer = async (id?:string ) => {
    if(!isPaused){
      await stopTimer();
    }
    if(!id){
      setCurrentTimer(undefined);
      setCurrentTimerDate({});
    }
    setSelectedTimerID(id || '');
  }

  const toggleTimer = (id:string) => {
    if(isPaused){
      if(id !== selectedTimerID){
        setSelectedTimerID(id);
      }
      startTimer();
    }
    else{
      if(id === selectedTimerID){
        stopTimer();
      }
      else{
        stopTimer();
        setSelectedTimerID(id);
        startTimer();
      }
    }
  }
  const addTimer = (timerName:string) => {
    const id = crypto.randomUUID();
    const newTimer:Timer = {
      name:timerName,
      totalTime:0,
    }
    setTimers({...timers,[id]:newTimer});
    localforage.setItem(id,{[new Date().toDateString()]:0});
  }
  const deleteTimer =async (id:string) => {
    
    const newTimers = {...timers};
    delete newTimers[id];
    if (id === selectedTimerID){
      if(!isPaused){
        await stopTimer();
      }
      setSelectedTimerID('');
      
    }
    await localforage.removeItem(id);
    setTimers(newTimers);
  }
  
  
  return (
      <div className="min-h-dvh h-dvh max-h-dvh relative box-border  pt-24 ">
        {/* <div className=" lg:hidden
          flex items-center justify-center top-0 left-0 fixed w-full h-dvh bg-black z-50">
          Сайт не оптимізовано для таких розмірів екрану
        </div> */}
        <MobileContext.Provider value={
          {
            isSidebarOpened,
            setIsSidebarOpened,
            isMenuOpened,
            setIsMenuOpened,
          }
        }>
       <TimerContext.Provider value={
          {
            currentTimer,
            setCurrentTimer,
            currentTimerDate,
            setCurrentTimerDate,
            selectedTimerID,
            setSelectedTimerID,
            seconds,
            timers,
            setTimers,
            addTimer,
            deleteTimer,
            toggleTimer,
            unselectTimer,
            isPaused,
            currentID,
            setCurrentID,
            isZenMode,
            setIsZenMode,
            setIsTutorialOpened,
          }
        
       }>
       
       <ThemeProvider>
       <ScrollArea className="h-full max-h-full min-h-full relative box-border">
        <Toaster />
          <Dialog open={isZenMode} onOpenChange={setIsZenMode}>
            <DialogContent className='h-screen max-w-screen justify-center items-center sm:rounded-none rounded-none border-none'>
              <div className='flex flex-col items-center justify-center gap-2'>
                <div className='flex gap-2 items-center font-semibold text-4xl'>
                  <i className="fa-regular fa-clock"></i>
                  <span className="truncate max-w-4xl">
                    {currentTimer?.name || 'Щось пішло не так...' }
                  </span>
                </div >
                <div className='font-bold mb-4 text-9xl'>
                  {getStyledStringByTimerObject(currentTimer?.totalTime, seconds) || '00:00:00'}
                </div>
                <Button size="lg" className='px-8 py-6 text-2xl'
                    onClick={() => selectedTimerID && toggleTimer(selectedTimerID)}
                    disabled={!selectedTimerID}
                  >
                    {
                      <i className={`fa fa-${isPaused ? "play" : "pause"}`} />
                    }
                  </Button>
              </div>
               
            </DialogContent>
          </Dialog>
          <TutorialDialog open={isTutorialOpened} onOpenChange={setIsTutorialOpened}/>

        <HashRouter>
          <Navigation />
          <div className="container flex flex-col relative max-h-full h-full box-border  ">
            <BreadcrumbsMenu timers={timers}/>
          <div className="flex gap-4 relative grow">
          <Routes>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/:id" element={
                <>
                  <Sidebar />
                  <Content>
                    <TimerView />
                  </Content> 
                </>}/>
              <Route path="/" element={
                <>
                  <Sidebar/>
                  <Content>
                    <Dashboard />
                  </Content>
                </>
              } />
          </Routes>
          </div>
          </div>
        </HashRouter>
        </ScrollArea>
        </ThemeProvider>
       
       </TimerContext.Provider>
       </MobileContext.Provider>
      </div>
  )
}

type TutorialDialogProps = {
  open:boolean,
  onOpenChange: (open:boolean) => void,
}
const TutorialDialog = ({open,onOpenChange}:TutorialDialogProps)=>{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Carousel>
          <CarouselContent>
          <CarouselItem >
              <Card className='h-full'>
                  <CardHeader>
                    <CardTitle>
                      Привіт!
                    </CardTitle>
                    
                    <CardDescription>
                      <p>Це туторіал по роботі з таймерами</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-col items-center">
                      <span>
                        Цей додаток створений для відстеження часу, який ви витрачаєте на різні завдання.
                      </span>
                      <span>
                        
                      </span>
                    
                    </div>
                  </CardContent>
                </Card>
            </CarouselItem>
            <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Привіт!
                    </CardTitle>
                    
                    <CardDescription>
                      <p>Це туторіал по роботі з таймерами</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-col items-center">
                      <span>
                        Цей додаток створений для відстеження часу, який ви витрачаєте на різні завдання.
                      </span>
                      <span>
                        Для початку вам потрібно створити таймер. Зробити це можна натиснувши на кнопку.
                      </span>
                      <Button variant='outline'>
                        Створити таймер
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            </CarouselItem>
           
            <CarouselItem>...</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

export default App


