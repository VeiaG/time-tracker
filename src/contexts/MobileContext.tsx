import { createContext } from 'react';


type MobileContextType = {
    isSidebarOpened: boolean,
    setIsSidebarOpened: (isSidebarOpened:boolean) => void,
    isMenuOpened: boolean,
    setIsMenuOpened: (isMenuOpened:boolean) => void,
};

export const MobileContext = createContext<MobileContextType>({} as MobileContextType);
