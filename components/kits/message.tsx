import { UIMessage } from "ai";
import React from "react";
import Markdown from "react-markdown";
import { motion } from "motion/react";
import Image from "next/image";
import remarkGfm from 'remark-gfm';
import { FunctionCall } from "../charts/chart-radial-text";
import Loading from "./loading";
import { Employee } from "@/types";
import { FileText } from "lucide-react";
const Message = ({ id, role, parts }: UIMessage) => {
  switch (role) {
    case "user":
      return (
        <div className="flex min-h-12 py-2  h-max items-center justify-end w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-max max-w-1/2 bg-tgcc-950 text-white rounded-2xl p-2"
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
           
          <div className=" h-[80%] min-h-30 w-max max-1/2 ">
            <span>
              {parts.map((part, index) => {
                if (part.type === "text") {
                  return <Markdown remarkPlugins={[remarkGfm]} key={`${index}-text`}>{part.text}</Markdown>;
                }
                if (part.type === "tool-show") {
                  switch (part.state) {
                    case "input-available":
                      return <Loading key={index}/>;
                    case "output-available":
                      return (
                        <div className="w-max h-max border rounded-2xl">
                            <FunctionCall key={index} data={part.output as Employee[]} />
                             </div>
                      );
                  }
                }
                if (part.type === "tool-Specific") {
                  switch (part.state) {
                    case "output-available":
                      return (
                       <>                             <FunctionCall key={index} data={part.output as Employee[]} />
 </>
                      );
                    case "input-available":
                      return (
                      <Loading/>
                      );
                  }
                }
                  if (part.type === "tool-generateDoc") {
                  switch (part.state) {
                    case "output-available":
                      return (
                       <>
                       <div className="w-96 h-70 border gap-2 border-neutral-200 p-3  flex flex-col justify-between rounded-2xl">
                        <div className="flex border border-neutral-200 h-full rounded-xl justify-center items-center">
                          <FileText/>
                        </div>
                       <button className="w-full cursor-pointer h-12 bg-tgcc-600 text-white rounded-md">save as pdf</button>
                       </div>
                       </>
                      );
                    case "input-available":
                      return (
                      <Loading/>
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