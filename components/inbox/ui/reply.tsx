import Image from 'next/image'
import React from 'react'

const ReplyButton = () => {
  return (
    <button className='w-max px-2 text-tgcc-950 group cursor-pointer rounded-full h-10 flex  justify-center items-center gap-1.5 bg-tgcc-100   border-neutral-200  '>
             <Image src={'/ai.svg'} width={1000} height={1000} alt='logo' className='w-7  opacity-90 group-hover:rotate-90 duration-150' />
             <span> Reply with Geminy</span>
          </button>
  )
}

export default ReplyButton