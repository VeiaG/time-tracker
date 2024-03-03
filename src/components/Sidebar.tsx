import { useNavigate } from "react-router-dom"
import { AllTimers } from "../App";
import { Divider, Button, ButtonGroup , IconButton } from '@chakra-ui/react'
type SidebarProps = {
    timers: AllTimers,
    deleteTimer: (timerId: string) => void,
    setSelectedTimerID: (timerId: string) => void,
    selectedTimerID: string,
    isPaused: boolean,
    startTimer: () => void,
}
const Sidebar = ({timers,setSelectedTimerID,selectedTimerID}:SidebarProps) => {
    const navigate = useNavigate();

  return (
    <div className="sidebar">
        <i className="fa-solid fa-house" onClick={()=>navigate('./')}></i>
        <Divider/>
        <div className="sidebar__list">
            {timers && Object.entries(timers).map(([id,timer]) => (
               <ButtonGroup isAttached >
                     <Button 
                    colorScheme={id===selectedTimerID ? 'blue' : 'red'} 
                    key={id} onClick={()=>{
                        navigate(`./${id}`);
                        
                    }}>{timer.name}</Button>
                    <IconButton 
                        onClick={() => setSelectedTimerID(id)}
                    aria-label="start" icon={<i className="fa fa-play"></i>}></IconButton>
                </ButtonGroup>
                
                    
                
            ))}
        </div>
    </div>
  )
}

export default Sidebar