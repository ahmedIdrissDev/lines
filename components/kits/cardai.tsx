import React from 'react'
import Hr from '../Hr'
import { fa } from 'zod/v4/locales'

const CardAI = () => {
  return (
    <div className='w-full flex p-2 flex-col gap-3 justify-center h-70 bg-tgcc-50 rounded-2xl'>
        <div className="text-center">
        <h1>Agent TGCC</h1>
        <p className='text-sm'>Assistant alimenté par l’IA, connecté à vos données.</p>
        </div>
        <Hr fullbutton />
    </div>
  )
}

export default CardAI