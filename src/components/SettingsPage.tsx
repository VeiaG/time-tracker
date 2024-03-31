import { Button } from "./ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { TypographyH1 } from "./ui/typography"
import { useState } from "react"


const SettingsPage = () => {
    const pages = [
        {title: "Акаунт", component: <div>Акаунт</div>},
        {title: "Експорт та імпорт", component: <ExportSettings/>},
        {title: "Вигляд", component: <div>Вигляд</div>},
        {title: "Данні", component: <div>Данні</div>},
    ]
    const [currentPage, setCurrentPage] = useState(0)
  return (
    <div className="grid grid-cols-4 gap-4">
        <div className="col-span-4">
            <TypographyH1>Налаштування</TypographyH1>
        </div>
        <div className="col-span-1">
            <div className="flex flex-col gap-2">
                {pages.map((page,index)=>(
                    <Button className="justify-start" variant={currentPage === index ? "secondary" : "ghost"}
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

const ExportSettings = ()=>{
    return <Card>
        <CardHeader>
            <CardTitle>Експорт та імпорт</CardTitle>
            <CardDescription>
                Тут ви можете зберегти ваші таймери як файл, або відновити їх з існуючого файлу.
            </CardDescription>
        </CardHeader>
    </Card>
}
export default SettingsPage