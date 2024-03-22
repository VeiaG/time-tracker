import {useState,useEffect} from 'react';
import Sidebar from './components/Sidebar'
import TimerView from './components/TimerView'
import Content from './components/Content';
import { HashRouter, Routes,Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { useLocalForage } from './hooks/useLocalForage';
import useTimer from './hooks/useTimer';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/themeProvider"
import localforage from 'localforage';
import { ScrollArea } from "@/components/ui/scroll-area"


import { TimerContext } from './contexts/TimerContext';
import BreadcrumbsMenu from './components/BreadcrumbsMenu';

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



function App() {
  const [timers,setTimers] = useLocalForage<AllTimers>('timers',{});
  
  const [currentTimerDate,setCurrentTimerDate] = useState<TimerDates>({});

  const [currentTimer,setCurrentTimer] = useState<Timer | undefined>();

  const [currentID,setCurrentID] = useState<string | undefined>(undefined);

  const [selectedTimerID,setSelectedTimerID] = useLocalForage<string>('selectedTimerID','');

  useEffect(() => {
      if(selectedTimerID && timers){
          setCurrentID(selectedTimerID);
          setCurrentTimer(timers[selectedTimerID]);
          localforage.getItem<TimerDates>(selectedTimerID).then((data) => {
              if(data){
                  setCurrentTimerDate(data);
                  console.log('setCurrentTimerDate in useEffect',data);
              }
              else{
                  setCurrentTimerDate({});
              }
          });
      }
  },[selectedTimerID,timers,setCurrentTimerDate]);


  const timerCallback =async (timeElapsed:number)=>{
      const newDate = new Date();

      const dateString = newDate.toDateString();
      const newTimerDate = {...currentTimerDate};
      if(newTimerDate[dateString]){
          newTimerDate[dateString] += timeElapsed;
      }
      else{
          newTimerDate[dateString] = timeElapsed;
      }
      const newTimers = {...timers};

      if(currentID){
        newTimers[currentID].totalTime += timeElapsed;
      }
      setCurrentTimerDate(newTimerDate);
      

      if(currentID){
        await localforage.setItem(currentID,newTimerDate);
      }
      await setTimers(newTimers);
      return;
    }
  const [startTimer,stopTimer,isPaused,seconds] = useTimer(timerCallback);

  const unselectTimer = () => {
    stopTimer();
    setCurrentTimer(undefined);
    setCurrentTimerDate({});
    setSelectedTimerID('');

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
      <div className="min-h-dvh h-dvh max-h-dvh pt-24 relative box-border">
        <div className=" lg:hidden
          flex items-center justify-center top-0 left-0 fixed w-full h-dvh bg-black z-50">
          Сайт не оптимізовано для таких розмірів екрану
        </div>
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
          }
        
       }>
       <ScrollArea className="h-full max-h-full min-h-full relative box-border">
       <ThemeProvider>
        <Toaster />
        
        <HashRouter>
          
          <Navigation />
          
          <div className="container flex flex-col gap-2 relative h-full box-border">
            <BreadcrumbsMenu/>
          <div className="flex gap-4 relative grow">
          
          <Routes>
              <Route path="/:id" element={
                <>
                <Sidebar />
                <Content>
                  <TimerView />
                </Content> </>}/>
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
        </ThemeProvider>
       </ScrollArea>
       </TimerContext.Provider>
      </div>
  )
}

export default App
