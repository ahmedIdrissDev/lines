'use client'
import { linksProps } from '@/types'
import {  usePathname, useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

const Button = ({icon , label ,path}:linksProps) => {
    const routeParams = usePathname()
    const route = useRouter()
    const isActive = routeParams.startsWith(path) ? true : false
    const handleNavigation = ()=> route.push(path)

  return (
   <button onClick={handleNavigation} className={twMerge('w-full   relative duration-300 h-11 px-2 flex rounded-xl    cursor-pointer items-center justify-start  gap-2' , isActive ? 'opacity-100 bg-linear-30 text-tgcc-900 border-0  ':" opacity-60 ")}>
        {icon}
       
       <span className=''>
         {label}
       </span>
   </button>
  )
}

export default Button
