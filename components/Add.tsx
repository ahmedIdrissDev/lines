import { User, UserRoundPlus } from 'lucide-react'
import React from 'react'

const Add = () => {
  return (
    <>
            <button className='w-30 cursor-pointer rounded-md  flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white'>
            <UserRoundPlus/>
            <span> Employee </span>
        </button>
    </>

  )
}

export default Add
