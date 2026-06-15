"use client"
import { UIMessage } from "ai";
import React from "react";
import Markdown from "react-markdown";
import { inertia, motion } from "motion/react";
import Image from "next/image";
import remarkGfm from 'remark-gfm';
import { FunctionCall } from "../dashboard/charts/chart-radial-text";
import Loading from "@/components/ui/loading";
import { Employee } from "@/types";
import { FileText } from "lucide-react";
import Doc from "./doc";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Export from "./export";
const Message = ({ id, role, parts }: UIMessage) => {
  switch (role) {
    case "user":
      return (
        <div className="flex min-h-12 py-2 h-max items-center justify-end w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-max max-w-1/2 min-w-22 bg-primary text-white rounded-2xl p-3"
          >
            <span className="body-sm">
              {parts.map((part, index) => {
                if (part.type === "text") {
                  return <Markdown remarkPlugins={[remarkGfm]} key={`${index}-text`}>{part.text}</Markdown>;
                }
              })}{" "}
            </span>
          </motion.div>
        </div>
      );
    default:
      return (
        <div className="flex items-start gap-2.5 justify-start w-full py-2">
          <div className="h-full min-h-30 w-max max-w-1/2 min-w-22 bg-linear-0 from-white via-white via-75% to-primary/20 rounded-2xl p-3">
            <span className="body-sm">
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
                       <span> {part.output as string} </span>
                       </>
                      );
                    case "input-available":
                      return (
                      <Loading key={index}/>
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