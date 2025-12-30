import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='w-full grid grid-cols-[1fr_300px] p-20 gap-2 h-max bg-neutral-900 '>
                <div className="w-full h-dvh  rounded-2xl">
                          {children}

                </div>

        <div className="w-full h-96 bg-neutral-800/65 rounded-2xl"></div>
    </div>
  )
}

export default layout