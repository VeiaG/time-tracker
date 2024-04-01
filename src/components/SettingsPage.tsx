import localforage from "localforage"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { TypographyH1 } from "./ui/typography"
import { useState } from "react"
import { AlertCircle, Download, DownloadCloud, Loader2, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"


const SettingsPage = () => {
    const pages = [
        {title: "Акаунт", component: <div>Акаунт</div>},
        {title: "Вигляд", component: <div>Вигляд</div>},
        {title: "Данні", component: <DataSettings/>},
    ]
    const [currentPage, setCurrentPage] = useState(0)
  return (
    <div className="grid grid-cols-4 gap-4 pt-4">
        <div className="col-span-4">
            <TypographyH1>Налаштування</TypographyH1>
        </div>
        <div className="col-span-1">
            <div className="flex flex-col gap-2">
                {pages.map((page,index)=>(
                    <Button key={index} className="justify-start" variant={currentPage === index ? "secondary" : "ghost"}
                    onClick={()=>setCurrentPage(index)}>{page.title}</Button>
                ))}
            </div>
        </div>
        <div className="col-span-3">
            {pages[currentPage].component}
        </div>
    </div>
  )
}

const DataSettings = ()=>{
    const [isExporting, setIsExporting] = useState(false)
    const exportLocalForage =async ()=>{
        setIsExporting(true)

        const saveObj = {}
        await localforage.iterate((value, key) =>{
            saveObj[key] = value;
        }).then(()=> {

            console.log(saveObj);
            const blob = new Blob([JSON.stringify(saveObj)], {type: "application/json"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.classList.add("hidden");
            a.href = url;
            a.download = "timers.json";

            //wait 1000ms to download
            setTimeout(()=> {
                a.click();
                URL.revokeObjectURL(url);
            }, 1000);

            //clear

        }).catch((err)=> {
            console.error(err);
            setIsExporting(false);
        });
        setIsExporting(false);
    }
    const [isImporting, setIsImporting] = useState(false)
    const importJSON = async (file: File)=>{
        const reader = new FileReader();
        await localforage.clear();
        reader.onload = async (e) => {
            const content = e.target.result as string;
            const data = JSON.parse(content);
            console.log(data);
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    await localforage.setItem(key, element);
                }
            }
        }
        reader.readAsText(file);
        setIsImporting(true);
        // window.location.reload();
    }
    const importButton = async ()=>{
        const input = document.createElement("input");
        input.type = "file";
        input.id = "file-input";
        input.accept = ".json";
        input.classList.add("hidden");
        input.onchange = (e)=>{
            const file = (e.target as HTMLInputElement).files[0];
            importJSON(file);
        }
        document.body.appendChild(input);
        document.getElementById("file-input").click();

        //clear
        document.body.removeChild(input);

    }
    const deleteData = async ()=>{
        await localforage.clear();
        window.location.reload();
    }
    return <div className="flex flex-col gap-4">
    <Card>
        <AlertDialog open={isImporting} onOpenChange={setIsImporting}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Файл імпортовано</AlertDialogTitle>
                    <AlertDialogDescription>Для продовження перезавантажте сторінку</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter >
                    <AlertDialogAction onClick={()=>{
                        window.location.reload();
                    }}>Перезавантажити</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <CardHeader>
            <CardTitle>Налаштування данних</CardTitle>
            <CardDescription>
                Тут ви можете зберегти ваші таймери як файл, або відновити їх з існуючого файлу.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                <Alert >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Увага</AlertTitle>
                    <AlertDescription>
                        Під час імпорту 
                        <span className="text-red-800 dark:text-red-500"> всі ваші поточні данні будуть видалені!</span><br/>
                        Впевніться в правильності файлу перед імпортом.
                    </AlertDescription>
                </Alert>
                <Button disabled={isExporting} onClick={exportLocalForage} variant="outline">
                    {!isExporting ? <>
                        <DownloadCloud className="mr-2 h-4 w-4" />Експорт 
                    </> : <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Завантаження
                    </>}</Button>
                <Button
                 onClick={importButton} variant="outline">
                    <Download className="mr-2 h-4 w-4" />Імпорт 
                </Button>
                
            </div>
            
        </CardContent>
    </Card>
    <Card>
        <CardHeader>
            <CardTitle>Видалення данних</CardTitle>
            <CardDescription>
                Видалення всіх данних збережених на цьому пристрої.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />Видалити данні 
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Видалити данні</AlertDialogTitle>
                            <AlertDialogDescription>Ви впевнені що хочете видалити усі данні?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel >
                                Скасувати
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={deleteData} >
                                Видалити
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
    </Card>
    </div>
}

export default SettingsPage