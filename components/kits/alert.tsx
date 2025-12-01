import Image from 'next/image'
import React from 'react'

const Alert = () => {
  return (
    <div className='flex h-full gap-1.5 flex-col justify-center items-center'>
        <Image src={'/tgcc.svg'} className='w-60' width={1000} height={1000} alt='log' />
        <p>Fonction bientôt disponible</p>
    </div>
  )
}

export default Alert