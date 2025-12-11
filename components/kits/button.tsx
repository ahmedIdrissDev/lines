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
   <button onClick={handleNavigation} className={twMerge('w-full relative duration-300 h-11 px-2 flex rounded-full    cursor-pointer items-center justify-start  gap-2' , isActive ? 'opacity-100  ':" opacity-60 ")}>
        {icon}
        {path.startsWith('/taches') && 
        <div className="absolute top-0 right-0 rounded-full text-white bg-red-500 w-2 h-2"> </div>
        }
       <span className=''>
         {label}
       </span>
   </button>
  )
}

export default Button
