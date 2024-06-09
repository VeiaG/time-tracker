import { useContext } from "react";
import { Card,CardDescription,CardHeader, CardTitle } from "./ui/card";
type CustomTooltipProps = {
    active?: boolean;
    payload?: {
      value: number;
      dataKey:string;
      fill:string;
    }[];
    label?: string;
  };
import { getNumbersBySeconds } from "@/lib/timeUtils";
import { TimerContext } from "@/contexts/TimerContext";
const CustomTooltip = ({ active, payload, label } :CustomTooltipProps ) => {
    const {timers} = useContext(TimerContext)
    const sum = payload?.reduce((acc, item) => acc + item.value, 0);
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardHeader>

            {
              payload.length === 1 ? (
                <CardDescription>{`${new Date(label || new Date() ).toLocaleDateString()} : ${getNumbersBySeconds(payload[0]?.value)}`} </CardDescription>
              ) :
              (
                <>
                <CardDescription>
                  {`${new Date(label || new Date()).toLocaleDateString() } : ${getNumbersBySeconds(sum)}`}
                </CardDescription>
                  {
                    payload.map((item, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex gap-2 items-center">
                        <div className="w-4 h-4" style={
                          {background:payload[index].fill || "#000"}
                        }></div>
                        {`${timers[item.dataKey]?.name || "error"} : ${getNumbersBySeconds(item?.value)}`}
                      </div>
                    ))
                  }
                </>
              )
            }
          </CardHeader>
        </Card>
      );
    }
  
    return null;
  };
export default CustomTooltip;