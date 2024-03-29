import localforage from "localforage";
import { useEffect, useState} from "react";

export const useLocalForage = <T>(key: string,initialState:T) => {

    const [state,setState] = useState<T>(initialState);
    useEffect(() => {
        localforage.getItem<T>(key).then((data) => {
            if(data !== null && data !== undefined){
                setState(data);
            }
        });
    },[key]);
    const setLocalForage =async (newState:T) => {
        setState(newState);
        return localforage.setItem(key,newState);
    }
    return [state,setLocalForage] as const;
};
