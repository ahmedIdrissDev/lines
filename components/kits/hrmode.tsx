"use client";
import { store } from "@/store";
import { DatabaseZap, User, UserRoundPlus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, { FormEvent, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Employee } from "@/types";
import { baseUrl } from "@/constants";
const Moderh = () => {
  const [open, setOpen] = useState(false);
  const [opentr, setOpentr] = useState(false);
  const [dataupdated , setUpdated]= useState<Employee[]> ([])
  const [text , settext] =useState<string>('')
  const openclose = () => {
    if (open) {
      setOpentr(false);
      setOpen(false);
    } else {
      setOpentr(false);

      setOpen(true);
    }
  };
  const {setdata , data} = store()
  const opens = () => (opentr ? setOpentr(false) : setOpentr(true));
  useEffect(()=>{
     setdata(dataupdated)
  } , [dataupdated])
  async function HendleAddEmployes() {
  
  
      try {
        if(text.length < 2) return false
              
              const update = data.map(item=> text.includes(item.Matricule) ? {...item , status:"inactive"} :  {...item , status:"active"}) as Employee[]
              setUpdated(e=>[...update])
        openclose();
        opens();
    } catch (error) {}
  }
  return (
    <>
      <button
        onClick={openclose}
        className="w-30 hidden cursor-pointer rounded-2xl  md:flex justify-center items-center gap-1.5 h-11  bg-tgcc-500 text-white"
      >
        <span> Manage la présence </span>
      </button>
      <AnimatePresence>
        {open && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className="bg-white h-1/2 flex flex-col gap-1.5  p-4 w-1/2  rounded-md border border-neutral-200">
              <h1>Valide la présence</h1>
              <textarea
                onChange={e=> settext(e.currentTarget.value)}
                className="p-2.5 h-full resize-none rounded-2xl border border-dashed border-neutral-200"
                placeholder="Matricules "
                name=""
                id=""
              ></textarea>
              <div className="w-full h-12 gap-2 flex justify-end items-center">
                <button
                  onClick={openclose}
                  className="w-30 hidden cursor-pointer rounded-md  md:flex justify-center items-center gap-1.5 h-9 bg-white border border-neutral-200"
                >
                  <span> annuler </span>
                </button>
                <button
                  onClick={HendleAddEmployes}
                  className="w-30 hidden cursor-pointer rounded-md  md:flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white"
                >
                  <span> Ajouter </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {opentr && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className="bg-white h-40 flex  justify-center items-center flex-col gap-1.5  p-4 w-1/2  rounded-md border border-neutral-200">
              <DatabaseZap />
              {dataupdated?.length}
              <h1>asynchrone avec votre base de données</h1>

              <div className="w-full h-12 gap-2 flex justify-center items-center">
                <button
                  onClick={opens}
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

export default Moderh;
