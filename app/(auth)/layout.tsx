import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className='flex justify-center items-center h-dvh '>
      {children}
    </div>
  )
}

export default layout
