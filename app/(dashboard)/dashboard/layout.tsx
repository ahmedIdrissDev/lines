import Navbar from '@/components/nav';
import Sidebar from '@/components/sidebar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
      
      <div className="w-full  flex flex-col gap-2 p-3 overflow-y-scroll md:px-2 h-dvh">
        <Navbar/>
        {children}
      </div>


  )
}

export default layout
