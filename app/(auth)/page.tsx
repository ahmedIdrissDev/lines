import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
export default function Home() {
  return (
   <div className="flex justify-center items-center w-full h-dvh">
     <div className="w-90 flex  p-3 justify-center items-center gap-2 flex-col h-90 rounded-2xl">

<div className="flex justify-center items-center">

     <svg width="39" height="51" viewBox="0 0 39 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 12.0298V50.416H15.8061V24.8382H2.99771V18.3756H35.116V24.8382H22.4634V50.416H38.6588V0L0 12.0298Z" fill="url(#paint0_linear_128_9)"/>
<defs>
<linearGradient id="paint0_linear_128_9" x1="19.3294" y1="-4.49519e-07" x2="39" y2="50" gradientUnits="userSpaceOnUse">
<stop stop-color="#461704"/>
<stop offset="1" stop-color="#AC390A"/>
</linearGradient>
</defs>
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
