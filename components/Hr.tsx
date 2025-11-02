"use client";
import { store } from "@/store";
import { Employee } from "@/types";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Welcome from "./kits/welcome";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "motion/react";
import Message from "./kits/message";
import { ArrowUp, File, Paperclip, X } from "lucide-react";

async function convertFilesToDataURLs(
  files: FileList
): Promise<
  { type: "file"; filename: string; mediaType: string; url: string }[]
> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<{
          type: "file";
          filename: string;
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              type: "file",
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string, // Data URL
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
}
const Hr = () => {
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const [open, setOpen] = useState(false);
  const [text, settext] = useState<String>("");
  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const [initailized, setiinitailized] = useState<boolean>(false);
  const [inputvalue, reSetinput] = useState<string>("");
  const { messages, sendMessage, stop, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai",
    }),
  });
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  async function handlesendMessage(e: FormEvent) {
    e.preventDefault();
    setiinitailized(true);

    const formdata = new FormData(e.currentTarget as HTMLFormElement);
    const input = formdata.get("text") as string;
    const fileParts =
      files && files.length > 0 ? await convertFilesToDataURLs(files) : [];
      console.log(fileParts)
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input } ,  ...fileParts],
    });

    setFiles(undefined);
  }

  return (
    <>
      <button
        onClick={openclose}
        className="w-40 cursor-pointer h-11 bg-tgcc-950 text-white rounded-md"
      >
        Get started
      </button>
   <AnimatePresence>

      {open && (
        <motion.div className="w-full  fixed z-20  bg-neutral-900/10 flex justify-end items-center inset-0">
          <motion.div
             initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}

          className="bg-white relative flex justify-between  p-3 flex-col gap-1.5   w-[70%] h-full rounded-md border border-neutral-200">
            <div onClick={openclose} className="">
              <button className="w-20 absolute top-3.5 left-2.5 h-10 bg-tgcc-950 text-white rounded-full cursor-pointer">
                <X/>
              </button>
            </div>
            {initailized && (
              <motion.div
                layout
                key={"room-2"}
                layoutId="room"
                ref={chatRef}
                className="w-full font-arabic py-12 px-3 mask-b-from-90% mask-b-to-95%   overflow-y-auto scroll-m-1  h-[95%]"
              >
                {messages.map((message) => (
                  <Message key={message.id} {...message} />
                ))}
              </motion.div>
            )}
            {!initailized && <Welcome />}
          <div className="w-full relative h-20">
            <motion.div  className={`bg-linear-120 py-1 flex gap-1.5 from-tgcc-950 to-tgcc-950/15  text-white px-2 duration-100 rounded-2xl ${files?.length > 0 ? 'opacity-100 -mt-3':'opacity-0 mt-0'}  absolute w-full h-full `}>
                 <File/> 
               <span className="">{files?.length} files</span>
            </motion.div>
            <form
              onSubmit={handlesendMessage}
              className="w-full p-1 mt-5 h-full absolute flex justify-between items-center z-10 rounded-2xl bg-white border border-tgcc-400"
            >
              <input
                name="text" 
                type="text"
                className="w-full px-2 h-[50%] outline-0 resize-none"
                placeholder="asking about something "
                id=""
              />
              <div className="flex justify-end gap-2 items-center">
                <label htmlFor="file">
                  <Paperclip />
                </label>
                <input
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setFiles(e.target.files);
                    }
                  }}
                  type="file"
                  name="file"
                  hidden
                  id="file"
                />
                <button className="w-9 h-9 bg-black rounded-full text-white flex justify-center items-center">
                  <ArrowUp />
                </button>
              </div>
            </form>
          </div>
          <div className="flex py-6 justify-center items-center">
              <span>TGCC AI may make mistakes, so you should always validate the data.</span>
          </div>
          </motion.div>
        </motion.div>
      )}
         </AnimatePresence>

    </>
  );
};

export default Hr;
