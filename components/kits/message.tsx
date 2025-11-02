import { UIMessage } from "ai";
import React from "react";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import Image from "next/image";
import remarkGfm from 'remark-gfm';
const Message = ({ id, role, parts }: UIMessage) => {
  switch (role) {
    case "user":
      return (
        <div className="flex min-h-12 py-2  h-max items-center justify-end w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-max max-w-1/2 bg-tgcc-500 text-white rounded-2xl p-2"
          >
            <span>
              {parts.map((part, index) => {
                if (part.type === "text") {
                  return <Markdown remarkPlugins={[remarkGfm]} key={`${index}-text`}>{part.text}</Markdown>;
                }
              })}{" "}
            </span>
          </motion.div>
        </div>
      );
      break;
    default:
      return (
        <div className="flex items-start gap-2.5 justify-start w-full">
            <div className="w-14 h-14 ">
                <Image  src={'/logoicon.svg'} width={1000} height={1000} alt="logo" />

            </div>
          <div className=" h-max min-h-30 w-max max-1/2 ">
            <span>
              {parts.map((part, index) => {
                if (part.type === "text") {
                  return <Markdown remarkPlugins={[remarkGfm]} key={`${index}-text`}>{part.text}</Markdown>;
                }
                if (part.type === "tool-prodcut") {
                  switch (part.state) {
                    case "input-available":
                      return <span>loading</span>;
                    case "output-available":
                      return (
                        <div className="">loading ..</div>
                      );
                  }
                }
                if (part.type === "tool-booking") {
                  switch (part.state) {
                    case "output-available":
                      return (
                       <></>
                      );
                    case "input-available":
                      return (
                        <div
                          key={index}
                          className="w-1/2 h-12 bg-neutral-200 animate-pulse"
                        >
                          <h1>loading</h1>
                        </div>
                      );
                  }
                }
              })}
            </span>
          </div>
        </div>
      );
  }
};

export default Message;