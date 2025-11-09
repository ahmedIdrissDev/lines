"use client"
import { SearchIcon } from 'lucide-react'
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
            exit={{ scale: 0.7, opacity: 0 }} className="bg-white flex justify-between h-1/2  flex-col gap-1.5  p-4 w-1/2  rounded-md border border-neutral-200">
             hh
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>

  )
}

export default Search
