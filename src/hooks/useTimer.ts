import {useState,useMemo, useEffect,useCallback} from 'react';
import { useLocalForage } from './useLocalForage';

export type CurrentTimer = {
    start:Date | undefined
}

const useTimer = (onStop : (timeElapsed: number)=>Promise<void>)=>{
    const [currentTimer,setCurrentTimer] = useLocalForage<CurrentTimer>('currentTimer',{start:undefined});

    const [isPaused,setIsPaused] = useState<boolean>(!currentTimer.start);
    
    const [elapsedSeconds , setElapsedSeconds] = useState<number>(0);

    const seconds = useMemo(()=>{
        return elapsedSeconds;
    },[elapsedSeconds]);

    const updateElapsedSeconds = useCallback(()=>{
        const newDate = new Date();
        const timeElapsed = currentTimer.start ? 
            Math.floor((newDate.getTime() - currentTimer.start.getTime())/1000) : 0;
        setElapsedSeconds(timeElapsed);
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
            setElapsedSeconds(0);
        }
        return () => clearInterval(interval);
    },[isPaused,updateElapsedSeconds]);

    useEffect(()=>{
        setIsPaused(!currentTimer.start);
    },[currentTimer.start]);
    
    const startTimer = ()=>{
        const newDate = new Date();
        setCurrentTimer({start:newDate});
    }
    const stopTimer = async()=>{
        
        
        const newDate = new Date();

        const timeElapsed = currentTimer.start ? newDate.getTime() - currentTimer.start.getTime() : 0;

        setCurrentTimer({start:undefined});
        
        
        await onStop(timeElapsed);
        setElapsedSeconds(0);
        
    }
    return [startTimer,stopTimer,isPaused,seconds] as const;
}
export default useTimer;