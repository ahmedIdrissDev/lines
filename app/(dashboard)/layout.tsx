import Sidebar from '@/components/sections/sidebar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='grid  bg-neutral-100/75 grid-cols-[230px_1fr] h-dvh'>
      <Sidebar/>
      <div className="w-full bg-white  flex flex-col gap-1 overflow-y-scroll  h-dvh">
        {children}
      </div>
    </div>
  )
}

export default layout
