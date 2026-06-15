'use client'
import Logo from '@/components/ui/logo'
import { options } from '@/constants/option'
import Image from 'next/image'
import React from 'react'

const Welcome = ({fun}:{fun:(e:string)=> void}) => {
  return (
    <div className='flex justify-center gap-2 h-full flex-col items-center'>
    
<Logo/>
<div className="text-center">
      <h1 className='text-2xl'>AI agent-powered platform</h1>
      <p className='opacity-90'>Smart, fast, AI-powered HR assistant — what do you need today?</p>

</div>
      <div className=" grid grid-cols-3 gap-2  overflow-x-scroll   ">
        {options.map(({icon , description ,label})=>(
             <div key={label} onClick={()=> fun(label)} className=" w-full bg-linear-0 from-white via-white via-75% to-primary/20  cursor-pointer duration-150 hover:border-tgcc-800 min-h-50 border border-neutral-200 p-2 rounded-2xl">
              <div className="flex justify-center items-center h-11 w-11 bg-tgcc-300 rounded-2xl ">
                {icon}
              </div>
              <div className="">
                  <h1 className='text-md md:text-xl'>{label} </h1>
                  <p className='text-sm opacity-75'> {description} </p>
              </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Welcome
