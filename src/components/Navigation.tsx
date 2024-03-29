import React, { useContext, useState } from "react";
import { Timer } from "../App";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { toast } from "sonner";

import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStyledStringByTimerObject } from "@/lib/timeUtils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

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
const Navigation = () => {
  const {
    addTimer,
  } = useContext(TimerContext);

  const {
    isSidebarOpened,
    setIsSidebarOpened,
    isMenuOpened,
    setIsMenuOpened,
  } = useContext(MobileContext);

  const [isOpen, setOpen] = useState(false);

  const onClose = () => setOpen(false);

  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const handleClose = () => {
    if (value) {
      onClose();
      addTimer(value);
      toast.success(`Таймер ${value} успішно створено!`);
      setValue("");
      return;
    }
    toast.warning(`Будь-ласка введіть назву таймера!`);
  };

  return (
    <nav className="py-4 border-b fixed top-0 left-0 w-full z-20">
      <div className="container flex gap-2 lg:justify-normal justify-between items-center">
        <Button variant="secondary" className="lg:hidden" size="icon" onClick={()=>{
            setIsSidebarOpened(!isSidebarOpened);
        }}>
          <i className="fa-solid fa-bars"></i>
        </Button>
        <h2 className="lg:mr-auto  text-3xl font-semibold tracking-tight transition-colors ">
            <Link to="/">
              TimeTracker    
            </Link>
        </h2>
        <NavigationMenu className=" lg:flex">
          <NavigationMenuList>
            <Popover open={isOpen} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" >
                  <span className="hidden h-10 w-10 lg:block lg:h-auto lg:w-auto">
                  Створити таймер
                  </span>
                  <i className="fa-solid fa-plus lg:hidden"></i>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <Input
                    type="text"
                    placeholder="Назва таймера"
                    onChange={handleChange}
                  />
                  <Button onClick={handleClose}>Додати</Button>
                </div>
              </PopoverContent>
            </Popover>
            <TimerNameMenu />
            <AvatarMenu/>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navigation;


type ListItemProps = {
  title: string;
  to: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};
const ListItem = React.forwardRef<React.ElementRef<typeof Link>, ListItemProps>(
  ({ className, title, to, icon, children, ...props }, ref) => {
    return (
      <li >
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            to={to}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="flex flex-row gap-4 items-center">
              {icon && <div className="text-xl">{icon}</div>}
              <div className="">
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              </div>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";

const AvatarMenu = ()=>{
    const {theme,setTheme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <i className="fa-solid fa-bars"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Меню</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              
              <span>Тема</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} 
                  onValueChange={(value)=>setTheme(value as "dark" | "light" | "system")}>
                <DropdownMenuRadioItem value="light">
                  
                  <span>Світла</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                    
                  <span>Темна</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                    
                    <span>Системна</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuItem>
            <span>Сполучення клавіш</span>
            <DropdownMenuShortcut>CTRL+K</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span>Налаштування</span>
          </DropdownMenuItem>
        </DropdownMenuGroup> 
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
const TimerNameMenu = ()=>{
  
  const {selectedTimerID,isPaused,currentTimer,seconds,unselectTimer,toggleTimer,setIsZenMode} = useContext(TimerContext);
  const navigate=  useNavigate();
  return (
    <NavigationMenuItem className="
              flex gap-0 items-center
            ">
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
          <Button  
          className="rounded-r-none hidden lg:flex"
          variant="outline"
          disabled={!selectedTimerID}
          >
            <i className="fa-solid fa-clock mr-2"></i>
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
            
            <span>Детальніше</span>
            
          </DropdownMenuItem>
          <DropdownMenuItem onClick={()=>unselectTimer()}>
            
            <span className=" text-red-800 dark:text-red-400">Зняти вибір</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    <Button size="icon" className="rounded-none  hidden lg:flex"
      onClick={() => selectedTimerID && toggleTimer(selectedTimerID)}
      disabled={!selectedTimerID}
    >
      {
        <i className={`fa fa-${isPaused ? "play" : "pause"}`} />
      }
    </Button>
    <Button size="icon"
      onClick={() => {
        setIsZenMode(true);
      }} 
      variant="outline"
      disabled={!selectedTimerID}
      className="lg:rounded-l-none">
      <i className="fa-solid fa-expand"></i>
    </Button>
    </NavigationMenuItem>
  )
}

