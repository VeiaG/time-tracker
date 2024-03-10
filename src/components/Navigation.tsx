import React, { useState } from "react";
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

type NavigationProps = {
  addTimer: (timerName: string) => void;
  toggleTimer:(id:string)=>void,
  isPaused: boolean;
  currentTimer: Timer | undefined;
  currentID: string;
};

const Navigation = ({
  currentID,
  addTimer,
  toggleTimer,
  isPaused,
  currentTimer,
}: NavigationProps) => {
  const [isOpen, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const navigate = useNavigate();

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
    <nav className="py-4 border-b fixed top-0 left-0 w-full z-10 backdrop-blur-sm ">
      <div className="container flex gap-2">
      <h2 className="mr-auto mt-10 scroll-m-20  text-3xl font-semibold tracking-tight transition-colors first:mt-0 ">
            TimerApp
          </h2>
        <NavigationMenu>
          <NavigationMenuList>
            <Popover open={isOpen} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline">Створити таймер</Button>
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
            <NavigationMenuItem className="
              flex gap-0 items-center
            ">
              { (
                <>
                  <Button onClick={()=>navigate(`/timers/${currentID}`)} 
                  className="rounded-r-none"
                  variant="outline"
                  disabled={!currentID}
                  >
                    <i className="fa-solid fa-clock mr-2"></i>
                    
                    <div className="truncate max-w-24">{
                      currentTimer?.name || (<TypographyMuted>Не обрано</TypographyMuted>) }
                    </div>
                  </Button>
                  <Button size="icon" className="rounded-none"
                    onClick={() => toggleTimer(currentID)}
                    disabled={!currentID}
                  >
                    {
                      <i className={`fa fa-${isPaused ? "play" : "pause"}`} />
                    }
                  </Button>
                  <Button size="icon"
                    onClick={() => {}} 
                    variant="outline"
                    disabled={!currentID}
                    className="rounded-l-none">
                    <i className="fa-solid fa-expand"></i>
                  </Button>
                </>
              )}
            </NavigationMenuItem>
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
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Мій профіль</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            
            <span>Профіль</span>
            
          </DropdownMenuItem>
        
          <DropdownMenuItem>
            
            <span>Налаштування</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            
            <span>Сполучення клавіш</span>
            <DropdownMenuShortcut>CTRL+K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
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
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem>
          
          <span>Вийти</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

