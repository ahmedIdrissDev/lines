import Image from "next/image";
import { SignInButton } from "@clerk/nextjs";
export default function Home() {
  return (
   <div className="flex justify-center items-center w-full h-dvh">
     <div className="w-90 flex border border-neutral-200 p-3 justify-center items-center gap-2 flex-col h-90 rounded-2xl">


<svg className="w-30" width="402" height="51" viewBox="0 0 402 131" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M401.1 69.9568V55H335.3H318V69.9568V115.01V130.058H335.3H401.1V115.01H335.3V69.9568H401.1Z" fill="black"/>
<path d="M300.1 69.9568V55H234.4H217V69.9568V115.01V130.058H234.4H300.1V115.01H234.4V69.9568H300.1Z" fill="black"/>
<path d="M133.5 115.01V69.9568H199.3V55H133.5H117V69.9568V115.01V130.058H133.5H182.8H199.3V115.01V99.9616V85.0048V84.9136H182.8V85.0048H149.8V99.9616H182.8V115.01H133.5Z" fill="black"/>
<path d="M7 30.9V129.5H47.6V63.8H14.7V47.2H97.2V63.8H64.7V129.5H106.3V0L7 30.9Z" fill="#5733FA"/>
</svg>
      <div className="text-center">
        <h1 className="text-2xl">TGCC My Team</h1>
        <p>Smart HR Management Platform </p>
      </div>
        <button className="w-full h-11 bg-tgcc-700 text-white rounded-2xl cursor-pointer">continue</button>
        <span className="text-tgcc-900 underline">learn more about this app</span>
     </div>
   </div>
  );
}
