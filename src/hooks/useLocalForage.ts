
import localforage from "localforage";
import {  useEffect, useState} from "react";

export const useLocalForage = <T>(key: string,initialState:T,callback?:(value:T)=>void) => {
    const [state,setState] = useState<T>(initialState);
    useEffect(() => {
        localforage.getItem<T>(key).then((data) => {
            if(data !== null && data !== undefined){
                setState(data);
                if(callback){
                    callback(data);
                }
            }
        });
    },[key]);
    const setLocalForage =async (newState:T) => {
        setState(newState);
        if(callback){
            callback(newState);
        }
        return localforage.setItem(key,newState);
        
    }
   
    
    return [state,setLocalForage] as const;
};
