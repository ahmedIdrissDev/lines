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
import { Forward } from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const id = (messageId ? messageId : undefined) as Id<"emails">;
  const email = useQuery(api.functions.reception.getRespoition, { id });
  const reply = useQuery(api.functions.reception.getMessagesReply , {messageId:id})
  const time = moment(email?.message?._creationTime).add('days').calendar();
  const receptions = email?.message?.receptionId as string[]
  if (!email )
    return (
      <div className="w-full p-3.5 h-dvh flex flex-col gap-3">
        <Loading />
        <div className="bg-neutral-100 h-full w-full  rounded-xl animate-pulse"></div>
      </div>
    );
  return (
    <div className="w-full  flex flex-col gap-1.5  ">
      <Header title={email?.message?.subject as string} />

      <div className="p-2  flex flex-col gap-2">
        <div className="border  border-neutral-100 p-1.5 rounded-xl">
          <div className="flex  w-full justify-between py-2  items-center gap-1.5">
            <div className="flex items-center  gap-1.5">
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
                <span className="text-sm  opacity-85">
                  <span>to: { receptions[0] } and { receptions.length -1} others </span>
                </span>
              </div>
            </div>
                <span className="text-sm opacity-90">{time} </span>
          </div>
          <p>{email?.message.body}</p>
        </div>
        <div className=" gap-2">

       <ReplyButton message_Id={messageId} body={email?.message.body} subject={email?.message?.subject} />
      
        </div>
      </div>
      <div className="flex flex-col gap-2 ">

      {reply?.map(({body ,anther})=>(
        <div className="px-6  flex flex-col gap-2.5   rounded-2xl p-2">
           <div className="flex items-center gap-1.5">
              <img
                src={anther?.image}
                className="w-9 bg-white h-9 rounded-full cursor-pointer"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm">{anther?.name} </h1>
                  <Image
                    className="w-4"
                    src={"/check.png"}
                    width={1000}
                    height={1000}
                    alt="logo"
                  />
                </div>
                <span className="text-sm underline opacity-85">
                  {anther?.email}{" "}
                </span>
              </div>
            </div>
            <div className="p-2  rounded-md">
              
          <p>{body} </p>
            </div>
        </div>
      ))}
            </div>

    </div>
  );
};

export default page;
