"use client";
import React, {  useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChatPanel } from "./chat-panel";

const Hr = ({fullbutton}:{fullbutton?:boolean}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {fullbutton ?
         <button className='btn-primary w-full shadow-lg shadow-primary/20'>
            Démarrer l&apos;AI
          </button>
         :
           <button className='w-11 group cursor-pointer h-11 rounded-full border border-hairline p-2 hover:bg-surface-bone transition-colors flex items-center justify-center'>
             <Image src={'/ai.svg'} width={24} height={24} alt='AI Atlas' className='opacity-90 group-hover:rotate-90 transition-transform duration-500' />
          </button>
        }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0 bg-canvas text-ink border-hairline shadow-2xl overflow-hidden rounded-md">
        <DialogHeader className="flex flex-row justify-between items-center px-6 py-4 border-b border-hairline bg-surface-card space-y-0">
          <div className="flex items-center gap-3">
             <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white">
                <Image src={'/ai.svg'} width={18} height={18} alt='AI' className='invert' />
             </div>
             <DialogTitle className="heading-sm">Atlas AI Intelligent Assistant</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0 p-4">
            <ChatPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Hr;
