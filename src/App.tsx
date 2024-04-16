import {useState,useEffect, useCallback} from 'react';
import Sidebar from './components/Sidebar'
import TimerView from './components/TimerView'
import Content from './components/Content';
import { Routes,Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { useLocalForage } from './hooks/useLocalForage';
import useTimer from './hooks/useTimer';
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/themeProvider"
import localforage from 'localforage';
import { ScrollArea } from "@/components/ui/scroll-area"
import AboutPage from './components/AboutPage';
import { Card, CardContent , CardHeader,CardDescription ,CardTitle} from "@/components/ui/card"
import SettingsPage from './components/SettingsPage';
import { TimerContext } from './contexts/TimerContext';
import BreadcrumbsMenu from './components/BreadcrumbsMenu';
import {
  Dialog,
  DialogContent,

} from "@/components/ui/dialog"



export type AllTimers ={
  [id:string]:Timer,
}
export type Timer ={
  name:string,
  totalTime:number,
}
export type TimerDates = {
  [key:string]:number
}

import { getStyledStringByTimerObject } from './lib/timeUtils';
import { Button } from './components/ui/button';
import { MobileContext } from './contexts/MobileContext';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Clock, Pause, Play } from 'lucide-react';

import { BrowserRouter } from 'react-router-dom';


import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleContext } from './contexts/GoogleContext';
import useGoogleUserInfo from './hooks/useGoogleUserInfo';
import useGoogleDrive from './hooks/useGoogleDrive';
import useInterval from './hooks/useInterval';
import { useTranslation } from 'react-i18next';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

