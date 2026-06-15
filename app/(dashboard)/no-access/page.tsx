import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className='w-full h-dvh flex justify-center items-center flex-col gap-1'>
       <Image src={'/robot.svg'} width={1000} height={1000} alt='' className='w-50' />
       <h1 className='text-xl'>Accès refusé</h1>
       <p className='text-sm'>Vous n'avez pas l'autorisation d'accéder à cette page.</p>      
    </div>
  )
}

export default page