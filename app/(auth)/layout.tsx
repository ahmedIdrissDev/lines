import Image from 'next/image';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className=' grid grid-cols-1  md:grid-cols-[600px_1fr] w-full h-dvh  '>
      <div className="w-full h-full">
              {children}

      </div>
      {/* <div className="w-full h-full bg-tgcc-500"></div> */}
        <Image src={'/background.png'} quality={1000} width={1000} height={1000} alt='logo' className="w-full hidden md:block object-cover  stify-center items-center h-full" />
      <div >
      </div>

    </div>
  )
}

export default layout
