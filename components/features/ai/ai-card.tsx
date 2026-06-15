import React from 'react'
import Hr from './atlas-ai'

const CardAI = () => {
  return (
    <div className='w-full flex p-5 flex-col gap-4 justify-center h-max bg-surface-bone border border-hairline rounded-md'>
        <div className="text-center flex flex-col gap-1">
        <h1 className="font-display text-xl font-bold tracking-tight text-ink">TGCC Atlas</h1>
        <p className='text-xs text-charcoal leading-relaxed'>Assistant alimenté par l’IA, connecté à vos données.</p>
        </div>
        <Hr fullbutton />
    </div>
  )
}

export default CardAI