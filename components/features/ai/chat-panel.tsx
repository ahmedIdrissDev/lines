"use client";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import Welcome from "@/components/features/ai/welcome-msg";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { motion } from "motion/react";
import Message from "@/components/features/ai/chat-message";
import { ArrowUp, CirclePause, File, Paperclip } from "lucide-react";
import Loading from "@/components/ui/loading";
import { store } from "@/store";

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

export const ChatPanel = () => {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);
  const { ProjectID } = store()
  const { messages, sendMessage, stop, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai",
      headers: { 'X-App-Source': 'tgcc-app' },
    }),
    body: {
      projectId: ProjectID
    }
  });
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const formRef = useRef<HTMLFormElement>(null)
  
  async function handlesendMessage(e: FormEvent) {
    e.preventDefault();
    setInitialized(true);

    const formdata = new FormData(e.currentTarget as HTMLFormElement);
    const input = formdata.get("text") as string;
    const fileParts =
      files && files.length > 0 ? await convertFilesToDataURLs(files) : [];
      
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input } ,  ...fileParts],
    });

    setFiles(undefined);
    formRef.current?.reset()
  }

  return (
    <div className="flex flex-col h-full w-full">
        <div className="flex-1 flex flex-col min-h-0">
            {initialized ? (
              <div
                ref={chatRef}
                className="w-full flex-1 py-4 px-2 overflow-y-auto scrollbar-hide"
              >
                {messages.map((message) => (
                  <Message key={message.id} {...message} />
                ))}
                {status==='submitted' && <Loading/>}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                <Welcome fun={e=>{
                  setInitialized(true);
                  sendMessage({
                    role: "user",
                    parts: [{ type: "text", text: e } , ],
                  });
                }} />
              </div>
            )}
        </div>

        <div className="w-full relative min-h-[100px] mt-auto pt-4">
          <motion.div 
            initial={false}
            animate={{ 
              opacity: files?.length > 0 ? 1 : 0,
              y: files?.length > 0 ? -48 : 0
            }}
            className={`text-white py-2 flex gap-2 bg-primary px-4 rounded-lg absolute w-max z-20 pointer-events-none`}
          >
               <File className="w-5"/> 
             <span className="caption-tight text-on-primary">{files?.length} fichiers sélectionnés</span>
          </motion.div>
          <form
            ref={formRef}
            onSubmit={handlesendMessage}
            className="w-full p-2 bg-surface-card border border-hairline rounded-2xl shadow-sm focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all flex flex-col gap-2"
          >
            <textarea
              name="text" 
              rows={2}
              className="w-full px-3 py-2 outline-none resize-none body-sm text-ink placeholder:text-ash bg-transparent"
              placeholder="Posez votre question à l'Atlas AI..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <div className="flex justify-between items-center px-2 pb-1">
              <div className="flex gap-2">
                <label htmlFor="file-panel" className="p-2 hover:bg-surface-bone rounded-full cursor-pointer transition-colors text-charcoal">
                  <Paperclip className="w-5 h-5" />
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
                  id="file-panel"
                />
              </div>
              {status==='submitted' ? 
               <button type="button" onClick={() => stop()} className="w-10 h-10 bg-surface-dark hover:bg-ink rounded-full text-white flex justify-center items-center transition-colors">
                <CirclePause className="w-6 h-6" />
              </button> :
               <button type="submit" className="w-10 h-10 bg-primary hover:bg-primary-deep rounded-full text-white flex justify-center items-center transition-all shadow-lg shadow-primary/20">
                <ArrowUp className="w-6 h-6" />
              </button>
            }
            </div>
          </form>
        </div>
        <div className="flex py-2 justify-center items-center">
            <span className="text-[10px] text-ash text-center max-w-[80%] font-semibold">TGCC AI may make mistakes. Verify important data.</span>
        </div>
    </div>
  );
};
