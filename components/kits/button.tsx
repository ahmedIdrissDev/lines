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
   <button onClick={handleNavigation} className={twMerge('w-full bg-white  relative duration-300 h-11 px-2 flex rounded-md    cursor-pointer items-center justify-start  gap-2' , isActive ? 'opacity-100 bg-tgcc-50 border-0  ':" opacity-60 ")}>
        {icon}
        {path.startsWith('/workspace') && 
        <div className="absolute top-0 right-0 rounded-full flex justify-center items-center  w-9 h-9">
          <span className='text-sm  text-tgcc-600'> +10</span> </div>
        }
       <span className=''>
         {label}
       </span>
   </button>
  )
}

export default Button
