"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { avatar } from "@/constants/avatar";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { profile } from "console";
import { useMutation } from "convex/react";
import { Camera } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { toast, Toaster } from "sonner";
import { twMerge } from "tailwind-merge";

const PopoverUI = () => {
  const { data } = useSession();

  return (
    <>
      <Popover>
        <PopoverTrigger className=" w-9 h-9 bg-white rounded-full cursor-pointer flex justify-center items-center bottom-0 right-0">
          <img
            src={data?.user?.image as string}
            className="w-full bg-white h-full rounded-full cursor-pointer"
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 flex items-center bg-tgcc-100 flex-col gap-4 justify-start h-96 ">
          <span className="text-sm opacity-80">{data?.user?.email} </span>
          <div className="flex w-full justify-center items-center flex-col gap-1">
            <img
              src={data?.user?.image as string}
              className="w-14 bg-white h-14 rounded-full cursor-pointer"
            />
            <div className="flex justify-center items-center gap-2">
              <span> HI {data?.user?.name?.split(" ")[0]} </span>
               <Image
                                                          className="w-4"
                                                          src={"/check.png"}
                                                          width={1000}
                                                          height={1000}
                                                          alt="logo"
                                                        />
            </div>
            <div className="flex justify-center gap-1 items-center w-full">
             <button
           className="w-full cursor-pointer rounded-l-full h-10 bg-tgcc-200 text-tgcc-950"
            onClick={(e) => signOut({ redirect: true, callbackUrl: "/" })}
          >
            
            settings
          </button>
           <button
           className="w-full flex justify-center items-center gap-2 cursor-pointer h-10 border border-tgcc-200  rounded-r-full"
            onClick={(e) => signOut({ redirect: true, callbackUrl: "/" })}
          >
            <span className="material-symbols-outlined">
logout
</span>
            
            LogOut
          </button>
            </div>
          </div>
         

        </PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverUI;
