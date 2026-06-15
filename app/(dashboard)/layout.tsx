import Navbar from '@/components/sections/nav';
import Sidebar from '@/components/sections/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const user = await currentUser();

  // Check if user has any permissions
  const permissions = (user?.publicMetadata?.permissions as string[]) || [];
  
  if (permissions.length === 0) {
    redirect('/demand-acess');
  }

  return (
    <>
    <div className="w-full h-11 text-white bg-primary flex justify-center items-center">
        <span className='text-sm'>TGCC Lines est encore en phase MVP. Pour toute nouvelle fonctionnalité ou demande d’évolution, veuillez contacter ahmed.hallouf@tgcc.ma </span>
      </div>
    <div className='grid grid-cols-[270px_1fr] h-dvh overflow-hidden'>
      
      <Sidebar/>
      <ScrollArea className="w-full p-2 bg-white flex flex-col h-dvh">
                <Navbar/>
        
        {children}
      </ScrollArea>
    </div>
    </>
  )
}

export default layout
