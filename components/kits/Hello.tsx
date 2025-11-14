'use client'
import { AnimatePresence , motion } from 'motion/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function Hello() {
  const [open, setOpen] = useState(false);
      const openclose = ()=> open ? setOpen(false) : setOpen(true)
    const {data} = useSession()
    useEffect(()=>{
       if(data?.user?.role){
          openclose()
       }
    } , [data])
  return (
    <>
    
    <AnimatePresence>
        {open && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className="  gap-2 flex h-96  bg-white  justify-center flex-col p-4 w-full md:w-80 rounded-md ">
                  <div className="text-center flex justify-center items-center flex-col gap-2">
                    <Image src={'/hand.png'} className='w-20' width={200} height={200} alt='hand'/>
                    <div className="text-center">
                    <h1 className='text-2xl'>Bonjour {data?.user?.name} </h1>
                    <p>bienvenue sur la plateforme RH sécurisée de TGCC.</p>

                    </div>
                  </div>
            
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>
    

    )
}

export default Hello
