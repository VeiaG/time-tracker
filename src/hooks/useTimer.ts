import {useState,useEffect} from 'react';
const useTimer = (callback : ()=>void)=>{
    const [isPaused,setIsPaused] = useState<boolean>(true);
    console.log("useTimer",isPaused);
    useEffect(() => {
        let interval:ReturnType<typeof setTimeout>;
        if(!isPaused){
            interval = setInterval(callback,1000);
        }
        return () => clearInterval(interval);
    },[isPaused,callback]);
    const startTimer = ()=>{
        setIsPaused(false);
    }
    const stopTimer = ()=>{
        setIsPaused(true);
    }
    return [startTimer,stopTimer,isPaused] as const;
}
export default useTimer;