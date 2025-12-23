import Image from 'next/image';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='flex justify-center items-center bg-white  w-full h-dvh  '>
              {children}

      {/* <div className="w-full h-full bg-tgcc-500"></div> */}
        {/* <Image src={'/bg.svg'} quality={1000} width={10000} height={300} alt='logo' className="w-full hidden md:block object-cover  stify-center items-center h-dvh" /> */}

    </div>
  )
}

export default layout
