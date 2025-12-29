"use client";
import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
import { useSession } from "next-auth/react";
import moment from "moment";

import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Loading from "@/components/inbox/ui/loading";

const page = () => {
  const { data } = useSession();
  const routeURL = useRouter();
  const args = {
    userId: data?.user?._id as Id<"users">,
  };
  const emails = useQuery(api.functions.reception.getSentsMessages, args);
  
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
  function handleLink(id: string) {
    routeURL.push(`/workspace/${id}`);
  }
  return (
    
    <div className="flex bg-tgcc-50/25 py-1.5 flex-col ">
    
      <ScrollArea className="h-dvh w-full p-1 rounded-md ">


      {emails.map(({ subject, _id, _creationTime , anther ,body}) => {
        const time = moment(_creationTime).add('days').calendar();
        return (
          <div
            onClick={() => handleLink(_id)}
            key={_id}
            className="w-full hover:shadow py-2 relative rounded-xl hover:bg-neutral-100 duration-150 px-2  cursor-pointer flex-col items-start justify-start   min-h-12 flex "
          >
             
            <div className="grid grid-cols-[1fr_190px] w-full  p-2.5 items-start justify-between ">
              <div className="w-full h-full">
              <span className={''} >
                {subject}

              </span>
              <span className="line-clamp-1 opacity-80">{body} </span>
                 
              </div>
               <div className="w-full flex  justify-end h-full">
              <span className="text-sm opacity-60">{time} </span>
               </div>
            </div>

            <span className=" flex items-center gap-1 border text-sm p-1.5  rounded-full">
                <img src={anther?.image} width={100} height={100} className="w-5 h-5 rounded-full" />  
                      {anther?.name} </span>
          </div>
        );
      })}
          </ScrollArea>
    </div>

  );
};

export default page;
