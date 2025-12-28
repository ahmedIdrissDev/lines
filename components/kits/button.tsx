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
   <button onClick={handleNavigation} className={twMerge('w-full    relative duration-300 h-9 px-2 flex rounded-none rounded-r-full    cursor-pointer items-center justify-start  gap-2' , isActive ? 'opacity-100  bg-tgcc-50  bg-linear-30 text-tgcc-900  ':" opacity-60 ")}>
        <span className="material-symbols-outlined">
{icon}
</span>
       
       <span className=''>
         {label}
       </span>
   </button>
  )
}

export default Button
