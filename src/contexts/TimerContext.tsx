import { createContext } from 'react';
import { AllTimers ,Timer,TimerDates} from '../App';
import { ElapsedTime } from '@/hooks/useTimer';

type TimerContextType = {
    currentTimer:Timer | undefined,
    setCurrentTimer: (timer:Timer | undefined) => void,
    currentTimerDate: TimerDates ,
    setCurrentTimerDate: (timerDate:TimerDates) => void,
    selectedTimerID: string ,
    setSelectedTimerID: (id:string) => void,
    seconds: ElapsedTime ,
    addTimer: (name:string) => void,
    deleteTimer: (id:string) => void,
    toggleTimer: (id:string) => void,
    unselectTimer: (id?:string) => void,
    isPaused: boolean,
    timers: AllTimers,
    setTimers: (timers:AllTimers) => void,
    currentID: string | undefined,
    setCurrentID: (id:string) => void,
    isZenMode: boolean,
    setIsZenMode: (isZenMode:boolean) => void,
    setIsTutorialOpened: (isTutorialOpened:boolean) => void,
};

export const TimerContext = createContext<TimerContextType>({} as TimerContextType);
