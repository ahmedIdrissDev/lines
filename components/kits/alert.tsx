import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Alert = () => {
  return (
    <div className='flex h-full gap-2 flex-col justify-center items-center'>
      <div className="flex items-center justify-center ">
        <div className="w-11 h-11 bg-neutral-200 rounded-full"></div>
        <div className="w-11 h-11 bg-neutral-200 rounded-full"></div>
        <div className="w-11 h-11 bg-neutral-200 rounded-full"></div>
        <div className="w-11 h-11 bg-neutral-200 rounded-full"></div>

      </div>
        <div className="flex items-center flex-col gap-1">
           <h1 className='font-bold'>Create your Team</h1>
           <p className='text-sm '>Build and manage your team in one place</p>
<button
        className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border-t-2 border-tgcc-500  bg-tgcc-600  text-white"
      >
        <span> Create Teams </span>
      </button>        </div>
    </div>
  )
}

export default Alert