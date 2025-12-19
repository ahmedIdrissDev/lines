"use client";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { useMutation, useQuery } from "convex/react";
import { Paperclip, SendHorizonal, SquarePen, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { FormEvent, useState } from "react";
import TextArea from "../kits/TextEditor";
import { reception } from "@/types";
import { toast } from "sonner";


interface Userreception {
  name: string;
  email: string;
  func: string;
}

const Add = () => {
  const [open, setOpen] = useState(false);
  const [text, settext] = useState<string>("");
  const [reseption, setReception] = useState<Userreception[]>([]);

  const openclose = () => (open ? setOpen(false) : setOpen(true));
  const user = useQuery(api.functions.login.getUsers) || [];
  const getbyname = user?.filter(({ name }) =>
    name.toLowerCase().includes(text.toLowerCase())
  );

  const CreateReception = useMutation(api.functions.reception.createReception)
  async function HendleAddEmployes(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const receptionEmails = formdata.getAll('receptionId') as string[] 
    const data = Object.fromEntries(formdata.entries());
    const Message :reception = {
      ...data  ,
      receptionId:receptionEmails , 
      file:['']

    }
    console.log(Message)
    CreateReception(Message)
    toast.success('email has been sent')
    openclose()
    try {
    } catch (error) {}
  }
  function handleAddReception(data: Userreception) {
    setReception((e) => [...e, data]);
    settext("");
  }
  return (
    <>
      <button
        onClick={openclose}
        className="w-full  gap-2.5 bg-white border border-neutral-200    hidden cursor-pointer   md:flex justify-center items-center gap-1. h-10  rounded-xl"
      >
        <SquarePen />
        <span>Compose</span>
      </button>
      <AnimatePresence>
        {open && (
          <div className="w-full fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0">
            <motion.div
              drag
              dragMomentum={false}
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1, opacity: 0 }}
              className="bg-white relative flex flex-col gap-1.5 rounded-xl   w-1/2  min-h-[85dvh]  border border-neutral-200"
            >
              <div className="w-full p-2 rounded-t-xl justify-between flex items-center  h-12 bg-tgcc-50">
                <h1>Nouveau message </h1>
                <X
                  className="cursor-pointer relative right-1 top-1 opacity-70 size-4"
                  onClick={openclose}
                />
              </div>
              {text && (
                <div className="w-96 p-3 absolute top-32 bg-white z-40 h-max border border-neutral-100 rounded-2xl">
                  {getbyname.map((data, index) => (
                    <div
                      key={index}
                      onClick={() => handleAddReception(data)}
                      className="w-full cursor-pointer p-2 hover:bg-neutral-50 rounded-2xl h-12 flex items-center gap-2"
                    >
                      <div className="w-8 h-8 flex justify-center items-center text-white bg-red-500  rounded-full">
                        {data.name.charAt(0)}
                      </div>
                      <div className="">
                        <h1 className="text-sm">{data.email} </h1>
                        <span className="text-sm opacity-90">{data.name} </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <form
                onSubmit={HendleAddEmployes}
                className="flex p-2  h-full flex-col gap-2"
                action=""
              >
                <span>to:</span>
                <div className="grid p-2  grid-cols-3 items-center border-b border-neutral-100 gap-1">
                  {reseption.map(({ name, email }, index) => (
                    <div
                      key={index}
                      className="w-full cursor-pointer p-2 border border-neutral-100 hover:bg-neutral-50 rounded-2xl h-12 flex items-center gap-2"
                    >
                      <div className="w-8 h-8 flex justify-center items-center text-white bg-red-500  rounded-full">
                        {name.charAt(0)}
                      </div>
                      <div className="">
                        <input type="text" readOnly value={email} name="receptionId" hidden />
                        <span className="text-sm opacity-90">{name.split(' ')[0].toLowerCase() } </span>
                      </div>
                    </div>
                  ))}
                  <input
                    type="text"
                    onChange={(e) => settext(e.currentTarget.value)}
                    className="w-full outline-0   h-11"
                    placeholder=""
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <input
                    type="text"
                    name="subject"
                    className="w-full font-bold outline-0 border-b border-neutral-100 h-11"
                    placeholder="Subject"
                  />
                </div>

                <TextArea />
                <input type="file" hidden name="file" id="file" />
                <div className="flex h-12  gap-1.5 justify-end items-center">
                  <label htmlFor="file">
                    <Paperclip />
                  </label>
                  <button
                    type="submit"
                    className="w-30 outline-0 flex gap-2 justify-center items-center bg-neutral-950 text-white rounded-md cursor-pointer h-10"
                  >
                    <SendHorizonal />
                    envoyer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Add;
