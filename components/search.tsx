"use client"
import { SearchIcon, X } from 'lucide-react'
import { AnimatePresence  , motion} from 'motion/react'
import { useState } from 'react';

const Search = () => {
  const [open, setOpen] = useState(false);
      const openclose = ()=> open ? setOpen(false) : setOpen(true)
  return (
    <>
     <button onClick={openclose} className='w-max bg-white px-2   rounded-xl  cursor-pointer   flex  items-center gap-1.5 h-10 border-2 border-neutral-100'>
            <SearchIcon className='opacity-60'/>
            <span className='opacity-70'>Trouver des employés</span>
        </button>
    <AnimatePresence>
        {open && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className=" gap-2 flex h-1/2  flex-col p-4 w-1/2  rounded-md ">
              <div className="w-full flex justify-between items-center px-2 h-12 bg-white border border-neutral-200 rounded-md ">
                <input type="text" className='outline-0 border-0 w-full h-full' autoFocus placeholder='Trouver des employés' />
                <X onClick={openclose} className='scale-75 opacity-70 cursor-pointer'/>
              </div>
             <div className="w-full min-h-60 bg-white border border-neutral-200 rounded-md ">
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>

  )
}

export default Search
