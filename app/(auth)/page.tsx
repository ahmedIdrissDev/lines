'use client'
import Image from "next/image";
import Link from "next/link";
import {signIn} from 'next-auth/react'
export default function Home() {
  return (
   <div className="flex justify-center items-center w-full h-dvh">
     <div className="w-90 flex  p-3 justify-center items-center gap-2 flex-col h-90 rounded-2xl">

<div className="flex justify-center items-center">
   <Image src={'/icon.png'} width={1000} height={1000} className="w-20" alt="logo" />
    
</div>
      <div className="text-center">
        <h1 className="text-2xl">TGCC My Team</h1>
        <p>Smart HR Management Platform </p>
      </div>
        <button onClick={()=> signIn('google')} className="w-full flex  gap-2 justify-center items-center h-12 border border-neutral-200     rounded-2xl cursor-pointer">
                  <Image src={'/google.png'} className="w-7" width={400} height={400} alt='logo' />
                  <span>continue avec google</span>
          </button>
     </div>
   </div>

  );
}
