import { Card,CardDescription,CardHeader } from "./ui/card";
type CustomTooltipProps = {
    active?: boolean;
    payload?: {
      value: number;
    }[];
    label?: string;
  };
const CustomTooltip = ({ active, payload, label } :CustomTooltipProps ) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardHeader>
            <CardDescription>{`${new Date(label || new Date() ).toLocaleDateString()} : ${payload[0]?.value}`} год.</CardDescription>
          </CardHeader>
        </Card>
      );
    }
  
    return null;
  };
export default CustomTooltip;