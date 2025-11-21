"use client";
import { store } from "@/store";
import { Calendar, User, UserRoundPlus } from "lucide-react";
import { AnimatePresence  , motion} from "motion/react";
import React, { FormEvent, useState } from "react";

const Add = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const { data } = store();
  const grup = Object.groupBy(data, ({ lot }) => lot);
  const fun = Object.groupBy(data, ({ function: fun }) => fun);

  const key = Object.keys(grup);
  const funs = Object.keys(fun);

  async function HendleAddEmployes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fromdata = new FormData(e.currentTarget);
     const data = Object.fromEntries(fromdata.entries())
     console.log(data)
    // const response = await fetch("https://sheetdb.io/api/v1/s6vt0lc3cghvn", {
    //   method: "POST",
    //   body: JSON.stringify(data),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const req = await response.json();
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
           className="bg-white border-t-8 border-t-tgcc-500 flex flex-col gap-1.5  p-2 w-1/2 h-max min-h-90 rounded-md border border-neutral-200">
            <h1>Ajouter un tache </h1>
            <form className="flex  h-full flex-col gap-2" action="">
              <input type="text"  className="input h-11"  placeholder="title"/>
              <div className="grid gap-2 grid-cols-2">
              <input type="date"  className="input"  placeholder="title"/>
              <input type="date"  className="input"  placeholder="title"/>

              </div>
              <textarea name="" className="input h-full p-3.5 resize-none" id=""></textarea>
              <div className="flex justify-end items-center">
                <button className="w-00 h-1">Ajouter</button>
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
