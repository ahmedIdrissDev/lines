import Image from 'next/image';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='flex justify-center relative items-center bg-canvas  w-full h-dvh  '>
      <div className="z-10">

              {children}
      </div>
<svg className='fixed opacity-35  w-dvh -left-[300px] rotate-90' width="5644" height="2337" viewBox="0 0 5644 2337" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M126.431 2300.17C126.431 2300.17 633.615 522.906 1425.93 686.668C1786.17 761.125 1825.01 1216.31 2192.43 1234.17C2725.16 1260.06 2609.43 435.613 3090.43 205.168C4180.11 -316.894 5528.43 2110.17 5528.43 2110.17" stroke="url(#paint0_linear_71_2)" stroke-width="263"/>
<defs>
<linearGradient id="paint0_linear_71_2" x1="2827.43" y1="131.586" x2="2827.43" y2="2300.17" gradientUnits="userSpaceOnUse">
<stop stop-color="#7E1212"/>
<stop offset="1" stop-color="#2C1616"/>
</linearGradient>
</defs>
</svg>
<svg className='fixed  w-dvh  opacity-35 -right-[300px] -rotate-90  ' width="5644" height="2337" viewBox="0 0 5644 2337" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M126.431 2300.17C126.431 2300.17 633.615 522.906 1425.93 686.668C1786.17 761.125 1825.01 1216.31 2192.43 1234.17C2725.16 1260.06 2609.43 435.613 3090.43 205.168C4180.11 -316.894 5528.43 2110.17 5528.43 2110.17" stroke="url(#paint0_linear_71_2)" stroke-width="263"/>
<defs>
<linearGradient id="paint0_linear_71_2" x1="2827.43" y1="131.586" x2="2827.43" y2="2300.17" gradientUnits="userSpaceOnUse">
<stop stop-color="#7E1212"/>
<stop offset="1" stop-color="#2C1616"/>
</linearGradient>
</defs>
</svg>

      {/* <div className="w-full h-full bg-tgcc-500"></div> */}
        {/* <Image src={'/bg.svg'} quality={1000} width={10000} height={300} alt='logo' className="w-full hidden md:block object-cover  stify-center items-center h-dvh" /> */}

    </div>
  )
}

export default layout
