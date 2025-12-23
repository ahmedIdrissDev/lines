"use client";
import { DatabaseZap, User, UserRoundPlus } from "lucide-react";
import { AnimatePresence } from "motion/react";
import React, { FormEvent, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Employee } from "@/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { handlePrents } from "@/utils";
import { store } from "@/store";
import { Id } from "@/convex/_generated/dataModel";
import { Toaster, toast } from 'sonner'

const Moderh = () => {
  const {PojectID} = store()
  const [open, setOpen] = useState(false);
  const [opentr, setOpentr] = useState(false);
  
  const [dataupdated , setUpdated]= useState<Employee[]> ([])
  const [text , settext] =useState<string>('')
  
  const data = useQuery(api.functions.employees.employees  , PojectID?  {Project:PojectID as Id<"Project">}:"skip" )
  const setPresnt = useMutation(api.functions.present.SetPresents)
  
  const openclose = () => {
    if (open) {
      setOpentr(false);
      setOpen(false);
    } else {
      setOpentr(false);
      setOpen(true);
    }
  };
  const {setdata } = store()
  const opens = () => (opentr ? setOpentr(false) : setOpentr(true));
  
  useEffect(()=>{
     setdata(dataupdated)
  } , [dataupdated])
  
  async function HendleAddEmployes() {
      try {
        toast.error('La validation du pointage n’a pas été effectuée.')

        if(text.length < 2) return false
              const result = handlePrents({text , data})
              const Project =PojectID as Id<"Project">
              setPresnt({...result , Project:Project})
              toast.success('La validation du pointage est terminée')
             openclose();
    } catch (error) {
     console.log(error)
    }
  }
  return (
    <>
    <Toaster richColors position="top-center"/>
      <button
        onClick={openclose}
        className="w-50 hidden cursor-pointer rounded-md md:flex justify-center items-center gap-1.5 h-11  bg-tgcc-500 text-white"
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
            exit={{ scale: 0.7, opacity: 0 }} className="bg-white h-1/2 flex flex-col gap-1.5  p-4 w-1/2  rounded-xl border border-neutral-200">
              <h1>Valide la présence</h1>
              <textarea
                onChange={e=> settext(e.currentTarget.value)}
                className="p-2.5 h-full outline-0 focus: resize-none rounded-xl border border-dashed border-neutral-200"
                placeholder="Matricules "
                name=""
                id=""
              ></textarea>
              <div className="w-full h-12 gap-2 flex justify-end items-center">
                <button
                  onClick={openclose}
                  className="w-30 hidden cursor-pointer rounded-xl  md:flex justify-center items-center gap-1.5 h-9 bg-white border border-neutral-200"
                >
                  <span> annuler </span>
                </button>
                <button
                  onClick={HendleAddEmployes}
                  className="w-30 hidden cursor-pointer rounded-xl  md:flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white"
                >
                  <span> Ajouter </span>
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
