'use client'
import { option } from '@/constants/option'
import React from 'react'

const Welcome = ({fun}:{fun:(e:string)=> void}) => {
  return (
    <div className='flex justify-center gap-6 h-full flex-col items-center'>
     <svg width="39" height="51" viewBox="0 0 39 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12.0298V50.416H15.8061V24.8382H2.99771V18.3756H35.116V24.8382H22.4634V50.416H38.6588V0L0 12.0298Z" fill="url(#paint0_linear_128_9)"/>
<defs>
<linearGradient id="paint0_linear_128_9" x1="19.3294" y1="-4.49519e-07" x2="39" y2="50" gradientUnits="userSpaceOnUse">
<stop stop-color="#461704"/>
<stop offset="1" stop-color="#AC390A"/>
</linearGradient>
</defs>
</svg>

<div className="text-center">
      <h1 className='text-2xl'>Hello and Welcome I <span className='w-max px-3 border bg-linear-60 text-transparent bg-clip-text from-tgcc-700 to-yellow-300 border-neutral-200 rounded-full'> Tgcc ai </span></h1>
      <p className='opacity-90'>Smart, fast, AI-powered HR assistant — what do you need today?</p>

</div>
      <div className="grid grid-cols-3 gap-2">
        {option.map(({icon , description ,label})=>(
             <div onClick={()=> fun(label)} className="w-full cursor-pointer h-50 border border-neutral-200 p-2 rounded-2xl">
              <div className="flex justify-center items-center h-11 w-11 bg-yellow-300 rounded-2xl ">
                {icon}
              </div>
              <div className="">
                  <h1 className='text-2xl'>{label} </h1>
                  <p className='text-sm opacity-75'> {description} </p>
              </div>
             </div>
        ))}
      </div>
    </div>
  )
}

export default Welcome
