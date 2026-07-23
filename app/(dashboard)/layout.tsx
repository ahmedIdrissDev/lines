import Navbar from '@/components/sections/nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react'

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
    {/* <div className="w-full h-11 text-white bg-primary flex justify-center items-center">
        <span className='text-sm'>TGCC Lines est encore en phase MVP. Pour toute nouvelle fonctionnalité ou demande d’évolution, veuillez contacter ahmed.hallouf@tgcc.ma </span>
      </div> */}
    <div className='h-dvh overflow-hidden bg-canvas'>
      <ScrollArea className="w-full p-2 bg-canvas flex flex-col h-dvh">
                <Navbar/>
        
        {children}
      </ScrollArea>
    </div>
    </>
  )
}

export default layout
