"use client";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { useMutation } from "convex/react";
import { Calendar, Mail, Send, SendHorizonal, User, UserRoundPlus, X } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";

const Add = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  // const hendleaddTask = useMutation(api.functions.tasks.createTask)
      
  async function HendleAddEmployes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fromdata = new FormData(e.currentTarget);
     const data = Object.fromEntries(fromdata.entries())
     const task ={
      ...data ,
      dirtask:'',
      userId:''
     }
    //  hendleaddTask(task)
    try {
    } catch (error) {}
  }
  return (
    <>
      <button
        onClick={openclose}
        className="w-11  border-neutral-200 hidden cursor-pointer   md:flex justify-center items-center gap-1. h-10"
      >
        <Mail className="opacity-70"/>
      </button>
      <AnimatePresence>


      {open && (
        <div className="w-full fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0">
          <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
           className="bg-white relative flex flex-col gap-1.5 rounded-xl  p-2 w-1/2 h-max min-h-90  border border-neutral-200">
            <h1>Nouveau message </h1>
            <form onSubmit={HendleAddEmployes} className="flex  h-full flex-col gap-2" action="">
              <input type="text" name="title"  className="input h-11"  placeholder="to:"/>
                <div className="w-full flex flex-col gap-1">
                  <input type="text" name="date_of_start"  className="input"  placeholder="title"/>
                </div>
              

              <textarea name="description" className="input h-60 p-3.5 resize-none" id="" placeholder="Message"></textarea>
              <div className="flex h-12 justify-end items-center">
               <X className="absolute right-1 top-1 opacity-70 size-4" onClick={openclose}/>
                <button type="submit" className="w-30 flex gap-2 justify-center items-center bg-tgcc-600 text-white rounded-full cursor-pointer h-11">
                  <SendHorizonal/>
                  Ajouter
                  </button>
              </div>
            </form>
           
          </motion.div>
        </div>
      )}
            </AnimatePresence>

    </>
  );
};

export default Add;
