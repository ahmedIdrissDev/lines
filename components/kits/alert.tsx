"use client";

import { AnimatePresence , motion } from "motion/react";
import { useState } from "react";

const Alert = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));

  return (
    <>
      <div className="flex  h-full gap-2 flex-col justify-center items-center">
        <div className="flex items-center justify-center ">
          <span className="material-symbols-outlined text-tgcc-500 scale-200">crowdsource</span>
        </div>
        <div className="flex items-center flex-col gap-2">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-2xl">Create your Team</h1>
            <p className="text-sm ">Build and manage your team in one place</p>
          </div>
            <button
             onClick={openclose}
             className="w-50 hidden  group cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border-t-2 border-tgcc-500  bg-tgcc-600  text-white"
             >
            <span className="material-symbols-outlined group-hover:-translate-x-2 duration-150">
              bookmark_manager
            </span>
            <span> new workspace </span>
          </button>{" "}
        </div>
      </div>
      <AnimatePresence>


      {open && (
        <div className="inset-0  fixed flex justify-center items-center w-full h-full bg-neutral-950/20">
          <motion.div 
           initial={{opacity:0 , translateY:0}}
           animate={{opacity:1 , translateY:2}}
           exit={{opacity:0 , translateY:0}}

          className="w-1/2  min-h-96 bg-white rounded-md">
            <div className="w-full p-3 gap-2 flex flex-col justify-center h-full ">
              <div className="">
                <h1>Create workspace</h1>
              </div>
              <div className="w-full flex flex-col gap-2 ">
                <input
                  type="text"
                  className="input"
                  placeholder="CHU RABAT etc.."
                />
                <div className="w-full p-1.5 h-80 rounded-xl border border-neutral-200">
                   
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={openclose}
                  className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11 border border-neutral-200 text-neutral-600"
                >
                  <span> cancel </span>
                </button>
                <button className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11  border-t-2 border-tgcc-500    bg-tgcc-600  text-white">
                  <span className="material-symbols-outlined">
create_new_folder
</span>
                  <span> Create </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
            </AnimatePresence>

    </>
  );
};

export default Alert;
