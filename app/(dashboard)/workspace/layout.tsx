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
<div className='grid grid-cols-[400px_1fr]  gap-2 h-dvh'>
      <Messages/>
      <div className="w-full border border-neutral-100 bg-white rounded-md  flex flex-col gap-2  overflow-y-scroll md:px-2 h-dvh">
        {children}
      </div>
    </div> 
    )
}

export default layout