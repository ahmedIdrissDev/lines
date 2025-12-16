import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
<div className="w-full p-2 h-dvh border border-neutral-100 bg-white rounded-xl">
      {children}
       </div>  )
}

export default layout