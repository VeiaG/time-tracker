import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Link,  } from "react-router-dom"
import { AllTimers } from "@/App"
type BreadcrumbsMenuProps = {
    timers:AllTimers
}
import { useLocation } from "react-router-dom"
import { Fragment } from "react"
const BreadcrumbsMenu = ({timers}:BreadcrumbsMenuProps) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/">Головна</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const pageName = timers[value] ? timers[value].name : value;
                    return (
                    <Fragment key={index}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem  key={index}> 
                            <BreadcrumbLink asChild >
                                <Link className="truncate max-w-sm"
                                    to={to}>{pageName}</Link>
                            </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Fragment>
                        
                    )
                })}

                {/* {secondPage && <>
                    <BreadcrumbSeparator />
                    <BreadcrumbLink asChild >
                        <Link className="truncate max-w-sm" 
                            to={secondPage.url}>{secondPage.name}</Link>
                    </BreadcrumbLink>
                </>} */}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbsMenu