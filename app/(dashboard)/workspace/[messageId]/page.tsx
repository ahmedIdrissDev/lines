'use client'
import Loading from '@/components/inbox/ui/loading'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
  const {messageId} = useParams<{messageId:string}>()
  const id = (messageId ? messageId : undefined) as Id<"emails">
  const email = useQuery(api.functions.reception.getRespoition ,{id} )
  console.log(email)
  if(!email) return (
    <div className="w-full h-dvh flex flex-col gap-1.5">
       <Loading/>
       <div className="bg-neutral-100 h-full w-full  rounded-xl animate-pulse"></div>
    </div>
  )
  return (
    <div className='w-full'>
      <div className="flex w-full py-1 border-b border-neutral-100 items-center gap-1.5">
        <div className="w-10 h-10 rounded-full bg-neutral-200"></div>
        <div className="flex flex-col">
           <h1 className='text-sm'>{email?.anther?.name} </h1>
           <span className='text-sm'>{email?.anther?.func} </span>

        </div>
      </div>
      <div className="p-2">
      <h1 className='text-2xl'>{email?.message?.subject} </h1>
      {email?.message.body} </div>

      </div>
  )
}

export default page