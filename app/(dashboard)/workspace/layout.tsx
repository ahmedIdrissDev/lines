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
   <div className='grid   bg-tgcc-50 grid-cols-[460px_1fr]   h-dvh'>
      <Messages/>
      <ScrollArea className="w-full    bg-white   flex flex-col gap-2  overflow-y-scroll  h-dvh">
        {children}
      </ScrollArea>
          <Toaster/>

   </div> 
    </div>
    )
}

export default layout