import {useState, useEffect,useCallback} from 'react';
import { useLocalForage } from './useLocalForage';

export type CurrentTimer = {
    start:number | undefined
}
export type ElapsedTime =  [{ day: string; ms: number }] | undefined;
const useTimer = (onStop : (timeElapsed: ElapsedTime)=>Promise<void>)=>{
    const [currentTimer,setCurrentTimer] = useLocalForage<CurrentTimer>('currentTimer',{start:undefined});

    const [isPaused,setIsPaused] = useState<boolean>(!currentTimer.start);
    
    const [seconds , setElapsedSeconds] = useState<ElapsedTime>(undefined);


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
    const updateElapsedSeconds = useCallback(()=>{
        if(currentTimer.start){
            
            const timeElapsed =getTimeArray(currentTimer?.start) || undefined ;
            setElapsedSeconds(timeElapsed);
            
        }
    },[currentTimer.start]);

    //fire once
    useEffect(()=>{
        updateElapsedSeconds();
    },[updateElapsedSeconds]);
    
    useEffect(()=>{
        let interval:ReturnType<typeof setInterval>;
        if(!isPaused){
            interval = setInterval(updateElapsedSeconds,1000);
        }
        else{
            clearInterval(interval!);
            setElapsedSeconds(undefined);
        }
        return () => clearInterval(interval);
    },[isPaused,updateElapsedSeconds]);

    useEffect(()=>{
        setIsPaused(!currentTimer.start);
    },[currentTimer.start]);
    
    const startTimer = ()=>{
        const newDate = Date.now();
        setCurrentTimer({start:newDate});
    }
    
    const stopTimer = async()=>{
        
        
        // const newDate = Date.now();


        // const timeElapsed = currentTimer.start ? newDate - currentTimer.start : 0;
        // set time elapsed to array of days and ms for each day from currentTimer.start to newDate
        const timeElapsed = getTimeArray(currentTimer.start);
        

        setCurrentTimer({start:undefined});
        
        
        await onStop(timeElapsed);
        setElapsedSeconds(undefined);
        
    }
    return [startTimer,stopTimer,isPaused,seconds] as const;
}
export default useTimer;