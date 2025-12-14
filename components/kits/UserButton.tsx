"use client";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, X } from "lucide-react";
import { Proejct } from "@/types";
import Projectcard from "./addProjectcard";
const UserButton = () => {
  const [open, setOpen] = useState(false);
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const { data } = useSession();

  const project = data?.user?.project as Proejct[];
  return (
    <>
      <img
        onClick={openclose}
        src={data?.user?.image?.trim() ? data.user.image : "/avatar.png"}
        className="w-9 bg-white h-9 rounded-full cursor-pointer"
      />
      <AnimatePresence>
        {open && (
          <div onClick={openclose} className="w-full cursor-pointer   fixed z-20 bg-neutral-900/10 p-4 flex justify-end items-start  inset-0">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={(e)=>e.stopPropagation()}
              className="bg-white cursor-auto relative flex justify-between h-full  flex-col gap-1.5  p-4 w-full md:w-96  rounded-xl border border-neutral-200"
            >
              <div className="flex flex-col gap-1.5">
                <h1 className="font-semibold">Paramètres du compte</h1>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      data?.user?.image?.trim()
                        ? data.user.image
                        : "/avatar.png"
                    }
                    className="w-9 border border-tgcc-400 bg-white h-9 rounded-full cursor-pointer"
                  />
                  <h1>{data?.user?.name} </h1>
                </div>
                <div className="w-full px-3 border border-neutral-100 bg-neutral-50 rounded-2xl h-6 flex items-center">
                  <span className="opacity-70"> {data?.user?.email}</span>
                </div>
                <div className="w-full px-3 border border-neutral-100 rounded-2xl h-12 flex items-center">
                  <span className="opacity-70">{data?.user?.role} </span>
                </div>
                <div className="w-full  rounded-2xl h-12 flex items-center">
                  <div className="w-full px-2 h-full ">
                    <p>Project</p>
                    <div className="px-2 w-full">
                      {project.map(({ name }, index) => (
                        <div
                          className="text-sm  border-l border-b h-8 w-max rounded-bl-xl p-2 border-neutral-200"
                          key={index}
                        >
                          <span>{name} </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="opacity-70"> </span>
                </div>
              </div>
              <div className="">
              <Projectcard/>
              <button
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                className="w-full rounded-2xl flex items-center cursor-pointer justify-center px-3 gap-2 border border-neutral-200 h-11 text-red-950  "
              >
                <LogOut />
                <span>logout</span>
              </button>

              </div>
              <X
                onClick={openclose}
                className="absolute size-4 right-2 top-2 opacity-70 cursor-pointer"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserButton;
