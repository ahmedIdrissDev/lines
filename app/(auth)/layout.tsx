import Image from 'next/image';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=' grid grid-cols-2 w-full h-dvh '>
      <div className="w-full h-full">
              {children}

      </div>
      <div className="w-full p-1 bg-blue-50 flex justify-center items-center h-full">
        <Image src={'/demo.svg'} quality={1000} width={1000} height={1000} alt='logo' />
      </div>

    </div>
  )
}

export default layout
