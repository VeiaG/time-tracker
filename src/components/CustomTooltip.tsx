import { Card,CardDescription,CardHeader } from "./ui/card";
type CustomTooltipProps = {
    active?: boolean;
    payload?: {
      value: number;
    }[];
    label?: string;
  };
import { getNumbersBySeconds } from "@/lib/timeUtils";
const CustomTooltip = ({ active, payload, label } :CustomTooltipProps ) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardHeader>
            <CardDescription>{`${new Date(label || new Date() ).toLocaleDateString()} : ${getNumbersBySeconds(payload[0]?.value)}`} </CardDescription>
          </CardHeader>
        </Card>
      );
    }
  
    return null;
  };
export default CustomTooltip;