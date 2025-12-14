'use client'
import { FolderGit2, FolderOpenDot, X } from 'lucide-react';
import React, { FormEvent, useState } from 'react'
import { AnimatePresence , motion } from 'motion/react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Toaster, toast } from 'sonner'

interface fromProps {
    name:string , 
    type:string
}
const Projectcard = () => {
    const [open, setOpen] = useState(false);
      const openclose = () => (open ? setOpen(false) : setOpen(true));
      const setPoject = useMutation(api.functions.project.SetProject)
      // handle project submition 

      const handleProjectSubmition=(e:FormEvent<HTMLFormElement>)=>{
            e.preventDefault()
            try {
                const fromdata = new FormData(e.currentTarget)
                const data:fromProps = Object.fromEntries(fromdata.entries() ) 
                if(data){
                    // setPoject(data)
                    toast.success('You are done')
                    openclose()
                }
                
            } catch (error) {
                console.log(error)
            }
      }
  return (
    <>
      <div onClick={openclose}
                          className="text-sm cursor-pointer  w-full border border-dashed h-60 flex justify-center items-center rounded-2xl p-2 border-neutral-200"
                        
                        >
                          <span> Ajouter un projet 
</span>
                        </div>
      <AnimatePresence>
        {open && (
          <div onClick={openclose} className="w-full cursor-pointer fixed z-20 bg-neutral-900/50 p-4 flex justify-center items-center  inset-0">
            <motion.form
             onSubmit={handleProjectSubmition}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={(e)=>e.stopPropagation()}
              className="bg-linear-60 cursor-auto from-white to-90% to-tgcc-50 relative flex justify-between h-max  flex-col gap-1.5  p-4 w-full md:w-[500px]  rounded-xl border border-neutral-200"
            >
                    <input type="text" name='name' className="input" placeholder='Project ' />
                    <select className='input' name="type" id="">
                        <option value="Tgcc">Tgcc</option>
                        <option value="Sous-traitants">Sous-traitants</option>
                    </select>
                    <button onClick={openclose} className='w-full flex justify-center items-center gap-1.5 cursor-pointer h-11 bg-linear-90 from-tgcc-400 rounded-2xl to-tgcc-600 text-white'>
        <span>
         Create the project
        </span>
    </button>

              <X
                onClick={openclose}
                className="absolute size-4 right-2 top-2 opacity-70 cursor-pointer"
              />
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    {

    }
    </>
  )
}

export default Projectcard