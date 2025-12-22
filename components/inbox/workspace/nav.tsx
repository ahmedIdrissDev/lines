'use client'
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
    <nav className='flex items-center gap-2  h-12 p-2 border-b border-neutral-100'>
       <button className=" cursor-pointer w-20 relative p-2 flex items-center gap-1 h-full bg-neutral-100 rounded-full">
        <Inbox/>
        <span>Inbox</span>
        {unseens?.length > 0 && <span className=' cursor-pointer w-4 absolute top-0 right-0 h-4 bg-red-600 text-white rounded-full text-sm flex justify-center items-center'>{unseens.length} </span>}
       </button>
       <button className=" cursor-pointer w-20 p-2 flex items-center gap-1 h-full bg-neutral-100 rounded-full">
        <CircleDashed/>
        <span>Seen</span>
       </button>
       <button className=" cursor-pointer min-w-20 bg-tgcc-800 text-white w-max p-2 flex items-center gap-1 h-full  rounded-full">
        <Video/>
        <span>Meeting</span>
       </button>

    </nav>
  )
}

export default Navbar