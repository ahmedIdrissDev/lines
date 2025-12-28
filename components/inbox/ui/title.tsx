'use client'
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import React from 'react'

const Inbox = () => {
  const { data } = useSession();
    const args = {
      email: data?.user?.email as string,
      userId: data?.user?._id as Id<"users">,
    };
    const emails = useQuery(api.functions.reception.reception, args);
    const unreeds = emails?.filter(({seens})=>seens=== false)

  return (
    <div>
        <h1 className=''>Inbox</h1>
        <span className='text-sm opacity-80'> {emails?.length}  messages , {unreeds?.length} Unread </span>
    </div>
  )
}

export default Inbox