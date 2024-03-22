import { get } from "http";


type TimerDates = {
    [key:string]:number
  }
const getNumbersBySeconds = (miliseconds:number | undefined = 0,seconds:number = 0 ) => {
    if(miliseconds !== undefined && miliseconds !== null){
        const curSeconds = Math.floor(miliseconds / 1000) + 
        seconds || 0;
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
    console.log('getByRangeCall ~',startDate.toLocaleDateString(),endDate.toLocaleDateString(),currentTimerDate,seconds);
    const objKeys = Object.keys(currentTimerDate);
    // add dates from startDate to endDate if they are not in objKeys
    const currentDate = new Date(endDate);
    while(currentDate >= startDate){
        if(!objKeys.includes(currentDate.toDateString())){
            objKeys.push(currentDate.toDateString());
        }
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return objKeys.filter((date) => {
        const dateObj = new Date(date);
        return dateObj >= startDate && dateObj <= endDate;
    }).map((date) => {
        let addSeconds =0;
        if(date === new Date().toDateString()){
            addSeconds = seconds;
        }
        return {
            name:date,
            ms:currentTimerDate[date] || 0 + addSeconds*1000
        };
    }).sort((a,b) => {
        return new Date(a.name).getTime() - new Date(b.name).getTime();
    });
}
const getTimerDatesAll = (currentTimerDate:TimerDates,seconds:number=0) => {
    const objKeys = Object.keys(currentTimerDate).sort((a,b) => {
        return new Date(a).getTime() - new Date(b).getTime();
    });
    const firstDate = new Date(objKeys[0]);
    console.log("🚀 ~ getTimerDatesAll ~ firstDate:", firstDate)

    return getTimerDatesByRange(firstDate,new Date(),currentTimerDate,seconds);
}
const round = (num: number, decimals: number) => {
    return Number(
      Math.round(parseFloat(num + "e" + decimals)) + "e-" + decimals
    );
  };
export {getNumbersBySeconds,getTimerDatesByRange,round,getTimerDatesAll,getStyledStringByTimerObject};
