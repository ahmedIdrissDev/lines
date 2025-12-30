import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='w-full grid grid-cols-[1fr_300px] p-7 gap-2 h-dvh bg-neutral-900 '>
                <div className="w-full h-full  rounded-2xl">
                          {children}

                </div>
        <div className="w-full h-full flex p-2 flex-col gap-2">
        <div className="w-full h-full bg-neutral-800/65 rounded-2xl"></div>
        <div className="w-full h-full bg-neutral-800/65 rounded-2xl"></div>

        </div>
    </div>
  )
}

export default layout