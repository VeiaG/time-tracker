import localforage from "localforage"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { TypographyH1 } from "./ui/typography"
import { useContext, useMemo, useState } from "react"
import { AlertCircle, Download, DownloadCloud, Loader2, Trash, Trash2 } from "lucide-react"
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
import { googleLogout } from '@react-oauth/google';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog"
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleContext } from "@/contexts/GoogleContext"
import { useTranslation } from "react-i18next"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {Label} from "@/components/ui/label"
import { TimerContext } from "@/contexts/TimerContext"
import { useTheme } from "./themeProvider";
const AppearanceSettings = ()=>{
    const {t} = useTranslation();
    const {lang,setLang} = useContext(TimerContext);
    const languages = useMemo(()=>[
        {value:"en",label:"English"},
        {value:"uk",label:"Українська"}
    ],[]);
    const {theme,setTheme} = useTheme();
    const themes = useMemo(()=>[
        {value:"light",label:t("Light")},
        {value:"dark",label:t("Dark")},
        {value:"system",label:t("System")}
    ],[t]);

    return <div className="grid grid-cols-1 gap-4">
        <Card>
            <CardHeader>
                <CardTitle>{t("appearance title")}</CardTitle>
                <CardDescription>
                    {t("appearance desc")}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
                <Label>{t("lang")} :</Label>
                <Select value={lang} onValueChange={setLang}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Оберіть значення" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            languages.map((lang)=>(
                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center space-x-2">
                <Label>{t("Theme")} :</Label>
                <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Оберіть значення" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            themes.map((theme)=>(
                                <SelectItem key={theme.value} value={theme.value}>{theme.label}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
            </CardContent>
        </Card>
    </div>
}
const DataSettings = ()=>{
    const {
        syncWithGoogleDrive
    } = useContext(GoogleContext);
    const [isExporting, setIsExporting] = useState(false)
    const {t} = useTranslation();
    const exportLocalForage =async ()=>{
        setIsExporting(true)

        const saveObj = {}
        await localforage.iterate((value, key) =>{
            saveObj[key] = value;
        }).then(()=> {

            // console.log(saveObj);
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
            // console.log(data);
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const element = data[key];
                    await localforage.setItem(key, element);
                }
            }
        }
        reader.readAsText(file);
        await syncWithGoogleDrive(true);
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
                    <AlertDialogTitle>{t("import title")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("import desc")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter >
                    <AlertDialogAction onClick={()=>{
                        window.location.reload();
                    }}>{t("Reload")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        <CardHeader>
            <CardTitle>{t("data title")}</CardTitle>
            <CardDescription>
                {t("data desc")}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                <Alert >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("Alert")}</AlertTitle>
                    <AlertDescription>
                        {t("alert desc1")}
                        <span className="text-red-800 dark:text-red-500">  {t("alert desc2")}</span><br/>
                        {t("alert desc3")}
                    </AlertDescription>
                </Alert>
                <Button disabled={isExporting} onClick={exportLocalForage} variant="outline">
                    {!isExporting ? <>
                        <DownloadCloud className="mr-2 h-4 w-4" />{t("Export")} 
                    </> : <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t("Loading")}
                    </>}</Button>
                <Button
                 onClick={importButton} variant="outline">
                    <Download className="mr-2 h-4 w-4" />{t("Import")} 
                </Button>
                
            </div>
            
        </CardContent>
    </Card>
    <Card>
        <CardHeader>
            <CardTitle>{t("delete title")}</CardTitle>
            <CardDescription>
                {t("delete desc")}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> {t("delete all")}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("delete all")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("delete modal")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel >
                                {t("Cancel")}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={deleteData} >
                                {t("Delete")}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </CardContent>
    </Card>
    </div>
}
const AccountSettings = ()=>{
    const {
        setUserTokens,
        userTokens,
        setRefreshToken,
        userData,
        refreshAceessToken,
        userFiles,
        deleteFile,
        syncPeriod,
        setSyncPeriod
    } = useContext(GoogleContext);
    const {t} = useTranslation();
    
  
    const googleLogin = useGoogleLogin({
      onSuccess: async ({ code }) => {
          const response = await fetch('https://server.time-tracker.veiag.dev/auth/google', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ code })
          });
        const tokens = await response.json();
        setRefreshToken(tokens?.refresh_token);

        //delete acess token from tokens
        delete tokens.refresh_token;
        // console.log('SET Tokens',tokens);
        setUserTokens(tokens);
      },
      scope:"https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.profile",
      flow: 'auth-code',
    });
    const deleteAllData = async ()=>{
         const mainFile = userFiles.files?.find((file)=>file.name === "timers.json");
         if(mainFile){
            await deleteFile(mainFile.id);
            //exit from account
            googleLogout();
            await setUserTokens(undefined);
            await setRefreshToken(undefined);
            window.location.reload();
         }
    }
    return <div className="grid gap-4 grid-cols-1 ">
        
        <Card>
            <CardHeader>
                <CardTitle>{userData?.name ? t("signed in",{value:userData?.name}) : t("not signed in")}</CardTitle>
                <CardDescription>{t("sync with g")}</CardDescription>
            </CardHeader>
            <CardContent>
                {
                    !userTokens ?
                    <Button onClick={googleLogin} variant="outline">{t("Sign in with Google")}</Button> :
                    <Button onClick={async ()=>{
                        googleLogout();
                        await setUserTokens(undefined);
                        await setRefreshToken(undefined);
                        window.location.reload();
                    }} variant="destructive" >
                        {t("Sign out")}
                    </Button>
                }
                
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t("sync settings title")}</CardTitle>
                <CardDescription>{t("sync settings desc")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 items-start">
            <div className="flex items-center space-x-2">
                <Label>{t("sync every")} :</Label>
                <Select value={syncPeriod.toString()} onValueChange={(value)=>setSyncPeriod(+value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Оберіть значення" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">2 {t("Time minute")}</SelectItem>
                        <SelectItem value="5">5 {t("Time minute")}</SelectItem>
                        <SelectItem value="10">10 {t("Time minute")}</SelectItem>
                        <SelectItem value="15">15 {t("Time minute")}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={!userTokens}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("sync delete")}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("delete all")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("delete modal2")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel >
                                {t("Cancel")}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={deleteAllData} >
                                {t("Delete")}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            
            </CardContent>
        </Card>
        {/* <Card>
            <CardHeader>
                <CardTitle>Додаткова інформація</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <span>
                    ExpiryDate: {new Date(userTokens?.expiry_date).toLocaleString()}
                    </span>
                    <Button variant="destructive" onClick={()=>{
                        const oldTokens = {...userTokens};
                        oldTokens.access_token = 'asdfkjasdfljksjkadlflkj';
                        setUserTokens(oldTokens);
                    }}>
                        <Trash className="mr-2 h-4 w-4"/>Видалити acess токен
                    </Button>
                    <Button onClick={()=>refreshAceessToken()}
                    >
                        <DownloadCloud className="mr-2 h-4 w-4" />Оновити токен
                    </Button>
                </div>
            </CardContent>
        </Card>
        <Card >
            <CardHeader>
                <CardTitle>Дев інформація</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-2">
                {
                  userFiles.files?.map((file:FileInfo) => (
                    <Card key={file.id}>
                      <CardHeader>
                        <CardTitle>
                          {file.name}
                        </CardTitle>
                        <CardDescription className="break-all">
                          {file.id}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex gap-2 flex-wrap">

                        <Button size="icon" variant="destructive"
                          onClick={()=>{
                            deleteFile(file.id);
                          }}>
                          <Trash/>
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                }
                
            </CardContent>
        </Card> */}
        
        
    </div>
}
const pages = [
    {title: "Account", component: <AccountSettings/>},
    {title: "Appearance", component: <AppearanceSettings/>},
    {title: "Data", component: <DataSettings/>},
];
const SettingsPage = () => {
    const {t} = useTranslation();
    const [currentPage, setCurrentPage] = useState(0);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 container">
        <div className="sm:col-span-4">
            <TypographyH1>{t("Settings")}</TypographyH1>
        </div>
        <div className="col-span-1">
            <div className="flex sm:flex-col gap-2">
                {pages.map((page,index)=>(
                    <Button key={index} className="justify-start" variant={currentPage === index ? "secondary" : "ghost"}
                    onClick={()=>setCurrentPage(index)}>{t(page.title)}</Button>
                ))}
            </div>
        </div>
        <div className="sm:col-span-3">
            {pages[currentPage].component}
        </div>
    </div>
  )
}



export default SettingsPage