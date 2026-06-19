'use client'
import { linksProps } from '@/types'
import {  usePathname, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { motion } from 'motion/react'

const Button = ({icon , label ,path}:linksProps) => {
    const routeParams = usePathname()
    const route = useRouter()
    const isActive = routeParams.startsWith(path) ? true : false
    const handleNavigation = ()=> route.push(path)

  return (
   <button 
    onClick={handleNavigation} 
    className={twMerge(
        'w-full relative duration-200 h-11 px-4 flex rounded-md cursor-pointer items-center justify-start gap-3 ', 
        isActive 
            ? 'bg-primary  text-white shadow-lg shadow-primary/20' 
            : "text-charcoal  hover:bg-canvas hover:text-ink"
    )}
   >
        <div className="flex items-center justify-center size-5">
            {icon}
        </div>
       <span className='button-sm'>
         {label}
       </span>
      
   </button>
  )
}

export default Button
