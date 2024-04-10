
import localforage from "localforage";
import {  useEffect, useState} from "react";

type UseLocalForageReturnType<T> = [T, (newState: T) => Promise<void>];


export const useLocalForage = <T>(key: string,initialState:T,callback?:(value:T)=>void):UseLocalForageReturnType<T> => {
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
        await localforage.setItem(key,newState);
        return;
    }
   
    
    return [state,setLocalForage] as const;
};
