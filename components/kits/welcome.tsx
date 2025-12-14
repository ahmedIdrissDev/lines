'use client'
import { option } from '@/constants/option'
import Image from 'next/image'
import React from 'react'

const Welcome = ({fun}:{fun:(e:string)=> void}) => {
  return (
    <div className='flex justify-center gap-6 h-full flex-col items-center'>
    
   <Image src={'/ai.svg'} width={1000} height={1000} className="w-14 " alt="logo" />

<div className="text-center">
      <h1 className='text-2xl'>Welcome I <span className='w-max px-3 border bg-linear-60 text-transparent bg-clip-text from-tgcc-700 to-tgcc-300 border-neutral-200 rounded-full'> Tgcc Alts </span></h1>
      <p className='opacity-90'>Smart, fast, AI-powered HR assistant — what do you need today?</p>

</div>
      <div className=" grid grid-cols-3 gap-2  overflow-x-scroll   ">
        {option.map(({icon , description ,label})=>(
             <div key={label} onClick={()=> fun(label)} className=" w-full bg-white  cursor-pointer duration-150 hover:border-tgcc-800 min-h-50 border border-neutral-200 p-2 rounded-2xl">
              <div className="flex justify-center items-center h-11 w-11 bg-tgcc-300 rounded-2xl ">
                {icon}
              </div>
              <div className="">
                  <h1 className='text-md md:text-2xl'>{label} </h1>
                  <p className='text-sm opacity-75'> {description} </p>
              </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Welcome
