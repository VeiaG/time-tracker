import {useState, useEffect,useCallback} from 'react';
import { useLocalForage } from './useLocalForage';
import { flushSync } from 'react-dom';

export type CurrentTimer = {
    start:number | undefined
}
export type ElapsedTime =  [{ day: string; ms: number }] | undefined;
function getTimeArray(start: number):ElapsedTime {
    const results = [] as unknown as ElapsedTime;
    const end = Date.now();
    const endDay = new Date(end);
    endDay.setHours(0, 0, 0, 0);

    const currentIterationDay = new Date(start);
    currentIterationDay.setHours(0, 0, 0, 0);

    let startIteration = start;

    while(currentIterationDay.getTime() <= endDay.getTime()){
    
        const day = currentIterationDay.toDateString();

        if(currentIterationDay.getTime() === endDay.getTime()){
            const ms = end - startIteration;
            
            results.push({day,ms});
            break;
        }
        currentIterationDay.setDate(currentIterationDay.getDate() + 1);
        const ms =currentIterationDay.getTime()-startIteration;
        results.push({day,ms});

        startIteration = currentIterationDay.getTime();
    }
    return results;
}
function updateElapsedSeconds(currentTimer: CurrentTimer, setElapsedSeconds: (value: ElapsedTime) => void) {
    if (currentTimer.start) {
      const timeElapsed = getTimeArray(currentTimer?.start) || undefined;
      setElapsedSeconds(timeElapsed);
    }
  }
const useTimer = (onStop : (timeElapsed: ElapsedTime)=>Promise<void> ) =>{
    const [currentTimer,setCurrentTimer] = useLocalForage<CurrentTimer>('currentTimer',{start:undefined});

    const [isPaused,setIsPaused] = useState<boolean>(!currentTimer.start);
    
    const [seconds , setElapsedSeconds] = useState<ElapsedTime>(undefined);



    //fire once
    useEffect(()=>{
        updateElapsedSeconds(currentTimer,setElapsedSeconds);
    },[currentTimer]);
    
    useEffect(()=>{
        let interval:ReturnType<typeof setInterval>;
        if(!isPaused){
            interval = setInterval(()=>updateElapsedSeconds(currentTimer,setElapsedSeconds),1000);
        }
        else{
            clearInterval(interval!);
            setElapsedSeconds(undefined);
        }
        return () => clearInterval(interval);
    },[isPaused,currentTimer]);

    useEffect(()=>{
        setIsPaused(!currentTimer.start);
    },[currentTimer.start]);
    
    const startTimer = useCallback((callback?: ()=>Promise<void>)=>{
        const newDate = Date.now();
        setCurrentTimer({start:newDate});
        if(callback){
            callback();
        }
    },[setCurrentTimer]);
    
    const stopTimer = useCallback( async()=>{
        
        const timeElapsed = getTimeArray(currentTimer.start);
        

        setCurrentTimer({start:undefined});
        
        flushSync(async ()=>{
            onStop(timeElapsed);
            setElapsedSeconds(undefined);
        })
        
        
    },[setCurrentTimer,currentTimer.start,onStop]);
    return [startTimer,stopTimer,isPaused,seconds,setCurrentTimer] as const;
}
export default useTimer;