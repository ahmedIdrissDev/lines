"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import React from "react";

const PopoverUI = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <>
      <Popover>
        <PopoverTrigger className="w-9 h-9 bg-white rounded-full cursor-pointer flex justify-center items-center overflow-hidden border border-hairline">
          <img
            src={user?.imageUrl}
            className="w-full h-full object-cover"
            alt="user avatar"
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 flex items-center bg-surface-card flex-col gap-4 justify-start p-6 rounded-xl border border-hairline shadow-lg">
          <span className="text-xs text-ash">{user?.primaryEmailAddress?.emailAddress}</span>
          <div className="flex w-full justify-center items-center flex-col gap-3">
            <img
              src={user?.imageUrl}
              className="w-16 h-16 rounded-full border-2 border-primary/10 p-1"
              alt="user profile"
            />
            <div className="flex justify-center items-center gap-2">
              <span className="font-bold text-ink">Bonjour, {user?.firstName}</span>
              <Image
                className="w-4 h-4"
                src={"/check.png"}
                width={16}
                height={16}
                alt="verified"
              />
            </div>
            <div className="flex justify-center gap-2 items-center w-full mt-2">
              <button
                className="flex-1 flex justify-center items-center gap-2 cursor-pointer rounded-full h-10 bg-surface-bone text-ink hover:bg-canvas transition-colors border border-hairline"
              >
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </button>
              <button
                className="flex-1 flex justify-center items-center gap-2 cursor-pointer h-10 bg-primary text-white rounded-full hover:bg-primary-deep transition-colors"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                <LogOut size={18} />
                <span className="text-sm">LogOut</span>
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default PopoverUI;
