import { Link } from "react-router-dom"
import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { getNumbersBySeconds  } from "@/lib/timeUtils";
import { Button } from "./ui/button";
import { Circle, Maximize, Play } from "lucide-react";
const AboutPage = () => {
  const {t} = useTranslation();
  const rndData = [
    { name: "", ms: 4000 },
    { name: "", ms: 2500 },
    { name: "", ms: 1890 },
    { name: "", ms: 580 },
  ]
  return (
    <main className="flex-1">
        <section className="w-full py-6 sm:py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 text-center">
            <div className="space-y-2 text-center">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800 ">
                {t("about1 badge")}
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-wrap	">
              {t("about1 title")}
              </h1>
              <p className="text-wrap	 mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {t("about1 desc")}
              </p>
            </div>
            <div className="mx-auto max-w-sm space-y-2">
            <Button asChild variant="link">
                <Link to="/privacy-policy">
                  {t("privacy")}
                </Link>
              </Button>
              <Button asChild variant="link">
                <Link to="/terms-of-service">
                  {t("terms")}
                </Link>
              </Button>
                
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center gap-4 px-4 md:px-6">
         
          <Card className=" w-full sm:w-1/2 lg:w-1/3 mx-auto relative ">
          <Card  className=" w-fit mx-auto absolute hidden sm:flex sm:-left-24 top-32 z-10 animate-bounce	">
            <CardHeader className='sm:items-center h-full justify-center '>
                <div className="flex gap-2 items-center">
                    <Button variant='outline' size="sm">
                      {
                        <Circle size={16} strokeWidth={3} /> 
                      }
                    </Button>
                    <Button size="icon">
                      <Play size={16} strokeWidth={4} fill="currentColor" /> 
                    </Button>
                    <Button variant='outline' size="sm">
                        <Maximize size={16} strokeWidth={4}/>
                    </Button>
                </div>
            </CardHeader>
            </Card>
            <Card className=" w-64 mx-auto absolute right-4 sm:-right-32 bottom-8 z-10 	">
              <CardHeader className="animate-pulse">
                <CardTitle>
                  {getNumbersBySeconds(250034)}
                </CardTitle>
                <CardDescription>{t("Dashboard timeElapsed")}</CardDescription>
              </CardHeader>
            </Card>
            <CardHeader>
              <CardDescription>{t("Dashboard activity")}</CardDescription>
            </CardHeader>
            <CardContent >
              <ResponsiveContainer width="100%" height={256}>
                <AreaChart
                  width={400}
                  height={300}
                  data={rndData}
                  margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <Area
                    animationDuration={200} 
                    type="monotone"
                    dataKey="ms"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
            <div className="space-y-4 text-center">
              <div className="space-y-2 inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              {t("about2 badge")}
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              {t("about2 title")}
                </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {t("about2 desc")}
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container grid items-center gap-6 px-4 md:px-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              {t("about3 title")}
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {t("about3 desc")}
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild >
                <Link to="/">
                {t("get started")}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
  )
}

export default AboutPage