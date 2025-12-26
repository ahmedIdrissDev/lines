import Sidebar from '@/components/sections/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='grid   grid-cols-[230px_1fr] h-dvh'>
      <Sidebar/>
      <ScrollArea className="w-full  bg-white  flex flex-col   h-dvh">
        {children}
      </ScrollArea>
    </div>
  )
}

export default layout
