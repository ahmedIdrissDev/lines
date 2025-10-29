import Navbar from '@/components/Navbar';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='flex w-full flex-col gap-1 h-dvh'>
      
    <Navbar/>
      <div className="w-full flex flex-col gap-2 p-3 md:p-6 h-dvh">
        {children}
      </div>


    </div>
  )
}

export default layout
