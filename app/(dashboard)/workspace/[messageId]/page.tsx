'use client'
import Loading from '@/components/inbox/ui/loading'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Reply, ReplyAll, Users, Video } from 'lucide-react'
import Image from 'next/image'
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
  const onthers = email?.message?.receptionId as string[] || []
  return (
    <div className='w-full p-2'>
      <div className="flex w-full justify-between py-2 border-b border-neutral-200 items-center gap-1.5">
        <div className="flex items-center gap-1.5">
 <img
        src={"/avatar.png"}
        className="w-9 bg-white h-9 rounded-full cursor-pointer"
      />        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
           <h1 className='text-sm'>{email?.anther?.name} </h1>
           <Image className='w-4' src={'/check.png'}  width={1000} height={1000} alt='logo'/>
          </div>
           <span className='text-sm opacity-85'>{email?.anther?.email} </span>

        </div>

        </div>
        <span className='text-sm w-20 border-neutral-100 rounded-full border border-n'>{email?.anther?.func} </span>
      </div>
      <div className="w-20 flex justify-center items-center gap-2 h-9 rounded-2xl border border-neutral-100">
        <Users/> {onthers.length}
      </div>
      <div className="p-2">
      <h1 className='text-2xl'>{email?.message?.subject} </h1>
      <p>

      {email?.message.body} 
      </p>
      </div>
     <div className="flex items-center gap-1.5">
       <button className='w-30 cursor-pointer flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full'>
        reply
        <span>
          <Reply/>
          
          </span>
       </button>
              <button className='w-30 cursor-pointer flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full'>
        <span>
        reply all
          </span>
          <ReplyAll/>
       </button>
         <button className='w-30 cursor-pointer flex items-center justify-center gap-2 h-10 bg-tgcc-700/5 text-tgcc-950 rounded-full'>
         
         <Video/>
        <span>Meeting</span>
       </button>
     </div>
      </div>
  )
}

export default page