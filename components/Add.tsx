"use client";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { useMutation } from "convex/react";
import { Calendar, User, UserRoundPlus } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";

const Add = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const hendleaddTask = useMutation(api.functions.tasks.createTask)
      
  async function HendleAddEmployes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fromdata = new FormData(e.currentTarget);
     const data = Object.fromEntries(fromdata.entries())
     const task ={
      ...data ,
      dirtask:'',
      userId:''
     }
     hendleaddTask(task)
    try {
    } catch (error) {}
  }
  return (
    <>
      <button
        onClick={openclose}
        className="w-11 border border-neutral-200 hidden cursor-pointer rounded-xl  md:flex justify-center items-center gap-1. h-10"
      >
        <Calendar className="opacity-70"/>
      </button>
      <AnimatePresence>


      {open && (
        <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
          <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
           className="bg-white border-t-[44px] border-t-tgcc-500 flex flex-col gap-1.5  p-2 w-1/2 h-max min-h-90 rounded-md border border-neutral-200">
            <h1>Ajouter une tâche au projet </h1>
            <form onSubmit={HendleAddEmployes} className="flex  h-full flex-col gap-2" action="">
              <input type="text" name="title"  className="input h-11"  placeholder="titre"/>
              <div className="grid gap-2 grid-cols-2">
                <div className="w-full flex flex-col gap-1">
                  <span>Date de début</span>
              <input type="date" name="date_of_start"  className="input"  placeholder="title"/>
                </div>
                  <div className="w-full flex flex-col gap-1">
                  <span>Date de fin</span>
              <input type="date" name="date_of_end" className="input"  placeholder="title"/>
                </div>

              </div>
              <textarea name="description" className="input h-60 p-3.5 resize-none" id="" placeholder="description"></textarea>
              <div className="flex h-12 justify-end items-center">
               <button onClick={openclose} className="w-30 bg-amber-300/5  rounded-md cursor-pointer h-11">annuler</button>

                <button type="submit" className="w-30 bg-tgcc-600 text-white rounded-md cursor-pointer h-11">Ajouter</button>
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
