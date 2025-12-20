import Navbar from '@/components/sections/nav';
import Sidebar from '@/components/sections/sidebar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='grid p-2 bg-neutral-50 grid-cols-[240px_1fr] h-dvh'>
      <Sidebar/>
      <div className="w-full  flex flex-col gap-1 overflow-y-scroll  h-dvh">
        
        {children}
      </div>
    </div>
  )
}

export default layout
