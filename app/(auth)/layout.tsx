import Image from 'next/image';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=' grid grid-cols-[600px_1fr] w-full h-dvh '>
      <div className="w-full h-full">
              {children}

      </div>
        <Image src={'/bgs.webp'} quality={1000} width={1000} height={1000} alt='logo' className="w-full object-cover p-1 bg-tgcc-100 stify-center items-center h-full" />
      <div >
      </div>

    </div>
  )
}

export default layout
