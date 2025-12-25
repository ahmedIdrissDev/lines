import Messages from '@/components/inbox/Messages';
import Navbar from '@/components/inbox/workspace/nav';
import Message from '@/components/kits/message';
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
   <div className='grid  bg-tgcc-50 grid-cols-[460px_1fr]   h-dvh'>
      <Messages/>
      <div className="w-full   bg-white   flex flex-col gap-2  overflow-y-scroll  h-dvh">
        {children}
      </div>
          <Toaster/>

   </div> 
    </div>
    )
}

export default layout