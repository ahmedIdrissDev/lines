import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Alert = () => {
  return (
    <div className='flex h-full gap-2 flex-col justify-center items-center'>
        <Image src={'/bg.webp'} className='w-60' width={1000} height={1000} alt='log' />
        <div className="flex items-center flex-col gap-1">
        <p>Fonction bientôt disponible</p>
         <Link className='text-tgcc-500 underline' href={'/dashboard'}>retour au tableau de bord
</Link>
        </div>
    </div>
  )
}

export default Alert