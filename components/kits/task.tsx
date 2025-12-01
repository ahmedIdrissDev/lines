'use client'
import { Calendar } from 'lucide-react'
import { AnimatePresence  , motion} from 'motion/react';
import React, { useState } from 'react'

const Task = () => {
    const [open, setOpen] = useState(false);
      const openclose = () => (open ? setOpen(false) : setOpen(true));
  return (
    <>
    
    
    
          <div onClick={openclose} className="w-full cursor-pointer hover:border-tgcc-700 p-2 flex flex-col justify-between  h-11 rounded-none bg-white border border-neutral-200/80">
            <h1>DEMONDE DE HS </h1>
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
