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
      <div className="w-full bg h-full"></div>

    </div>
  )
}

export default layout
