import Navbar from '@/components/Navbar';
import Sidebar from '@/components/sidebar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='grid grid-cols-[200px_1fr] h-dvh'>
      <Sidebar/>
      <div className="w-full border-l bg-tgcc-50/35 border-neutral-200 flex flex-col gap-2 p-3 md:px-2 h-dvh">
    <Navbar/>
        {children}
      </div>


    </div>
  )
}

export default layout
