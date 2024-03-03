import localforage from "localforage";
import { useEffect, useState} from "react";

export const useLocalForage = <T>(key: string,initialState:T) => {
    //memoize values
    // console.log('useLocalForage:',key);
    const [state,setState] = useState<T>(initialState);
    useEffect(() => {
        localforage.getItem<T>(key).then((data) => {
            if(data){
                setState(data);
            }
        });
    },[key]);
    const setLocalForage = (newState:T) => {
        setState(newState);
        localforage.setItem(key,newState);
    }
    return [state,setLocalForage] as const;
};
