import React from 'react'

const CardAI = () => {
  return (
    <div className='w-full flex flex-col gap-1 justify-center h-40 bg-tgcc-50 rounded-2xl'>
        <h1>Agent TGCC</h1>
        <p className='text-sm'>Assistant alimenté par l’IA, connecté à vos données.</p>
        <button className='w-full h-11 bg-linear-90 from-tgcc-400 rounded-2xl to-tgcc-500 text-white'>
            Get started
        </button>
    </div>
  )
}

export default CardAI