import {useState,useEffect,useCallback} from 'react';
import './app.scss'
import Sidebar from './components/Sidebar'
import TimerView from './components/TimerView'
import Content from './components/Content';
import { HashRouter, Routes,Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { useLocalForage } from './hooks/useLocalForage';
import useTimer from './hooks/useTimer';

import localforage from 'localforage';

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


  const [currentTimer,setCurrentTimer] = useState<Timer>();
  const [currentId,setCurrentId] = useState<string>('');

    

  const [selectedTimerID,setSelectedTimerID] = useLocalForage<string>('selectedTimerID','');
  console.log(selectedTimerID,timers);

    useEffect(() => {

        if(selectedTimerID && timers){
            setCurrentId(selectedTimerID);
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
    },[selectedTimerID,timers]);

  const timerCallback = ()=>{
      const newDate = new Date();
      const dateString = newDate.toLocaleDateString();
      const newTimerDate = {...currentTimerDate};
      if(newTimerDate[dateString]){
          newTimerDate[dateString] += 1;
      }else{
          newTimerDate[dateString] = 1;
      }
      setCurrentTimerDate(newTimerDate);
      localforage.setItem(currentId,newTimerDate);
      console.log('timerCallback')
      const newTimers = {...timers};
      newTimers[currentId].totalTime += 1;
      setTimers(newTimers);
    }
  const [startTimer,stopTimer,isPaused] = useTimer(timerCallback)

 
      

  const addTimer = (timerName:string) => {
    const id = crypto.randomUUID();
    const newTimer:Timer = {
      name:timerName,
      totalTime:0,
    }
    setTimers({...timers,[id]:newTimer});
    localforage.setItem(id,{[new Date().toLocaleDateString()]:0});
  }
  const deleteTimer = (id:string) => {
    const newTimers = {...timers};
    delete newTimers[id];
    setTimers(newTimers);
    localforage.removeItem(id);
  }

  return (
      <div className="app">
        <Navigation addTimer={addTimer}/>
          <div className="app__wrapper">

              <HashRouter>
                <Sidebar timers={timers} deleteTimer={deleteTimer} setSelectedTimerID={setSelectedTimerID}/>
                <Routes>
                    <Route path="/:id" element={
                      <Content>
                        <TimerView 
                          currentTimer={currentTimer ?? {} as Timer} 
                          currentTimerDate={currentTimerDate ?? {} as TimerDates}
                          isPaused={isPaused}
                          stopTimer={stopTimer}
                          startTimer={startTimer}/>
                      </Content>} />
                    <Route path="/" element={<Content>
                        <Dashboard currentTimer={currentTimer ?? {} as Timer} 
                          currentTimerDate={currentTimerDate ?? {} as TimerDates}
                          isPaused={isPaused}
                          stopTimer={stopTimer}
                          startTimer={startTimer}/>
                      </Content>} />
                </Routes>
              </HashRouter>
          </div>
      </div>
  )
}

export default App
