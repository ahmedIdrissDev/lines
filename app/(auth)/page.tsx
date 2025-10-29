import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
export default function Home() {
  return (
   <div className="flex justify-center items-center w-full h-dvh">
     <div className="w-90 flex  p-3 justify-center items-center gap-2 flex-col h-90 rounded-2xl">

<div className="flex justify-center items-center">

<svg className="w-30" width="52" height="51" viewBox="0 0 132 131" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 30.9V129.5H47.6V63.8H14.7V47.2H97.2V63.8H64.7V129.5H106.3V0L7 30.9Z" fill="#5733FA"/>
</svg>
</div>
      <div className="text-center">
        <h1 className="text-2xl">TGCC My Team</h1>
        <p>Smart HR Management Platform </p>
      </div>
        <Link href={'/dashboard'} className="w-full flex justify-center items-center h-11 bg-tgcc-700 text-white rounded-2xl cursor-pointer">continue</Link>
        <span className="text-tgcc-900 underline">learn more about this app</span>
     </div>
   </div>
  );
}
