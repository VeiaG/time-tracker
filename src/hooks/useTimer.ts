import {useState,useMemo, useEffect,useCallback} from 'react';
import { useLocalForage } from './useLocalForage';

export type CurrentTimer = {
    start:number | undefined
}

const useTimer = (onStop : (timeElapsed: number)=>Promise<void>)=>{
    const [currentTimer,setCurrentTimer] = useLocalForage<CurrentTimer>('currentTimer',{start:undefined});

    const [isPaused,setIsPaused] = useState<boolean>(!currentTimer.start);
    
    const [elapsedSeconds , setElapsedSeconds] = useState<number>(0);

    const seconds = useMemo(()=>{
        return elapsedSeconds;
    },[elapsedSeconds]);

    const updateElapsedSeconds = useCallback(()=>{
        const newDate = Date.now();
        const timeElapsed = currentTimer.start ? 
            Math.floor((newDate - currentTimer.start)/1000) : 0;
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
        const newDate = Date.now();
        setCurrentTimer({start:newDate});
    }
    const stopTimer = async()=>{
        
        
        const newDate = Date.now();

        const timeElapsed = currentTimer.start ? newDate - currentTimer.start : 0;

        setCurrentTimer({start:undefined});
        
        
        await onStop(timeElapsed);
        setElapsedSeconds(0);
        
    }
    return [startTimer,stopTimer,isPaused,seconds] as const;
}
export default useTimer;