'use client'
import { AnimatePresence , motion } from 'motion/react';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {signOut} from 'next-auth/react'
import { LogOut, X } from 'lucide-react';
const UserButton = () => {
    const [open, setOpen] = useState(false);
    const openclose = ()=> open ? setOpen(false) : setOpen(true)
    const {data} = useSession()
  return (
    <>
      <img onClick={openclose}  src={data?.user?.image?.trim() ?  data.user.image : '/avatar.png'} className='w-9 bg-white h-9 rounded-full cursor-pointer' />
 <AnimatePresence>
        {open && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 p-4 flex justify-end items-start  inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className="bg-linear-60 from-white to-90% to-tgcc-50 relative flex justify-between h-1/2  flex-col gap-1.5  p-4 w-full md:w-80 mt-12  rounded-none border border-neutral-200">
              <div className="flex flex-col gap-1.5">

              <h1 className='font-semibold'>Paramètres du compte</h1>
                   <div className="flex items-center gap-2">
                  <img  src={data?.user?.image?.trim() ?  data.user.image : '/avatar.png'} className='w-9 bg-white h-9 rounded-full cursor-pointer' />
                   <h1>{data?.user?.name} </h1>
                   </div>
                   <div className="w-full px-3 border border-neutral-100 bg-neutral-50 rounded-2xl h-6 flex items-center">
                    <span className='opacity-70'>               {data?.user?.email}</span>
                   </div>
                     <div className="w-full px-3 border border-neutral-100 rounded-2xl h-12 flex items-center">
                    <span className='opacity-70'>{data?.user?.role} </span>
                   </div>
                  <button onClick={()=> signOut({redirect:true , callbackUrl:'/'})} className='w-full flex items-center cursor-pointer justify-start px-3 gap-2 border border-neutral-200 h-11 text-red-950 bg-tgcc-50  rounded-none'>
                    <LogOut/>
                    <span>logout</span>
                  </button>

              </div>
                   <X onClick={openclose}  className='absolute size-4 right-2 top-2 opacity-70 cursor-pointer'/>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>
  )
}

export default UserButton
