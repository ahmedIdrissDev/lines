'use client'
import PopoverUI from '@/components/users/ui/popover';
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { CircleDashed, Inbox, RefreshCcwDot, Video } from 'lucide-react'
import { useSession } from 'next-auth/react';
import React from 'react'

const Navbar = () => {
    const { data } = useSession();
    const args = {
      email: data?.user?.email as string,
      userId: data?.user?._id as Id<"users">,
    };
    const emails = useQuery(api.functions.reception.reception, args);
    const unseens = emails?.filter(({seens})=> seens== false )
  return (
    <nav className='flex items-center justify-between gap-2  h-14 p-2 border-b border-neutral-200'>
       <span>Inbox</span>
         <div className="p-2 w-96 border-b border-neutral-200 ">
        <input
          type="text"
          className="input rounded-md focus:shadow   "
          placeholder="search"
        />
      </div>
       <PopoverUI/>
    </nav>
  )
}

export default Navbar