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
   <button onClick={handleNavigation} className={twMerge('w-full duration-100 h-11 px-1.5 flex rounded-md    cursor-pointer items-center justify-start  gap-2' , isActive ? 'bg-linear-30 from-neutral-100 to-tgcc-100  ':" opacity-60 ")}>
        {icon}
       <span className=''>
         {label}
       </span>
   </button>
  )
}

export default Button
