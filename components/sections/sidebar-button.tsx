'use client'
import {  usePathname, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { ReactNode } from 'react'

type SidebarButtonProps = {
    icon: ReactNode
    label: string
    path: string
    moduleCode: string
}

const Button = ({icon , label ,path, moduleCode}: SidebarButtonProps) => {
    const routeParams = usePathname()
    const route = useRouter()
    const isActive = routeParams.startsWith(path) ? true : false
    const handleNavigation = ()=> route.push(path)

  return (
   <button 
    onClick={handleNavigation} 
    className={twMerge(
        'group w-full relative duration-200 min-h-16 px-3 py-2 flex rounded-md cursor-pointer items-center justify-start gap-3 border text-left', 
        isActive 
            ? 'border-primary bg-primary text-on-primary' 
            : "border-hairline bg-surface-card text-charcoal hover:border-hairline-strong hover:bg-canvas hover:text-ink"
    )}
   >
        <span
            className={twMerge(
                "absolute left-0 top-2 h-[calc(100%-16px)] w-1 rounded-r-full",
                isActive ? "bg-on-primary" : "bg-transparent group-hover:bg-primary"
            )}
            aria-hidden="true"
        />
        <div
            className={twMerge(
                "flex size-10 shrink-0 items-center justify-center rounded-md border caption-tight",
                isActive
                    ? "border-divider-dark bg-on-primary text-primary"
                    : "border-hairline bg-surface-bone text-primary"
            )}
        >
            <span className="sr-only">{label}</span>
            {icon}
        </div>
        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
                <span
                    className={twMerge(
                        "rounded-sm border px-1.5 py-0.5 code-sm",
                        isActive
                            ? "border-divider-dark text-on-primary"
                            : "border-hairline text-ash"
                    )}
                >
                    {moduleCode}
                </span>
                <span className={twMerge("caption", isActive ? "text-on-dark-mute" : "text-ash")}>
                    Module
                </span>
            </div>
            <span className='mt-1 block truncate button-sm'>
                {label}
            </span>
        </div>
      
   </button>
  )
}

export default Button
