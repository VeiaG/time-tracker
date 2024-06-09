import { ArrowRight, Eye, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { TypographyH3 } from "./ui/typography"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle }from "@/components/ui/dialog"
import { useCallback, useContext, useEffect, useState } from "react"
import TimerPicker from "./TimerPicker"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { TimerContext } from "@/contexts/TimerContext"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ScrollArea } from "./ui/scroll-area"
import { useDebounce } from "@react-hook/debounce"

const GroupsPage = () => {
    const [isDialog, setIsDialog] = useState(false);
    const [value, setValue] = useState('' as string);
    const [pickedTimers,setPickedTimers] = useState<string[]>([]);
    const {t,} = useTranslation();''
    const nullFunction = useCallback(()=>{
        setValue('');
        setPickedTimers([]);
    },[]);
    useEffect(()=>{
        if(!isDialog){
            nullFunction();
        }
    },[isDialog,nullFunction]);
   
    const {groups,addGroup} = useContext(TimerContext);
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useDebounce('');
  return (
    <div className="container flex gap-4 relative h-full py-6">
      <div className="flex flex-col gap-2 w-full ">
        <Dialog open={isDialog} onOpenChange={setIsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("createGroup title")}</DialogTitle>
              <DialogDescription>
                {t("createGroup desc")}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Label>{t("groupName")}</Label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
            <div className="flex flex-col gap-4">
              <TimerPicker picked={pickedTimers} setPicked={setPickedTimers} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialog(false)}>
              {t("Cancel")}
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  addGroup(value, pickedTimers);
                  setIsDialog(false);
                }}
              >
                {t("Add")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="flex gap-2 justify-between">
          <Input placeholder={t("Sidebar search")} 
          onChange={(e)=>setSearchValue(e.target.value)}/>
          <Button variant="outline" size="icon"
          onClick={()=>setIsDialog(true)}>
            <Plus></Plus>
          </Button>
        </div>
        <ScrollArea className="w-full">
          <div className=" justify-stretch items-stretch
          grid w-full gap-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4  h-full">
          {groups &&
            Object.entries(groups).filter(([, group]) => group.name.toLowerCase().includes(searchValue.toLowerCase()))
            .map(([id, group]) => (
              <Card
                key={id}
                onClick={() => {
                  navigate(`/groups/${id}`);
                }}
                className="cursor-pointer hover:bg-accent transition-colors"
              >
                <CardHeader className="relative">
                  <CardTitle className="max-w-48 truncate">
                    {group.name}
                  </CardTitle>
                  <CardDescription>
                    {group?.timers?.length || 0} {t("timers group")}
                  </CardDescription>
                  <ArrowRight className="absolute bottom-4 right-4" />
                </CardHeader>
              </Card>
            ))}

          <Card className="border-dashed p-6">
            <div className="flex w-full h-full items-center justify-center">
              <Button
                variant="outline"
                className="flex gap-2 items-center"
                onClick={() => setIsDialog(true)}
              >
                <Plus size={24} />
                {t("Create new group")}
              </Button>
            </div>
          </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default GroupsPage