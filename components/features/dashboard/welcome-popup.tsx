'use client'
import { AnimatePresence , motion } from 'motion/react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

function Hello() {
  const [open, setOpen] = useState(false);
  const openclose = ()=> setOpen(!open)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      setOpen(true)
    }
  }, [isLoaded, user])

  return (
    <>
      <AnimatePresence>
        {open && (
          <div
            className="w-full p-5 fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }} 
              className="gap-2 flex h-96 bg-white justify-center flex-col p-4 w-full md:w-96 rounded-md shadow-lg"
            >
              <div className="text-center flex justify-center items-center flex-col gap-2">
                <Image src={'/hand.png'} className='w-20' width={200} height={200} alt='hand'/>
                <div className="text-center">
                  <h1 className='text-2xl'>Bonjour {user?.firstName || user?.username}</h1>
                  <p className="text-sm text-ash">bienvenue sur la plateforme RH sécurisée de TGCC.</p>
                </div>
                <button onClick={openclose} className='w-32 h-11 bg-primary text-white rounded-full cursor-pointer hover:bg-primary-deep transition-colors mt-4'>
                  Merci
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Hello
