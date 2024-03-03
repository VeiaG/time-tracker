import { useNavigate } from "react-router-dom"
import { AllTimers } from "../App";
import { Divider, Button, ButtonGroup , IconButton } from '@chakra-ui/react'
type SidebarProps = {
    timers: AllTimers,
    selectedTimerID: string,
}
const Sidebar = ({timers,selectedTimerID}:SidebarProps) => {
    const navigate = useNavigate();
    console.log(selectedTimerID);
  return (
    <div className="sidebar">
        <i className="fa-solid fa-house" onClick={()=>navigate('./')}></i>
        <Divider/>
        <div className="sidebar__list">
            {timers && Object.entries(timers).map(([id,timer]) => (
               <Button 
               colorScheme={id===selectedTimerID ? 'blue' : 'red'} 
               key={id} onClick={()=>{
                   navigate(`./${id}`);
               }}>{timer.name}</Button>
            ))}
        </div>
    </div>
  )
}

export default Sidebar