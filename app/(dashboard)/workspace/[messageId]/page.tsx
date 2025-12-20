'use client'
import Loading from '@/components/inbox/ui/loading'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Reply, ReplyAll } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const {messageId} = useParams<{messageId:string}>()
  const id = (messageId ? messageId : undefined) as Id<"emails">
  const email = useQuery(api.functions.reception.getRespoition ,{id} )
  console.log(email)

  if(!email) return (
    <div className="w-full p-3.5 h-dvh flex flex-col gap-1.5">
       <Loading/>
       <div className="bg-neutral-100 h-full w-full  rounded-xl animate-pulse"></div>
    </div>
  )
  const onthers = email.message.receptionId as string[]
  return (
    <div className='w-full p-2'>
      <div className="flex w-full py-2 border-b border-neutral-100 items-center gap-1.5">
        <div className="w-10 h-10 rounded-full bg-neutral-200"></div>
        <div className="flex flex-col">
           <h1 className='text-sm'>{email?.anther?.name} </h1>
           <span className='text-sm opacity-85'>{email?.anther?.email} </span>

        </div>
      </div>
      <div className="">
        cc : {onthers.length}
      </div>
      <div className="p-2">
      <h1 className='text-2xl'>{email?.message?.subject} </h1>
      {email?.message.body} 
      </div>
     <div className="flex items-center gap-1.5">
       <button className='w-30 flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full'>
        reply
        <span><Reply/></span>
       </button>
              <button className='w-30 flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full'>
        reply all
        <span><ReplyAll/></span>
       </button>
     </div>
      </div>
  )
}

export default page