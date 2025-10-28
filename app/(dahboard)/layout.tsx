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
      <div className="w-full p-2 h-dvh">
        {children}
      </div>


    </div>
  )
}

export default layout
