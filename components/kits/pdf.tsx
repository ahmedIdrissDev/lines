"use client";
import { DatabaseZap, DockIcon, File, FileChartLine, FileText } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";
import Pdfgenerate from "./pdfbuilder";
import Image from "next/image";

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
           className="bg-white flex justify-center  items-center overflow-y-auto py-3 flex-col gap-1.5  p-2 w-90 h-max rounded-md border border-neutral-200">
            <Image src={'/teamwork.png'} width={1000} height={1000} alt="logo" className="w-60" />
            <h1>Créer un PDF facilement</h1>
            <div className="flex justify-center gap-2.5 items-center">
              <button onClick={openclose} className="w-30 h-10 border border-neutral-200 rounded-md">annuler</button>
              <button className="w-30 h-10 border border-neutral-100 bg-tgcc-700 text-white rounded-md">continue</button>
 
            </div>
          </motion.div>
        </div>
      )}
            </AnimatePresence>

    </>
  );
};

export default PDF;
