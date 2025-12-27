import Messages from '@/components/inbox/Messages';
import Navbar from '@/components/inbox/workspace/nav';
import Message from '@/components/kits/message';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react'
import { Toaster } from 'sonner';

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="">
   <Navbar/>
   <div className='grid   grid-cols-[460px_1fr]   h-dvh'>
      <Messages/>
      <div className="w-full    bg-white   flex flex-col gap-2  overflow-y-scroll  h-dvh">
        {children}
      </div>
    <Toaster/>

   </div> 
    </div>
    )
}

export default layout