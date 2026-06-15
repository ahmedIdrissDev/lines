"use client";
import { UserButton as ClerkUserButton } from "@clerk/nextjs";
import React from "react";

const UserButton = () => {
  return (
    <div className="flex items-center gap-2.5 w-full border-neutral-200 shadow rounded-xl p-2 border bg-surface-card">
      <ClerkUserButton 
        showName
        appearance={{
          elements: {
            userButtonAvatarBox: "w-9 h-9",
            userButtonBox: "flex-row-reverse gap-2.5",
            userButtonOuterIdentifier: "text-ink font-normal text-sm",
          }
        }}
      />
    </div>
  );
};

export default UserButton;
