import React from 'react'

const Welcome = () => {
  return (
    <div className='flex justify-center h-full flex-col items-center'>
     <svg width="39" height="51" viewBox="0 0 39 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12.0298V50.416H15.8061V24.8382H2.99771V18.3756H35.116V24.8382H22.4634V50.416H38.6588V0L0 12.0298Z" fill="url(#paint0_linear_128_9)"/>
<defs>
<linearGradient id="paint0_linear_128_9" x1="19.3294" y1="-4.49519e-07" x2="39" y2="50" gradientUnits="userSpaceOnUse">
<stop stop-color="#461704"/>
<stop offset="1" stop-color="#AC390A"/>
</linearGradient>
</defs>
</svg>


      <h1 className='text-2xl'>Hello and Welcome I <span className='w-max px-3 border bg-linear-60 text-transparent bg-clip-text from-tgcc-700 to-yellow-300 border-neutral-200 rounded-full'> Tgcc ai </span></h1>
      <p className='opacity-90'>Smart, fast, AI-powered HR assistant — what do you need today?</p>
    </div>
  )
}

export default Welcome
