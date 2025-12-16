"use client";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { useMutation } from "convex/react";
import { Calendar, Mail, Pen, Send, SendHorizonal, SquarePen, User, UserRoundPlus, X } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";
import { fa } from "zod/v4/locales";

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
        className="w-full  gap-2.5     hidden cursor-pointer   md:flex justify-center items-center gap-1. h-10 bg-neutral-900 text-white rounded-xl"
      >
        <SquarePen/>
        <span>Compose</span>
      </button>
      <AnimatePresence>


      {open && (
        <div className="w-full fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0">
          <motion.div 
          drag 
          dragMomentum={false}
          initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
           className="bg-white relative flex flex-col gap-1.5 rounded-xl   w-1/2  h-[85dvh]  border border-neutral-200">
            <div className="w-full p-2 rounded-t-xl justify-between flex items-center  h-12 bg-tgcc-50">
            <h1>Nouveau message </h1>
               <X className="cursor-pointer right-1 top-1 opacity-70 size-4" onClick={openclose}/>

            </div>
            <form onSubmit={HendleAddEmployes} className="flex p-2  h-full flex-col gap-2" action="">
              <input type="text" name="title"  className="w-full outline-0 border-b border-neutral-100  h-11"  placeholder="to:"/>
                <div className="w-full flex flex-col gap-1">
                  <input type="text" name="date_of_start"  className="w-full outline-0 border-b border-neutral-100 h-11"  placeholder="cc"/>
                </div>
              

              <textarea name="description" className=" w-full outline-0 border-b border-neutral-100 h-full p-3.5 resize-none" id="" placeholder="Message"></textarea>
              <div className="flex h-12 justify-end items-center">
                <button type="submit" className="w-30 outline-0 flex gap-2 justify-center items-center bg-neutral-950 text-white rounded-md cursor-pointer h-10">
                  <SendHorizonal/>
                  envoyer
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
