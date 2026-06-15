import Navbar from '@/components/sections/nav';
import Sidebar from '@/components/sections/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='grid grid-cols-[270px_1fr] h-dvh overflow-hidden'>
      <Sidebar/>
      <ScrollArea className="w-full p-2 bg-white flex flex-col h-dvh">
                <Navbar/>
        
        {children}
      </ScrollArea>
    </div>
  )
}

export default layout
