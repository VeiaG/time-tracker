import { createContext } from 'react';


type MobileContextType = {
    isSidebarOpened: boolean,
    setIsSidebarOpened: (isSidebarOpened:boolean) => void,
};

export const MobileContext = createContext<MobileContextType>({} as MobileContextType);
