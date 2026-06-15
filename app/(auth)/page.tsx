"use client";
import Logo from "@/components/ui/logo";
import { useRouter } from "next/navigation";

export default function Home() {
  const rouet = useRouter()
  const SignIn=()=> rouet.push('/sign-in')
  return (
    
    <div className="flex flex-col justify-center items-center p-6  w-96 bg rounded-2xl border border-hairline shadow-sm">
      <div className="mb-8 text-center flex flex-col items-center">
        <Logo />
        <p className="text-sm text-ash mt-2">Lines est un outil collaboratif de gestion des ressources humaines.</p>
      </div>
        <button onClick={SignIn} className="w-full cursor-pointer h-11 rounded-md bg-primary text-white">
          Continuer
        </button>
      
      
    </div>
  );
}
