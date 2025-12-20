import React from 'react'
import Hr from '../Hr'
import { fa } from 'zod/v4/locales'

const CardAI = () => {
  return (
    <div className='w-full flex p-2 py-2.5 flex-col gap-3 justify-center h-max bg-neutral-200 text-neutral-900 rounded-2xl'>
        <div className="text-center">
        <h1> TGCC Atlas</h1>
        <p className='text-sm'>Assistant alimenté par l’IA, connecté à vos données.</p>
        </div>
        <Hr fullbutton />
    </div>
  )
}

export default CardAI