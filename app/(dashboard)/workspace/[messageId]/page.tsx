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
import { Reply, ReplyAll, SendHorizonal, Users, Video } from "lucide-react";
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
        <div className="border bg-tgcc-50 border-neutral-100 p-1.5 rounded-xl">
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
                <span className="text-sm opacity-85">
                  {email?.anther?.email}{" "}
                </span>
              </div>
            </div>
          </div>
          <p>{email?.message.body}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={openclose} className="w-30 cursor-pointer flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full">
            Reply
            <span>
              <Reply />
            </span>
          </button>

          <button className="w-30 cursor-pointer flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full">
            <Video />
            <span>Meeting</span>
          </button>
          <ReplyButton />
        </div>
        {openReply &&
        <div className="w-full h-max  border p-2.5 border-neutral-100 rounded-2xl">
            <span className="opacity-70 flex w-max items-center gap-1 border text-sm p-1.5 border-neutral-200 rounded-full">
                <img src={data?.user?.image as string} width={100} height={100} className="w-5 h-5 rounded-full" />  
                      {data?.user?.name} </span>
        <div className="w-full  p-2 h-14 flex items-center ">
          <textarea
            className="w-full  h-full resize-none outline-0 p-2"
            name=""
            id=""
            placeholder="reply"
          ></textarea>
          <button
            type="submit"
            className="  gap-2.5 bg-tgcc-700 p-2  px-3 text-white    hidden cursor-pointer   md:flex justify-center items-center border-t-2 border-tgcc-500 h-10  rounded-xl"
          >
            <SendHorizonal />
            Send
          </button>
        </div>

        </div>
        }
      </div>
    </div>
  );
};

export default page;
