import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"

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
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
import {  Clock, Home, Maximize, Menu, Pause, Play, Plus } from "lucide-react";
const Navigation = () => {
  const {
    addTimer,
  } = useContext(TimerContext);

  const {
    isSidebarOpened,
    setIsSidebarOpened,
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
    <nav className="
      py-3 sm:py-4 border-t sm:border-t-0 sm:border-b fixed bottom-0 sm:bottom-auto sm:top-0 
      left-0 w-full z-50 sm:backdrop-blur-sm bg-background sm:bg-none">
        <div className="container flex gap-6 sm:gap-2 lg:justify-normal justify-center items-center">
            <Button variant="outline" className=" lg:hidden" 
              size="icon" onClick={()=>{
                setIsSidebarOpened(!isSidebarOpened);
            }}>
              <Menu size={16} strokeWidth={4}/>
            </Button>
            <Link to="/" className="mr-auto hidden sm:block text-3xl font-semibold tracking-tight ">
              TimeTracker    
            </Link>
            <Button className="sm:hidden flex" asChild size="icon" variant="outline">
              <Link to="/" >
                <Home size={16} strokeWidth={3}/>
              </Link>
            </Button>
            <Popover open={isOpen} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-10 h-10 px-0 lg:px-4 lg:h-auto lg:w-auto">
                  <Plus size={18} strokeWidth={4} className="lg:hidden"  />
                  <span className="hidden lg:block">
                    Створити таймер
                  </span>
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
        <Avatar className="cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
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
          <DropdownMenuItem asChild>
            <Link to='settings'>Налаштування</Link>
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
    <div className="
      flex gap-0 items-center ">
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
          <Button  
          className="rounded-r-none hidden lg:flex gap-2"
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

