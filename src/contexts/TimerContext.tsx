import { createContext } from 'react';
import { AllTimers ,Timer,TimerDates} from '../App';

type TimerContextType = {
    setSecondPage: (value:{name:string,url:string}|undefined)=>void,
    currentTimer:Timer | undefined,
    setCurrentTimer: (timer:Timer | undefined) => void,
    currentTimerDate: TimerDates ,
    setCurrentTimerDate: (timerDate:TimerDates) => void,
    selectedTimerID: string ,
    setSelectedTimerID: (id:string) => void,
    seconds: number,
    addTimer: (name:string) => void,
    deleteTimer: (id:string) => void,
    toggleTimer: (id:string) => void,
    unselectTimer: () => void,
    isPaused: boolean,
    timers: AllTimers,
    setTimers: (timers:AllTimers) => void,
    currentID: string | undefined,
    setCurrentID: (id:string) => void,
};
export const TimerContext = createContext<TimerContextType>({} as TimerContextType);
