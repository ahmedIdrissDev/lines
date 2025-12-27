'use client'

import { useState } from "react";

const Alert = () => {
    const [open, setOpen] = useState(false);
    const openclose = () => (open ? setOpen(false) : setOpen(true));

  return (
    <>
    
    <div className='flex bg-tgcc-50 h-full gap-2 flex-col justify-center items-center'>
      <div className="flex items-center justify-center ">
        <img src={'/teams.png'}  className='w-20 h-20 rounded-full'/>

      </div>
        <div className="flex items-center flex-col gap-1">
           <h1 className='text-2xl'>Create your Team</h1>
           <p className='text-sm '>Build and manage your team in one place</p>
      <button
       onClick={openclose}
        className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border-t-2 border-tgcc-500/10  bg-tgcc-600  text-white"
      >
        <span> new workspace </span>
      </button>        </div>
    </div>
    {open && 
    <div className="inset-0 p-30 fixed flex justify-center items-center w-full h-full bg-neutral-950/10">
    <div className="w-full grid grid-cols-[1fr_100px] h-full bg-white rounded-md">
      <div className="w-full p-3 gap-2 flex flex-col justify-center h-full ">
         <div className="">
            <h1>Create workspace</h1>
            <p>Set Up Your Workspace </p>
         </div>
         <div className="w-full flex flex-col gap-2 ">
          <input type="text" className="input" placeholder="CHU RABAT etc.." />
          <div className="w-full h-80 rounded-xl border border-neutral-200"></div>
         </div>
         <div className="flex items-center gap-1.5">
        <button
       onClick={openclose}
        className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border border-tgcc-500 text-tgcc-950"
      >
        <span> cancel </span>
      </button>  
      <button
        className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border-t-2 border-tgcc-500/10  bg-tgcc-600  text-white"
      >
        <span> create </span>
      </button>  
         </div>
      </div>

    </div>
    </div>
    
    }
    </>
  )
}

export default Alert