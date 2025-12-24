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
   <button onClick={handleNavigation} className={twMerge('w-full border border-neutral-50   relative duration-300 h-11 px-2 flex rounded-md    cursor-pointer items-center justify-start  gap-2' , isActive ? 'opacity-100 shadow-inner border-neutral-100 bg-linear-30 text-tgcc-900  ':" opacity-60 ")}>
        {icon}
       
       <span className=''>
         {label}
       </span>
   </button>
  )
}

export default Button
