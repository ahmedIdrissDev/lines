  "use client";
  import { store } from "@/store";
  import { Employee } from "@/types";
  import React, { FormEvent, useEffect, useRef, useState } from "react";
  import Welcome from "./kits/welcome";
  import Form from "./kits/from";
  import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from "ai";
import {motion} from 'motion/react'
import Message from "./kits/message";

  const Hr = () => {
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

  function handlesendMessage(e: FormEvent) {
    e.preventDefault();
    setiinitailized(true);
    const formdata = new FormData(e.currentTarget as HTMLFormElement);
    const text = formdata.get("text")?.toString();
    if (!text) return;
    sendMessage({
      role: "user",
      parts: [{ type: "text", text }],
    });
    

    }
    
    return (
      <>
              <button onClick={openclose} className='w-40 cursor-pointer h-11 bg-tgcc-500 text-white rounded-md'>Get started</button>

        {open && (
          <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-end items-center inset-0">
            <div className="bg-white flex justify-between  p-3 flex-col gap-1.5   w-1/2 h-full rounded-md border border-neutral-200">
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
        {
          !initailized&&    <Welcome/>
        }
           

              <Form handlefrom={handlesendMessage}/>
            </div>
          </div>
        )}
      </>
    );
  };

  export default Hr;
