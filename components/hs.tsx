'use client'
import { store } from '@/store';
import { X } from 'lucide-react';
import { AnimatePresence  , motion} from 'motion/react'
import React, { useState } from 'react'
interface HSProps{
    func:string , 
    hs:number ,
    date:Date
}
const Hs = () => {
     const [open, setOpen] = useState(false);
     const  [hsarray , setHsArray] = useState <HSProp([])
      const openclose = () => (open ? setOpen(false) : setOpen(true));
      const { data } = store();
        const fun = Object.groupBy(data, ({ function: fun }) => fun);
        const funs= Object.keys(fun)
  return (
    <>
    
     <button
        onClick={openclose}
        className="w-50 hidden cursor-pointer rounded-xl  md:flex justify-center items-center gap-1.5 h-10 bg-tgcc-700/5 text-tgcc-950"
      >
        <span> Demande de HS </span>
      </button>
        <AnimatePresence>


      {open && (
        <div className="w-full fixed  p-22 z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
          <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
           className="bg-white flex flex-col gap-1.5  p-2 w-full h-full rounded-md border border-neutral-200">
            <div className="flex justify-between items-center ">
            <h1>Demade HS</h1>
             <X onClick={openclose} className='scale-75 opacity-70 cursor-pointer'/>

            </div>
            <div className="flex justify-center items-center">
                <form className='w-full grid grid-cols-4 gap-2' action="">
                <select name="function"  className="input " id="fruits">
                  {funs.map((fun) => (
                    <option className="text-tgcc-200" key={fun} value={fun}>
                      {fun}
                    </option>
                  ))}
                  <option value="Apple"></option>
                </select>{" "}                    <input type="number" name='function' className='input' placeholder='HS'/>
                    <input type="date" name='date' className='input' />
                    <div className="w-full flex justify-end items-center ">
                    <button className='w-30 h-11 bg-neutral-950 text-white rounded-md cursor-pointer'>Ajouter</button>
                    </div>
                </form>
            </div>
          </motion.div>
        </div>
      )}
   </AnimatePresence>
    </>
  )
}

export default Hs
