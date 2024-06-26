import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Link,  } from "react-router-dom"
import { AllGroups, AllTimers } from "@/App"
type BreadcrumbsMenuProps = {
    timers:AllTimers
    groups:AllGroups
}
import { useLocation } from "react-router-dom"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

const BreadcrumbsMenu = ({timers,groups}:BreadcrumbsMenuProps) => {
    const {t} = useTranslation();
    const pages = {
        settings:t("Settings"),
        about:t("About"),
        "privacy-policy":t("privacy"),
        "terms-of-service":t("terms"),
        "groups":t("Groups"),

    }

    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
        <Breadcrumb className="container">
            <BreadcrumbList className="align-center">
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link to="/" className="text-sm">
                            <span>
                                {t("Main")}
                            </span>
                        </Link>
                    </BreadcrumbLink>
                    
                </BreadcrumbItem>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    
                    const pageName = timers[value] ? timers[value].name : 
                    groups[value] ? groups[value].name : pages[value] ||  value;
                    return (
                    <Fragment key={index}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem  key={index}> 
                            <BreadcrumbLink asChild >
                                <Link className="truncate lg:max-w-sm max-w-40"
                                    to={to}>{pageName}</Link>
                            </BreadcrumbLink>
                      </BreadcrumbItem>
                    </Fragment>
                        
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadcrumbsMenu