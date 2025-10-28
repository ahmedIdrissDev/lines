'use client'
import { User, UserRoundPlus } from 'lucide-react'
import React, { useState } from 'react'

const Add = () => {
  const [open , setOpen ]  = useState(false)
  const openclose = ()=> open ? setOpen(false) : setOpen(true)
  return (
    <>
            <button onClick={openclose} className='w-30 cursor-pointer rounded-md  flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white'>
            <UserRoundPlus/>
            <span> Employee </span>
        </button>
        {
          open && 
          <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
            <div className="bg-white flex flex-col gap-1.5  p-2 w-1/2 h-1/2 rounded-2xl">
              <h1>Add new </h1>
              <form className='flex flex-col gap-2' action="">
                <input className='input' type="text" placeholder='Code' />
                <input className='input' type="text" placeholder='Full name' />
                <input className='input' type="text" placeholder='function' />
                <input className='input' type="text" placeholder='status' />
            <input list="fruits" id="fruit" className='input' name="fruit" />

<datalist id="fruits">
  <option value="Apple">Ads Acess</option>
  <option value="Apple">Ads Acess</option>
  <option value="Apple">Ads Acess</option>
  <option value="Apple">Ads Acess</option>

</datalist>

              </form>
            </div>
          </div>
        }
    </>

  )
}

export default Add
