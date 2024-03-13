import {useState,useEffect} from 'react';
import Sidebar from './components/Sidebar'
import TimerView from './components/TimerView'
import Content from './components/Content';
import { HashRouter, Routes,Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { useLocalForage } from './hooks/useLocalForage';
import useTimer from './hooks/useTimer';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/themeProvider"
import localforage from 'localforage';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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

  const [currentId,setCurrentId] = useState<string | undefined>(undefined);

  const [selectedTimerID,setSelectedTimerID] = useLocalForage<string>('selectedTimerID','');

  useEffect(() => {
      if(selectedTimerID && timers){
          setCurrentId(selectedTimerID);
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

      if(currentId){
        newTimers[currentId].totalTime += timeElapsed;
      }
      setCurrentTimerDate(newTimerDate);
      

      if(currentId){
        await localforage.setItem(currentId,newTimerDate);
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
       <ScrollArea className="h-full max-h-full min-h-full relative box-border">
       <ThemeProvider>
        <Toaster />
        
        <HashRouter>
          
          <Navigation addTimer={addTimer} 
            toggleTimer={toggleTimer}
            isPaused={isPaused}
            currentTimer={currentTimer}
            currentID={selectedTimerID}
            setCurrentId={setCurrentId}
            unselectTimer={unselectTimer}
            seconds={seconds}/>
          
          <div className="container flex flex-col gap-2 relative h-full box-border">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/">Головна</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/timers">Усі таймери</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
          <div className="flex gap-4 relative grow">
          
          <Routes>
              <Route path="/:id" element={
                <>
                <Sidebar 
                  isPaused={isPaused}
                  timers={timers} 
                  toggleTimer={toggleTimer}
                  seconds={seconds}
                  
                  selectedTimerID={selectedTimerID}/>
                <Content>
                  <TimerView 
                    selectedID={selectedTimerID}
                    timers={timers}
                    seconds={seconds}
                    isPaused={isPaused}
                    toggleTimer={toggleTimer}
                    deleteTimer={deleteTimer}
                    setTimers={setTimers}
                    unselectTimer={unselectTimer}
                    />
                </Content> </>}/>
              <Route path="/" element={
                <>
                  <Sidebar 
                    isPaused={isPaused}
                    timers={timers} 
                    toggleTimer={toggleTimer}
                    seconds={seconds}
                    selectedTimerID={selectedTimerID}/>
                  <Content>
                  <Dashboard currentTimer={currentTimer ?? {} as Timer} 
                    currentTimerDate={currentTimerDate ?? {} as TimerDates}
                    seconds={seconds}
                    selectedTimerID={selectedTimerID}/>
                  </Content>
                </>
              } />
          </Routes>
          </div>
          </div>
        </HashRouter>
        </ThemeProvider>
       </ScrollArea>
      </div>
  )
}

export default App
