'use client'
import { api } from '@/convex/_generated/api'
import { useQueries, useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import Loading from './ui/loading'

const Reception = () => {
    const {data}= useSession()
    const emails = useQuery(api.functions.reception.reception , {email:data?.user?.email as string})
    console.log(emails)
    if( !emails) return (
        <div className="flex flex-col gap-1.5">
            <Loading/>
        </div>
    )
  return (
    <div className="flex flex-col gap-2 p-2.5">
      {emails.map(({subject ,_id ,_creationTime})=>(
        <span className='font-bold'>{subject} </span>
      ))}
    </div>
)
}

export default Reception