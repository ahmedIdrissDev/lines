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
  if(!email) return (
    <div className="w-full h-dvh flex flex-col gap-1.5">
       <Loading/>
       <div className="bg-neutral-100 h-full w-full  rounded-xl animate-pulse"></div>
    </div>
  )
  return (
    <div>
      {email?.receptionId.map((e , index)=>(
        <div className=""> </div>
      ))}
      <h1>{email?.subject} </h1>
      {email?.body} </div>
  )
}

export default page