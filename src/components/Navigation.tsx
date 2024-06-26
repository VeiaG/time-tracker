import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { toast } from "sonner";

import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getStyledStringByTimerObject } from "@/lib/timeUtils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { useTheme } from "./themeProvider";
import { TypographyMuted } from "./ui/typography";

import { TimerContext } from "@/contexts/TimerContext";
import { MobileContext } from "@/contexts/MobileContext";
import {  Check, CircleUserRound, Clock, Home, Maximize, Menu, Pause, Play, Plus, RefreshCw, RefreshCwOff } from "lucide-react";
import { GoogleContext } from "@/contexts/GoogleContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
const Navigation = () => {
  const {
    addTimer,
  } = useContext(TimerContext);

  const {
    isSidebarOpened,
    setIsSidebarOpened,
  } = useContext(MobileContext);
  const {userTokens} = useContext(GoogleContext);
  const {currentSyncOption,syncWithGoogleDrive} = useContext(GoogleContext);

  const [isOpen, setOpen] = useState(false);

  const onClose = () => setOpen(false);

  const [value, setValue] = useState("");
  const {t} = useTranslation();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const handleClose = () => {
    if (value) {
      onClose();
      addTimer(value);
      toast.success(t("timer created",{value:value}),{position:"top-center"});
      setValue("");
      return;
    }
    toast.warning(t("please enter timer name"),{position:"top-center"});
  };
  const closeSidebar = () => {
    setIsSidebarOpened(false);
  }
  return (
    <nav className="
      py-3 sm:py-4 border-t sm:border-t-0 sm:border-b fixed bottom-0 sm:bottom-auto sm:top-0 
      left-0 w-full z-50 sm:backdrop-blur-sm bg-background sm:bg-none">
        <div className="container flex gap-8 sm:gap-2 lg:justify-normal justify-center items-center">
            <Button variant="outline" className=" lg:hidden" 
              size="icon" onClick={()=>setIsSidebarOpened(!isSidebarOpened)}>
              <Menu size={16} strokeWidth={4}/>
            </Button>
            <Link onClick={closeSidebar} to="/" className="mr-auto hidden sm:block text-3xl font-semibold tracking-tight ">
              TimeTracker    
            </Link >
            <Button className="sm:hidden flex" asChild size="icon" variant="outline" onClick={closeSidebar}>
              <Link to="/" >
                <Home size={16} strokeWidth={3}/>
              </Link>
            </Button>
            <Button onClick={()=>syncWithGoogleDrive()} variant="ghost" size="icon" 
            className={cn(`fixed z-20 right-4 top-4 sm:right-auto sm:top-auto sm:z-auto sm:relative
            `,!userTokens ?"hidden":"")}>
              {
                (currentSyncOption.type==='sync')?  <RefreshCw className="animate-spin"/>:
                (currentSyncOption.type==='done')?  <Check/>:
                (currentSyncOption.type==='error')?  <RefreshCwOff/>: null
              }
            </Button>
            <Popover open={isOpen} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                
                <Button  variant="outline" className="
                w-10 h-10 px-0 
                lg:px-4  lg:w-auto sm:rounded-md
                ">
                  <Plus size={18} strokeWidth={4} className="lg:hidden"  />

                  <span className="hidden lg:block">
                    {t("create timer")}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <Input
                    type="text"
                    placeholder={t("timerName")}
                    onChange={handleChange}
                  />
                  <Button onClick={handleClose}>{t("Add")}</Button>
                </div>
              </PopoverContent>
            </Popover>
            <TimerNameMenu />
            <AvatarMenu/>
        </div>
    </nav>
  );
};

export default Navigation;


const AvatarMenu = ()=>{
    const {theme,setTheme} = useTheme();
    const {userData} = useContext(GoogleContext);
    const {t} = useTranslation();
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
      <Avatar className="cursor-pointer">
          <AvatarImage src={userData?.picture || ""} />
          <AvatarFallback >
              {userData?.name ?
                  userData.name.split(" ").map((word)=>word[0]).join("")
                  :
                  <CircleUserRound size={24} strokeWidth={2} /> 
              }
              
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t("Menu")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
         <DropdownMenuItem asChild>
            <Link to='groups'>{t("Groups")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              
              <span>{t("Theme")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} 
                  onValueChange={(value)=>setTheme(value as "dark" | "light" | "system")}>
                <DropdownMenuRadioItem value="light">
                  
                  <span>{t("Light")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                    
                  <span>{t("Dark")}</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                    
                    <span>{t("System")}</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuItem disabled>
            <span>{t("keyboard shortcuts")}</span>
            <DropdownMenuShortcut>CTRL+K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to='settings'>{t("Settings")}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup> 
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
const TimerNameMenu = ()=>{
  
  const {selectedTimerID,isPaused,currentTimer,seconds,unselectTimer,toggleTimer,setIsZenMode} = useContext(TimerContext);
  const navigate=  useNavigate();
  const {t}= useTranslation();
  return (
    <div className="
      flex gap-0 items-center ">
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
          <Button  
          className="rounded-r-none hidden sm:flex gap-2"
          variant="outline"
          disabled={!selectedTimerID}
          >
            <Clock size={16} strokeWidth={3} />

            <div className="truncate max-w-32">{
              getStyledStringByTimerObject(currentTimer?.totalTime || 0 , seconds) || (<TypographyMuted>00:00:00</TypographyMuted>) }
            </div>
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full">
      <DropdownMenuLabel className="truncate max-w-sm">{currentTimer?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={()=>{
            navigate(`/${selectedTimerID}`) ;
          }}>
            
            <span>{t("Dashboard details")}</span>
            
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>unselectTimer()}>
            
            <span className=" text-red-800 dark:text-red-400">{t("unselect")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button size="icon" className="rounded-none  hidden sm:flex"
      onClick={() => selectedTimerID && toggleTimer(selectedTimerID)}
      disabled={!selectedTimerID}
    >
      {isPaused? 
        <Play size={16} strokeWidth={4} fill="currentColor" /> : 
        <Pause size={16} strokeWidth={2} fill="currentColor"/>
      }
    </Button>
    <Button size="icon"
      onClick={() => {
        setIsZenMode(true);
      }} 
      variant="outline"
      disabled={!selectedTimerID}
      className="lg:rounded-l-none">
      <Maximize size={16} strokeWidth={4} />
    </Button>
    </div>
  )
}

