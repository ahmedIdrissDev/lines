"use client";
import { api } from "@/convex/_generated/api";
import { useMutation, useQueries, useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import Loading from "./ui/loading";
import moment from "moment";

import { Id } from "@/convex/_generated/dataModel";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
const Reception = () => {
  const { data } = useSession();
  const routeURL = useRouter();
  const args = {
    email: data?.user?.email as string,
    userId: data?.user?._id as Id<"users">,
  };
  const emails = useQuery(api.functions.reception.reception, args);
  const markreadsMessage = useMutation(
    api.functions.reception.markreadsMessage
  );
  console.log(emails);
  if (!emails)
    return (
      <div className="flex p-2 flex-col gap-1.5">
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
        <Loading />
      </div>
    );
  function handleLink(id: string, seens: boolean) {
    if (seens) {
      routeURL.push(`/workspace/${id}`);
    }
    if (!seens) {
      const args = {
        messageId: id as Id<"emails">,
        userId: data?.user?._id as Id<"users">,
      };
      markreadsMessage(args);
      routeURL.push(`/workspace/${id}`);
    }
  }
  return (
    
    <div className="flex bg-tgcc-50/25 py-1.5 flex-col ">
    
      <ScrollArea  className="h-dvh w-full p-1 rounded-md ">


      {emails.map(({ subject, _id, _creationTime, seens , anther ,body ,type ,receptionId}) => {
        const time = moment(_creationTime).add('days').calendar();
        return (
          <div
            onClick={() => type ? routeURL.push(`/meeting/${_id}`) : handleLink(_id, seens)}
            key={_id}
            className={twMerge("w-full hover:shadow py-2 relative rounded-xl duration-150 px-2  cursor-pointer flex-col items-start justify-start   min-h-12 flex " , type ?'bg-neutral-900 text-white  mt-1':' hover:bg-neutral-100')}
          >
             
            <div className="grid grid-cols-[1fr_190px] w-full  p-2.5 items-start justify-between ">
              <div className="w-full  h-full">
              <span className={twMerge(seens ? "font-mono" : "font-bold " , 'line-clamp-2')}>
                 { type ? 'You has new Meeting call':subject}

              </span>

              <span className="line-clamp-2 opacity-70 text-sm">      { type ? `You and ${receptionId.length - 1} others are tagged to join the call`:body}
             </span>
                 
              </div>
               <div className="w-full flex  justify-end h-full">
              <span className="text-sm opacity-60">{time} </span>
               </div>
            </div>
            {!seens && (
              <div className="w-2 h-2 bg-red-500 absolute rounded-full  top-3 right-5" />
            )}
            <div className="flex  opacity-90 items-center gap-2">
            <span className=" flex items-center gap-1  text-sm p-1.5  rounded-full">
                <img src={anther?.image} width={100} height={100} className="w-5 h-5 rounded-full" />  
                {anther?.name} </span>

                {
                  type &&   <div  className={'w-40 gap-2 rounded-full bg-tgcc-200 cursor-pointer h-9 flex justify-center items-center animate-p text-tgcc-950 ' }>
                                        <span className="material-symbols-outlined opacity-80">duo</span>
                                        <span className="opacity-80" >Meeting</span>
                                    </div>
                }
            </div>
          </div>
        );
      })}
          </ScrollArea>
    </div>

  );
};

export default Reception;
