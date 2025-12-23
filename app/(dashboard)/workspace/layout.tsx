import Messages from '@/components/inbox/Messages';
import Message from '@/components/kits/message';
import Navbar from '@/components/sections/nav';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
   <div className='grid grid-cols-[460px_1fr]   h-dvh'>
      <Messages/>
      <div className="w-full  bg-white   flex flex-col gap-2  overflow-y-scroll  h-dvh">
        {children}
      </div>
   </div> 
    )
}

export default layout