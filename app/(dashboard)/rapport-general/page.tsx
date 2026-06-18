import { Bus, UserRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-4'>
    <div className="flex flex-col gap-0.5 ">
      <h1 className='text-xl'>  Suivi global des sous-traitants </h1>
      <p className='text-sm '>Gestion centralisée des sous-traitants en temps réel</p>
    </div>
    <div className='grid grid-cols-4 gap-2'>
        <Link href={'/rapport-general/presonnel'} className="w-full flex-col gap-1.5 border-t-[10px]  bg-white hover:border-primary duration-150 border border-neutral-200 flex rounded-md justify-center items-center h-70">
           <div className="w-11 h-11 bg-pink-700 text-white rounded-full flex justify-center items-center">
            <UserRound className='bg bg-clip-text'/>
           </div>
            <h1>Gestion Presonnel</h1>
        </Link>
      <Link href={'/rapport-general/transport'} className="w-full flex-col gap-1.5 border-t-[10px]  bg-white hover:border-primary duration-150  border border-neutral-200 flex rounded-md justify-center items-center h-70">
           <div className="w-11 h-11 bg-pink-700 text-white rounded-full flex justify-center items-center">
            <Bus className='bg bg-clip-text'/>
           </div>
            <h1>Gestion du Bus</h1>
        </Link>
    </div>
    </div>
  )
}

export default page