"use client";
import { Editor } from "@/components/blocks/editor-00/editor";
import Header from "@/components/inbox/ui/header";
import Loading from "@/components/inbox/ui/loading";
import ReplyButton from "@/components/inbox/ui/reply";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const [openReply , setopenReply] = useState<Boolean>(false)
  const { messageId } = useParams<{ messageId: string }>();
  const {data} = useSession()
  const id = (messageId ? messageId : undefined) as Id<"emails">;
  const email = useQuery(api.functions.reception.getRespoition, { id });
  const openclose =()=> openReply ? setopenReply(false) : setopenReply(true)
  if (!email)
    return (
      <div className="w-full p-3.5 h-dvh flex flex-col gap-3">
        <Loading />
        <div className="bg-neutral-100 h-full w-full  rounded-xl animate-pulse"></div>
      </div>
    );
  return (
    <div className="w-full flex flex-col gap-1.5 p-1.5  ">
      <Header title={email?.message?.subject as string} />

      <div className="p-2  flex flex-col gap-2">
        <div className="border  border-neutral-100 p-1.5 rounded-xl">
          <div className="flex  w-full justify-between py-2  items-center gap-1.5">
            <div className="flex items-center gap-1.5">
              <img
                src={email?.anther?.image}
                className="w-9 bg-white h-9 rounded-full cursor-pointer"
              />{" "}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm">{email?.anther?.name} </h1>
                  <Image
                    className="w-4"
                    src={"/check.png"}
                    width={1000}
                    height={1000}
                    alt="logo"
                  />
                </div>
                <span className="text-sm underline opacity-85">
                  {email?.anther?.email}{" "}
                </span>
              </div>
            </div>
          </div>
          <p>{email?.message.body}</p>
        </div>
           <ReplyButton/>

      
      </div>
    </div>
  );
};

export default page;