export type UserTokens = {
  access_token:string,
  expiry_date:number,
  id_token:string,
  scope:string,
  token_type:string,
}
export type SyncOption = {
  type : 'done' | 'sync' | 'error',
  message:string,
}
function App() {


  const [userTokens, setUserTokens] = useLocalForage<UserTokens>('userTokens', null);
  const [refreshToken, setRefreshToken] = useLocalForage<string | null>('refreshToken',null);
  const userData = useGoogleUserInfo(userTokens?.access_token || '',()=>{
    refreshAceessToken();
  });

  const [userFiles,createFile, openFile, deleteFile, editFile,refreshFiles] = useGoogleDrive(userTokens?.access_token || '');
  
  const [currentSyncOption,setCurrentSyncOption] = useState<SyncOption>({type:'error',message:'No account'});
  const [isSyncedOnPageOpen,setIsSyncedOnPageOpen] = useState(false);
  //google auth & other methods
 

  const refreshAceessToken = useCallback(async () => {
    await fetch('https://server.time-tracker.veiag.xyz/auth/google/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: refreshToken})
    }).
    then(async (response) => {
      if(!response.ok){
        throw new Error('Failed to refresh token');
      }
      return response.json();
    }).then((tokens) => {
      setUserTokens(tokens);
    }).catch((error) => {
      console.error(error);
    });
  }  ,[refreshToken,setUserTokens]);

 
  
 
  //rest of app
  const [timers,setTimers] = useLocalForage<AllTimers>('timers',{});
  
  const [currentTimerDate,setCurrentTimerDate] = useState<TimerDates>({});

  const [currentTimer,setCurrentTimer] = useState<Timer | undefined>();

  const [currentID,setCurrentID] = useState<string | undefined>(undefined);

  const [selectedTimerID,setSelectedTimerID] = useLocalForage<string>('selectedTimerID','');
  const [isZenMode,setIsZenMode] = useLocalForage<boolean>('zenmode',false,);

  const [isTutorialOpened,setIsTutorialOpened] = useState(false);


  const [isSidebarOpened,setIsSidebarOpened] = useState(false);


  const timerCallback =useCallback(async (timeElapsed:[{ day: string; ms: number }])=>{
    // const newDate = new Date();

    // const dateString = newDate.toDateString();
    const newTimerDate = {...currentTimerDate};
    let sumOfTime = 0;

    timeElapsed.forEach((time) => {
        if(newTimerDate[time.day]){
            newTimerDate[time.day] += time.ms;
        }
        else{
            newTimerDate[time.day] = time.ms;
        }
        sumOfTime += time.ms;
    });
    const newTimers = {...timers};

    if(currentID){
      newTimers[currentID].totalTime += sumOfTime;
    }
    setCurrentTimerDate(newTimerDate);
    

    if(currentID){
      await localforage.setItem(currentID,newTimerDate);
    }
    await setTimers(newTimers);
    await syncWithGoogleDrive(true);
    return;
  },[currentTimerDate,currentID,timers,setTimers])

  const [startTimer,stopTimer,isPaused,seconds,setTimerLocalForage] = useTimer(timerCallback);

  const syncWithGoogleDrive = async (writeOnly:boolean = false) => {
    if(userTokens){
      // console.log('try to check for token expiry 😪');
      await checkForTokenExpiry();
    }
    setCurrentSyncOption({type:'sync',message:'Syncing with Google Drive...'});
    // console.log('syncing with google drive 😣😏😶😑' ,refreshToken,userFiles)
    if(!refreshToken ) return setCurrentSyncOption({type:'error',message:'No refresh token found'});
    //check if userFiles exist
    if(!userFiles.files){
      return setCurrentSyncOption({type:'error',message:'No user files found'});
    }
    
    

    // console.log('user files and refresh token exist , syncing with google drive')

    const saveObj = {}
    await localforage.iterate((value, key) =>{
        if(key !== 'userTokens' && key !== 'refreshToken'){
          saveObj[key] = value;
        }
    }).then(()=> {
        // console.log(saveObj);
    });
    const stringifiedSaveObj = JSON.stringify(saveObj);
    //check if file timers.json exist
    const file = userFiles.files.find((file) => {
      return file.name === 'timers.json'
    });
    
    if(!file){
      await createFile('timers.json',stringifiedSaveObj);
    }
    if(writeOnly){
      await editFile(file.id,stringifiedSaveObj);

      setCurrentSyncOption({type:'done',message:'Synced with Google Drive'});
      return;
    }
    if(file){
      await openFile(file.id,async (content) => {
        // console.log('Content from file ',file,'is ',content)
        if(content !== stringifiedSaveObj){
          const syncedSave = JSON.parse(content);
          //merge localforage data with google drive data
          syncedSave['timers'] = {...saveObj?.['timers'],...syncedSave?.['timers']};
          
          for (const key in syncedSave) {
            if (Object.prototype.hasOwnProperty.call(syncedSave, key)) {
              const element = syncedSave[key];
                switch (key) {
                  case 'timers':
                    setTimers(element);
                    break;
                  case 'zenmode':
                    setIsZenMode(element);
                    break;
                  case 'selectedTimerID':
                    setSelectedTimerID(element);
                    break;
                  case 'currentTimer':
                    setTimerLocalForage(element);
                    break;
                  default:
                    await localforage.setItem(key, element);
                    break;
                }
            } 
         }
        }
      });
      setCurrentSyncOption({type:'done',message:'Synced with Google Drive'});
    }
    // console.log('first sync ended');
    setIsSyncedOnPageOpen(true);
  }

  useEffect(() => {
      if(selectedTimerID && timers){
          setCurrentID(selectedTimerID);
          setCurrentTimer(timers[selectedTimerID]);
          localforage.getItem<TimerDates>(selectedTimerID).then((data) => {
              if(data){
                  setCurrentTimerDate(data);
              }
              else{
                  setCurrentTimerDate({});
              }
          });
      }
  },[selectedTimerID,timers,setCurrentTimerDate]);


  

  const unselectTimer = async (id?:string ) => {
    if(!isPaused){
      await stopTimer();
    }
    if(!id){
      setCurrentTimer(undefined);
      setCurrentTimerDate({});
    }
    setSelectedTimerID(id || '');
    await syncWithGoogleDrive(true);
  }

  const toggleTimer = (id:string) => {
    const syncedStartTimer =async ()=>{
      await syncWithGoogleDrive(true);
    }
     
    if(isPaused){
      if(id !== selectedTimerID){
        setSelectedTimerID(id);
      }
      startTimer(syncedStartTimer)
    }
    else{
      if(id === selectedTimerID){
        stopTimer();
      }
      else{
        stopTimer();
        setSelectedTimerID(id);
        startTimer(syncedStartTimer)
      }
    }
  }
  const addTimer = (timerName:string) => {
    const id = crypto.randomUUID();
    const newTimer:Timer = {
      name:timerName,
      totalTime:0,
    }
    setTimers({...timers,[id]:newTimer});
    localforage.setItem(id,{[new Date().toDateString()]:0});
    syncWithGoogleDrive(true);
  }
  const deleteTimer =async (id:string) => {
    
    const newTimers = {...timers};
    delete newTimers[id];
    if (id === selectedTimerID){
      if(!isPaused){
        await stopTimer();
      }
      setSelectedTimerID('');
      
    }
    await localforage.removeItem(id);
    setTimers(newTimers);
    await syncWithGoogleDrive(true);
  }
  const checkForTokenExpiry = useCallback(async() => {
    if(userTokens){
      const now = new Date().getTime();
      if(now >= userTokens.expiry_date){
        // console.log('Token expired');
        if(refreshToken){
          await refreshAceessToken();
        }
      }
    }
  },[userTokens,refreshToken,refreshAceessToken]);
  useEffect(() => {
    if(!isSyncedOnPageOpen && userTokens && userFiles){ 
      const func = async()=>{
        // console.log('syncing with google drive on page open')
        await syncWithGoogleDrive();
      }
      func();
    }
  },[userTokens,userFiles,isSyncedOnPageOpen]);
  //check if syncing now on page close and inform user if syncing is in progress
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if(currentSyncOption.type === 'sync'){
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload',handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload',handleBeforeUnload);
    }
  },[currentSyncOption]);

  const [syncPeriod,setSyncPeriod] = useLocalForage<number>('syncPeriod',5);
  //sync with google drive every 5 minutes
  useInterval(()=>{
    // console.log('😡👿syncing with google drive every 5 minutes')
    syncWithGoogleDrive();
  
  },syncPeriod*60*1000);

  const [lang,setLang] = useLocalForage<string>('lang','en');
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(lang);
  },[lang,i18n]);

  
  return (
      <div className="min-h-dvh h-dvh max-h-dvh relative box-border  ">
        <GoogleOAuthProvider clientId='639924263282-u23hu74l54qpr261bj77cfivcveto81u.apps.googleusercontent.com'>
        <GoogleContext.Provider value={
          {
            userTokens,
            setUserTokens,
            refreshToken,
            setRefreshToken,
            refreshAceessToken,
            userData,
            userFiles,createFile, openFile, deleteFile, editFile,refreshFiles,
            currentSyncOption,
            setCurrentSyncOption,
            syncWithGoogleDrive,
            syncPeriod,
            setSyncPeriod,
          }
        }>
        <MobileContext.Provider value={
          {
            isSidebarOpened,
            setIsSidebarOpened,
          }
        }>
       <TimerContext.Provider value={
          {
            currentTimer,
            setCurrentTimer,
            currentTimerDate,
            setCurrentTimerDate,
            selectedTimerID,
            setSelectedTimerID,
            seconds,
            timers,
            setTimers,
            addTimer,
            deleteTimer,
            toggleTimer,
            unselectTimer,
            isPaused,
            currentID,
            setCurrentID,
            isZenMode,
            setIsZenMode,
            setIsTutorialOpened,
            lang,
            setLang
          }
        
       }>
       
       <ThemeProvider>
       <ScrollArea className="h-full max-h-full min-h-full relative box-border">
        <div className="flex flex-col sm:pb-0 pb-16 min-h-dvh">
        <Toaster />
        <Dialog open={isZenMode} onOpenChange={setIsZenMode}>
          <DialogContent className='h-dvh max-h-dvh max-w-screen justify-center items-center sm:rounded-none rounded-none border-none'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <div className='flex gap-2 items-center font-semibold lg:text-4xl'>
                <Clock size={32} strokeWidth={3}/>
                <span className="truncate max-w-32 lg:max-w-4xl">
                  {currentTimer?.name || 'Щось пішло не так...' }
                </span>
              </div >
              <div className='font-bold mb-4 text-6xl lg:text-9xl'>
                {getStyledStringByTimerObject(currentTimer?.totalTime, seconds) || '00:00:00'}
              </div>
              <Button size="lg" className='px-8 py-6 '
                  onClick={() => selectedTimerID && toggleTimer(selectedTimerID)}
                  disabled={!selectedTimerID}
                >
                  {isPaused? 
                    <Play size={16} strokeWidth={4} fill="currentColor" /> : 
                    <Pause size={16} strokeWidth={2} fill="currentColor"/>
                  }
                </Button>
            </div>
              
          </DialogContent>
        </Dialog>
        <TutorialDialog open={isTutorialOpened} onOpenChange={setIsTutorialOpened}/>
        <BrowserRouter> 
         
          <Navigation />
          <SpeedInsights/>
          <Analytics/>
          <div className=" flex-grow flex flex-col relative box-border pt-6 sm:pt-24 ">
            <BreadcrumbsMenu timers={timers}/>
          <div className="flex gap-4 relative ">
          <Routes>
              <Route path="/about" element={<AboutPage />} />
              <Route path="/settings" element={<Content>
                <SettingsPage />
              </Content>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
              <Route path="/terms-of-service" element={<TermsOfService/>} />
              <Route path="/:id" element={
                <div className='container flex gap-4 relative  h-full'>
                  <Sidebar />
                  <Content>
                    <TimerView />
                  </Content> 
                </div>}/>
              <Route path="/" element={
                <div className='container flex gap-4 relative h-full'>
                  <Sidebar/>
                  <Content>
                    <Dashboard />
                  </Content>
                </div>
              } />
          </Routes>
          
          </div>
          
          </div>
          <Footer/>
        </BrowserRouter>
        
        </div>

        </ScrollArea>
        </ThemeProvider>
       
       </TimerContext.Provider>
       </MobileContext.Provider>
       </GoogleContext.Provider>
       </GoogleOAuthProvider>
      </div>
  )
}

