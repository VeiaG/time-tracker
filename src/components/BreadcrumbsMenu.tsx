import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Link,  } from "react-router-dom"
type BreadcrumbsMenuProps = {
    secondPage?:{
        name:string,
        url:string
    },
    setSecondPage:(value:{name:string,url:string}|undefined)=>void
}
const BreadcrumbsMenu = ({secondPage,setSecondPage}:BreadcrumbsMenuProps) => {
    
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/" onClick={()=>setSecondPage(undefined)}>Головна</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {secondPage && <>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink asChild >
                        <Link className="truncate max-w-sm" 
                            to={secondPage.url}>{secondPage.name}</Link>
                    </BreadcrumbLink>
                </>}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbsMenu