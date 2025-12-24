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
    
    <div className="flex  py-1.5 flex-col ">
      <div className="p-2 border-b border-neutral-200 ">
        <input
          type="text"
          className="input border-0 focus:shadow   bg-neutral-100"
          placeholder="search"
        />
      </div>
      <ScrollArea className="h-dvh w-full  rounded-md ">


      {emails.map(({ subject, _id, _creationTime, seens , anther ,body}) => {
        const time = moment(_creationTime).fromNow();
        return (
          <div
            onClick={() => handleLink(_id, seens)}
            key={_id}
            className="w-full hover:shadow py-2 relative hover:bg-neutral-50 duration-150 px-2 border-b cursor-pointer flex-col items-start justify-start border-neutral-200  min-h-12 flex "
          >
             
            <div className="flex w-full  p-2.5 items-start justify-between ">
              <div className="">
              <span className={twMerge(seens ? "font-mono" : "font-bold " )}>
                {subject}

              </span>
              <span className="line-clamp-1 opacity-80">{body} </span>
                 
              </div>

              <span className="text-sm opacity-40">{time} </span>
            </div>
            {!seens && (
              <div className="w-2 h-2 bg-red-500 absolute rounded-full  top-3 right-5" />
            )}
            <span className="opacity-70 flex items-center gap-1 border text-sm p-1.5 border-neutral-200 rounded-full">
                <img src={anther?.image} width={100} height={100} className="w-5 h-5 rounded-full" />  
                      {anther?.name} </span>
          </div>
        );
      })}
          </ScrollArea>
    </div>

  );
};

export default Reception;
