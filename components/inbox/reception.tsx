'use client'
import { api } from '@/convex/_generated/api'
import { useQueries, useQuery } from 'convex/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import Loading from './ui/loading'
import moment from "moment";
import Link from 'next/link'
import { File } from 'lucide-react'
import Image from 'next/image'
const Reception = () => {
    const {data}= useSession()
    const emails = useQuery(api.functions.reception.reception , {email:data?.user?.email as string})
    console.log(emails)
    if( !emails) return (
        <div className="flex p-2 flex-col gap-1.5">
            <Loading/>
            <Loading/>
            <Loading/>
            <Loading/>
            <Loading/>

        </div>
    )
  return (
    <div className="flex py-1.5 flex-col ">
      <div className="p-2  ">
        <input type="text" className='input border-0 bg-neutral-50' placeholder='search' />
      </div>
      {emails.map(({subject ,_id ,_creationTime})=>{
        const time = moment(_creationTime).fromNow() ;
        return(
          <Link href={`/workspace/${_id}`} key={_id} className="w-full relative hover:bg-neutral-50 duration-150 px-2 border-b cursor-pointer flex-col items-start border-neutral-100  h-12 flex ">
            <div className="flex w-full p-2.5 items-center justify-between ">
              <span className='font-bold'>{subject} </span>
              <span className='text-sm opacity-40'>{time} </span>
            </div>
              <div className="w-2 h-2 bg-red-500 rounded-full absolute top-0 right-0"/>

          </Link>
        )
      }
    )
      }
    </div>
)
}

export default Reception