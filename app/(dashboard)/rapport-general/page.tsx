import { Bus, UserRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-2'>
    <div className="flex flex-col gap-1 ">
      <h1 className='text-xl'>  Suivi global des sous-traitants </h1>
      <p className='text-sm '>Gestion centralisée des sous-traitants en temps réel</p>
    </div>
    <div className='grid grid-cols-5 gap-2'>
        <Link href={'/rapport-general/presonnel'} className="w-full flex-col  bg  border border-neutral-200 flex rounded-md justify-center items-center h-70">
            <UserRound/>
            <h1>Gestion Presonnel</h1>
        </Link>
        <Link href={'/rapport-general/transport'} className="w-full flex-col bg border border-neutral-200 flex rounded-md justify-center items-center h-70">
        <Bus/>
            <h1>Gestion Bus</h1>
        </Link>
    </div>
    </div>
  )
}

export default page