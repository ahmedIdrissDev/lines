import Sidebar from '@/components/sections/sidebar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='grid   grid-cols-[230px_1fr] h-dvh'>
      <Sidebar/>
      <div className="w-full  bg-white  flex flex-col   h-dvh">
        {children}
      </div>
    </div>
  )
}

export default layout
