import { Card,CardDescription,CardHeader } from "./ui/card";
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card>
          <CardHeader>
            <CardDescription>{`${new Date(label).toLocaleDateString()} : ${payload[0].value}`} год.</CardDescription>
          </CardHeader>
        </Card>
      );
    }
  
    return null;
  };
export default CustomTooltip;