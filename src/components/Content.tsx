import { useAutoAnimate } from "@formkit/auto-animate/react"

const Content = ({children}:{children:React.ReactNode}) => {
  
  return (
    
    <div className="h-full max-h-full grow relative pb-16 sm:pb-4">
        {children}
    </div>
  )
}

export default Content