"use client";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, X } from "lucide-react";
import { Proejct } from "@/types";
import Projectcard from "./addProjectcard";
import { useRouter } from "next/navigation";
const UserButton = () => {
  const { data } = useSession();
    const routeURL = useRouter();
    const handleRouteNavigation = ()=>{
        routeURL.push('/user')
    }
  
  return (
    <>
    <div onClick={handleRouteNavigation} className="flex cursor-pointer h-20 items-center gap-2.5 w-full  border-neutral-100 shadow rounded-xl p-2 border ">
      <img
        src={data?.user?.image?.trim() ? data.user.image : "/avatar.png"}
        className="w-9 bg-white h-9 rounded-full cursor-pointer"
      />
      <div className="">
      <span>{data?.user?.name} </span>
      <span className="text-sm opacity-70">{data?.user?.email} </span>

      </div>

    </div>

    </>
  );
};

export default UserButton;
