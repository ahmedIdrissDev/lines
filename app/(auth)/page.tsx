import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
export default function Home() {
  return (
   <div className="flex justify-center items-center w-full h-dvh">
     <div className="w-90 flex border border-neutral-200 p-3 justify-center items-center gap-2 flex-col h-90 rounded-2xl">
<svg className="w-16" width="100" height="130" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 30.9V129.5H40.6V63.8H7.7V47.2H90.2V63.8H57.7V129.5H99.3V0L0 30.9Z" fill="#771717"/>
</svg>


      <div className="text-center">
        <h1 className="text-2xl">TGCC Teams</h1>
        <p>Smart HR Management Platform </p>
      </div>
        <button className="w-full h-11 bg-tgcc-700 text-white rounded-2xl cursor-pointer">continue</button>
        <span className="text-tgcc-900 underline">learn more about this app</span>
     </div>
   </div>
  );
}