type TutorialDialogProps = {
  open:boolean,
  onOpenChange: (open:boolean) => void,
}
const TutorialDialog = ({open,onOpenChange}:TutorialDialogProps)=>{
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Carousel>
          <CarouselContent>
          <CarouselItem >
              <Card className='h-full'>
                  <CardHeader>
                    <CardTitle>
                      Привіт!
                    </CardTitle>
                    
                    <CardDescription>
                      <p>Це туторіал по роботі з таймерами</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-col items-center">
                      <span>
                        Цей додаток створений для відстеження часу, який ви витрачаєте на різні завдання.
                      </span>
                      <span>
                        
                      </span>
                    
                    </div>
                  </CardContent>
                </Card>
            </CarouselItem>
            <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Привіт!
                    </CardTitle>
                    
                    <CardDescription>
                      <p>Це туторіал по роботі з таймерами</p>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 flex-col items-center">
                      <span>
                        Цей додаток створений для відстеження часу, який ви витрачаєте на різні завдання.
                      </span>
                      <span>
                        Для початку вам потрібно створити таймер. Зробити це можна натиснувши на кнопку.
                      </span>
                      <Button variant='outline'>
                        Створити таймер
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            </CarouselItem>
           
            <CarouselItem>...</CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </DialogContent>
    </Dialog>
  )
}

const Footer = ()=>{
  const {t} = useTranslation();
  return <footer className="bg-card border-t py-2 w-full ">
    <div className="container flex justify-between items-center sm:gap-4 flex-col sm:flex-row">
    <Button variant='link' asChild>
          <Link to='/about'>
            {t("About")}
          </Link>
        </Button>
      <div className=" flex gap-4 items-center">
        <Button variant='link' asChild className='text-wrap text-center'>
          <Link to='/privacy-policy'>
            {t("privacy")}
          </Link>
        </Button>
        <Button variant='link' asChild className='text-wrap text-center'>
          <Link to='/terms-of-service'>
            {t("terms")}
          </Link>
        </Button>
        
      </div>
    </div>
  </footer>
}
export default App


