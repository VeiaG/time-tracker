import { time } from "console";

type TimerDates = {
    [key:string]:number
  }
const getNumbersBySeconds = (miliseconds:number | undefined = 0,seconds:number = 0 ) => {
    if(miliseconds !== undefined && miliseconds !== null){
        const curSeconds = Math.floor(miliseconds / 1000) + 
        seconds;
        const days = Math.floor(curSeconds / 86400);
        const hours = Math.floor((curSeconds / 3600)%24);
        const minutes = Math.floor((curSeconds % 3600) / 60);
        const sec = curSeconds % 60;
        console.log('sec',sec);
        return getStringByTimerObject({
            days,
            hours,
            minutes,
            sec
        })
        
    }
    return getStringByTimerObject({sec:0});
}

const getStyledStringByTimerObject = (miliseconds:number | undefined =0,seconds:number = 0) => {
    let obj:{
        days?:number,
        hours?:number,
        minutes?:number,
        sec?:number
    } = {};
    if(miliseconds !== undefined && miliseconds !== null){
        const curSeconds = Math.floor(miliseconds / 1000) + 
        seconds;
        const days = Math.floor(curSeconds / 86400);
        const hours = Math.floor((curSeconds / 3600)%24);
        const minutes = Math.floor((curSeconds % 3600) / 60);
        const sec = curSeconds % 60;
        obj = {
            days,
            hours,
            minutes,
            sec
        };
    }
    else {
        obj = {sec:0}
    }

    let string = '';
    if(obj?.days){
        if(obj?.days === 1){
            string += obj?.days + ' д.';
        }
        else{
            string += obj?.days + ' дн.';
        }
    }
    // hh:mm:ss
    string+= 
    (obj?.hours !== undefined  ? (obj?.hours < 10 ? '0' + obj?.hours : obj?.hours) : '00') + ':' +
    (obj?.minutes !== undefined  ? (obj?.minutes < 10 ? '0' + obj?.minutes : obj?.minutes) : '00') + ':' +
    (obj?.sec !== undefined  ? (obj?.sec < 10 ? '0' + obj?.sec : obj?.sec) : '00');
    return string;
}
const getStringByTimerObject = (timerObject:{days?:number,hours?:number,minutes?:number,sec?:number}) => {
   let string ='';
     if(timerObject.days ){
          string += timerObject.days + ' дн.';
     }
    if(timerObject.hours){
        string += timerObject.hours + ' год.';
    }
    if(timerObject.minutes){
        string += timerObject.minutes + ' хв.';
    }
    if(timerObject.sec ){
        string += timerObject.sec + ' сек.';
    }
    if(timerObject.sec === 0 && !string){
        string  += timerObject.sec + ' сек.';
    }
    return string;
}
const getTimerDatesByRange =(startDate:Date,endDate:Date,currentTimerDate:TimerDates,seconds:number=0) => {
    return Object.keys(currentTimerDate).filter((date) => {
        const dateObj = new Date(date);
        return dateObj >= startDate && dateObj <= endDate;
    }).map((date) => {
        let addSeconds =0;
        if(date === new Date().toDateString()){
            addSeconds = seconds;
        }
        return {
            name:date,
            ms:currentTimerDate[date] + addSeconds*1000
        };
    });
}
const getTimerDatesAll = (currentTimerDate:TimerDates,seconds:number=0) => {
    return Object.keys(currentTimerDate).map((date) => {
        let addSeconds =0;
        if(date === new Date().toDateString()){
            addSeconds = seconds;
        }
        return {
            name:date,
            ms:currentTimerDate[date] + addSeconds*1000
        };
    });
}
const round = (num: number, decimals: number) => {
    return Number(
      Math.round(parseFloat(num + "e" + decimals)) + "e-" + decimals
    );
  };
export {getNumbersBySeconds,getTimerDatesByRange,round,getTimerDatesAll,getStyledStringByTimerObject};
