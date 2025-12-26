"use client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CallAIReplyTools } from "@/functions";
import { useMutation } from "convex/react";
import { Reply, SendHorizonal } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

const ReplyButton = ({
  message_Id,
  subject,
  body,
}: {
  message_Id?: string;
  subject: string;
  body: string;
}) => {
  const [openReply, setopenReply] = useState<Boolean>(false);
  const [text, settext] = useState<string>("");
  const [loading, setLoading] = useState<Boolean>(false);
  const openclose = () =>
    openReply ? setopenReply(false) : setopenReply(true);
  const handleReply = useMutation(api.functions.reception.PostMessagesReply);
  const { data } = useSession();

  const handleAIdatawriting = async () => {
    try {
      const Replydata = {
        messageId: message_Id as Id<"emails">,
        body: text,
        antherId: data?.user?._id as Id<"users">,
      };

      await handleReply(Replydata);
      openclose();
    } catch (error) {}
  };
  async function HandleGeminyReply() {
    const template = `
        ${subject}  ,
        ${body}
       `;
    setLoading(true);
    const replydata = await CallAIReplyTools({ text: template });
    console.log(replydata)
    settext(replydata);
    setLoading(false);
  }
  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={openclose}
          className="w-30 cursor-pointer flex items-center justify-center gap-2 h-10 bg-tgcc-50  text-tgcc-950 rounded-md"
        >
          reply
          <span>
            <Reply />
          </span>
        </button>
      </div>
      {openReply && (
        <>
          {loading ? (
            <div className="w-full h-54 rounded-2xl bg-tgcc-50/60 flex justify-center items-center">
              <Image
                src={"/ai.svg"}
                width={1000}
                height={1000}
                alt="logo"
                className="w-7  animate-bounce opacity-90 group-hover:rotate-90 duration-150"
              />
            </div>
          ) : (
            <div className="w-full h-max bg-tgcc-50/10  border p-2.5 border-neutral-100 rounded-2xl">
              <span className=" flex w-max items-center gap-1 border text-sm p-1.5 border-neutral-200 rounded-full">
                <img
                  src={data?.user?.image as string}
                  width={100}
                  height={100}
                  className="w-5 h-5 rounded-full"
                />
                {data?.user?.name}{" "}
              </span>
              <div className="w-full  p-2 h-54 flex flex-col gap-0.5 items-center ">
                <textarea
                  onChange={(e) => settext(e.currentTarget.value)}
                  className="w-full  h-full resize-none outline-0 p-2"
                  name=""
                  id=""
                  value={text}
                  placeholder="reply"
                ></textarea>
                <div className="flex justify-end  w-full items-center gap-2.5">
                  <button
                    onClick={HandleGeminyReply}
                    className="w-max px-2 text-tgcc-950 group cursor-pointer rounded-full h-10 flex  justify-center items-center gap-1.5 bg-white   border-neutral-200  "
                  >
                    <Image
                      src={"/ai.svg"}
                      width={1000}
                      height={1000}
                      alt="logo"
                      className="w-7  opacity-90 group-hover:rotate-90 duration-150"
                    />
                    <span> Reply with Geminy </span>
                  </button>
                  <button
                    onClick={handleAIdatawriting}
                    className="  gap-2.5 bg-white p-2  px-3 text-tgcc-950    hidden cursor-pointer   md:flex justify-center items-center  h-10  "
                  >
                    <SendHorizonal />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReplyButton;
