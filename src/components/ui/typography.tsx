import { cn } from "@/lib/utils"
export function TypographyH1({children,className}: {children: React.ReactNode,className?:string}) {
    return (
      <h1 className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",className || '')}  >
        {children}
      </h1>
    )
  }

export function TypographyH2({children}: {children: React.ReactNode}) {
return (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
    </h2>
)
}
export function TypographyH3({children,className}: {children: React.ReactNode,className?:string}) {
    return (
      <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight",className || '')}>
            {children}
      </h3>
    )
  }
export function TypographyH4({children}: {children: React.ReactNode}) {
    return (
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {children}
        </h4>
    )
}
export function TypographyP({children}: {children: React.ReactNode}) {
    return (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    )
  }
export function TypographyBlockquote({children}: {children: React.ReactNode}) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    )
}
export function TypographyList({children}: {children: React.ReactNode}) {
    return (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {children}
      </ul>
    )
  }
export function TypographyLead({children}: {children: React.ReactNode}) {
    return (
        <p className="text-xl text-muted-foreground">
         {children}
        </p>
    )
}
export function TypographySmall({children}: {children: React.ReactNode}) {
    return (
      <small className="text-sm font-medium leading-none">{children}</small>
    )
  }
  export function TypographyMuted({children}: {children: React.ReactNode}) {
    return (
      <p className="text-sm text-muted-foreground">{children}</p>
    )
  }
  
  
  
  
  
  
  