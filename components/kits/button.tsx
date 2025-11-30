'use client'
import { linksProps } from '@/types'
import {  usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const Button = ({icon , label ,path}:linksProps) => {
    const routeParams = usePathname()
    const route = useRouter()
    const isActive = routeParams.startsWith(path) ? true : false
    const handleNavigation = ()=> route.replace(path)
  return (
   <button onClick={handleNavigation} className={twMerge('w-full h-10 px-1.5 flex rounded-none  border border-neutral-200 cursor-pointer items-center justify-start  gap-2' , isActive ? 'bg-tgcc-50':" opacity-60 ")}>
       {icon}
       <span className=''>

      {label}
       </span>
   </button>
  )
}

export default Button
