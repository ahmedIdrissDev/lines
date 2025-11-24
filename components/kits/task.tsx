'use client'
import { Calendar } from 'lucide-react'
import { AnimatePresence  , motion} from 'motion/react';
import React, { useState } from 'react'

const Task = () => {
    const [open, setOpen] = useState(false);
      const openclose = () => (open ? setOpen(false) : setOpen(true));
  return (
    <>
    
    
    
          <div onClick={openclose} className="w-full cursor-pointer hover:border-tgcc-700 p-2 flex flex-col justify-between  h-70 rounded-2xl bg-white border border-neutral-200/80">
           <div className="h-12  flex items-center gap-2 ">
              <span className='w-max px-2 text-sm rounded-full bg-tgcc-400/25 text-tgcc-950'>Active  </span>
              <span className='w-max px-2 text-sm rounded-full bg-tgcc-400/30 text-tgcc-950'>CHU RABAT  </span>

           </div>
           <div className="h-max flex flex-col gap-2  w-full">
            <div className="">
              <h1>A2</h1>
              <p className='text-sm'>this  a nice desiption of this task</p>

            </div>
              <div className="grid gap-2 grid-cols-2">
                <div className="flex px-2 opacity-80 rounded-2xl gap-2 justify-center items-center h-11 w-full border">
                    <Calendar/>
                    <span className='text-sm'>22/01/2025</span>
                </div>
                    <div className="flex px-2 opacity-80 rounded-2xl gap-2 justify-center items-center h-11 w-full border border-tgcc-700">
                                            <Calendar/>

                    <span className='text-sm'>02/01/2026</span>
                </div>
              </div>
           </div>

          </div>
          <AnimatePresence>
          
          
                {open && (
                  <div className="w-full pt-12 fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
                    <motion.div 
                    initial={{  opacity: 0 , translateY:22  }}
                      animate={{ opacity: 1 , translateY:0 }}
                      exit={{  opacity: 0 , translateY:22 }}
                     className="bg-white  flex flex-col gap-1.5  p-2 w-full h-full min-h-90 rounded-md border border-neutral-200">
                      <h1>Ajouter une tâche au projet </h1>
                    
                     
                    </motion.div>
                  </div>
                )}
                      </AnimatePresence>
          
         </>


  )
}

export default Task
