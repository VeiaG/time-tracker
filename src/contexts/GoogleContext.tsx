import { createContext } from 'react';

import { SyncOption, UserTokens } from '@/App';
import { UserInfo } from '@/hooks/useGoogleUserInfo';
import { UserFiles } from '@/hooks/useGoogleDrive';
import { GetCallback } from '@/hooks/useGoogleDrive';
type GoogleContextType = {
    userTokens: UserTokens,
    setUserTokens: (userTokens:UserTokens) => Promise<void>,
    refreshToken: string,
    setRefreshToken: (refreshToken:string) => Promise<void>,
    refreshAceessToken: () => void,
    userData: UserInfo,
    userFiles : UserFiles,
    createFile : (name:string, content:string) => Promise<void>, 
    openFile : (fileId: string,callback:GetCallback<string>) => Promise<void>, 
    deleteFile: (fileId: string) => Promise<void>, 
    editFile: (fileId: string, content: string) => Promise<void>,
    refreshFiles: () => Promise<void>,
    currentSyncOption : SyncOption,
    setCurrentSyncOption : (syncOption:SyncOption) => void,
    syncWithGoogleDrive : (writeOnly?:boolean) => Promise<void>,
    syncPeriod : number,
    setSyncPeriod : (period:number) => void,
};

export const GoogleContext = createContext<GoogleContextType>({} as GoogleContextType);
