"use client";
import { DatabaseZap, DockIcon, FileChartLine, FileText } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";

const PDF = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  
  return (
    <>
      <button onClick={openclose} className='w-40 h-11 bg-white border border-neutral-200 rounded-md flex justify-center items-center gap-2'> <FileChartLine/> Export pdf</button>

      <AnimatePresence>


      {open && (
        <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
          <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
           className="bg-white flex justify-center  items-center py-3 flex-col gap-1.5  p-2 w-90 h-50 rounded-md border border-neutral-200">
              <FileText />
              <h1>Générer un PDF</h1>

              <div className="w-full h-12 gap-2 flex justify-center items-center">
                <button
                  onClick={openclose}
                  className="w-30 hidden cursor-pointer rounded-md  md:flex justify-center items-center gap-1.5 h-9 bg-white border border-neutral-200"
                >
                  <span> annuler </span>
                </button>
                <button className="w-30 hidden cursor-pointer rounded-md  md:flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white">
                  <span> continue </span>
                </button>
              </div>
          </motion.div>
        </div>
      )}
            </AnimatePresence>

    </>
  );
};

export default PDF;
