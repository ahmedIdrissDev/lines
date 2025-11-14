'use client'
import { AnimatePresence , motion } from 'motion/react';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {signOut} from 'next-auth/react'
const UserButton = () => {
    const [open, setOpen] = useState(false);
    const openclose = ()=> open ? setOpen(false) : setOpen(true)
    const {data} = useSession()
    console.log(data?.user?.role)
  return (
    <>
                  <img onClick={openclose}  src={data?.user?.image ?  data.user.image : '/avatar.png'} className='w-10 bg-white h-10 border border-neutral-200 rounded-full cursor-pointer' />
 <AnimatePresence>
        {open && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 p-4 flex justify-center items-center inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className="bg-white flex justify-between h-1/2  flex-col gap-1.5  p-4 w-full md:w-1/2  rounded-md border border-neutral-200">
              <div className="flex flex-col gap-1.5">

              <h1>Paramètres du compte</h1>
                   <div className="flex items-center gap-2">
                  <img  src={data?.user?.image ?  data.user.image : '/avatar.png'} className='w-9 bg-white h-9 rounded-full cursor-pointer' />
                   <h1>{data?.user?.name} </h1>
                   </div>
                   <div className="w-full px-3 border border-neutral-100 bg-neutral-50 rounded-2xl h-6 flex items-center">
                    <span className='opacity-70'>               {data?.user?.email}</span>
                   </div>
                     <div className="w-full px-3 border border-neutral-100 rounded-2xl h-12 flex items-center">
                    <span className='opacity-70'>{data?.user?.role} </span>
                   </div>
                  <button onClick={()=> signOut({redirect:true , callbackUrl:'/'})} className='w-20 h-11 text-red-950 border border-red-400  rounded-md'>logout</button>

              </div>
                   <div className="flex w-full justify-end">
                       <button onClick={openclose} className='w-20 h-11 bg-tgcc-600 text-white rounded-md'>Annuler</button>
                   </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>
  )
}

export default UserButton
