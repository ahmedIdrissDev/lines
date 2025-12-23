"use client";
import Image from "next/image";

import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import * as z from "zod";
export default function Home() {

  const { status } = useSession();
  const [errors , seterrors] = useState<Boolean>(false)
  const [type , setType]= useState('password')

  function handleChange(){
        type==='password'  ?  setType('text') : setType('password') 
  }

   useEffect(()=>{
     if(status=='authenticated'){
        redirect('/dashboard')
     }
   } ,[])
   
  const User = z.object({
  email: z.email(),
  password: z.string().regex(/^[a-z0-9]{6,20}$/,{message:'error '}).min(7).max(10)
});

 async function login(e:FormEvent<HTMLFormElement>){
           e.preventDefault()
           const formdata = new FormData(e.currentTarget)
           const data =  Object.fromEntries(formdata.entries())
           const res =  await signIn('credentials' ,{...data , redirect:false })
           console.log(res?.error)
           if(res?.error){
               seterrors(true)
           }
           if(res?.ok){
              seterrors(false)
              redirect('/dashboard')
           }
  }
  return (
    <div className="flex justify-center border border-neutral-200 items-center p-3 w-96 h-max bg-white rounded-xl">
      <div className=" w-full  relative  border-tgcc-500/15  flex gap-3  p-3 justify-center items-center flex-col min-h-96 rounded-none">
      
        <div className="flex  justify-center items-center">
          <Image
            src={"/icon.svg"}
            width={1000}
            height={1000}
            className="w-9
             object-cover"
            alt="logo"
          />
        </div>
        <div className="text-center">
          <h1 className="text-3xl">tgcc workspace</h1>
          <p className="text-sm">Plateforme intelligente de gestion de projets </p>
        </div>
        {errors && 
          <div className="flex justify-center items-center text-red-500">
            <p>Oups ! Une erreur s’est produite. Veuillez réessayer</p>
          </div>
        }
        
        {status == "unauthenticated" && (
          <>
            <form onSubmit={login} className="w-full flex gap-2 flex-col" action="">
              <input
                className="w-full h-11 rounded-xl outline-0 focus:outline-1 focus:outline-tgcc-500 border border-neutral-200 px-2"
                type="text"
                required
                name="email"
                placeholder="email "
              />
               <input
                className="w-full h-11 rounded-xl outline-0 focus:outline-1 focus:outline-tgcc-500 border border-neutral-200 px-2"
                type={type}
                required
                name="password"
                placeholder="mot de passe"
              />
              <div className="flex items-center gap-2">
                <input className="accent-tgcc-400 rounded-xl border border-neutral-200" onChange={handleChange} type="checkbox" name="" id="" />
                <span className="text-sm opacity-90">Afficher le mot de passe</span>
              </div>
              <button className="h-12 cursor-pointer w-full bg-tgcc-600 border-t-2 border-tgcc-500 text-white rounded-xl">
                login
              </button>
            </form>
            <div className="flex  w-full justify-between gap-2 items-center">
              <div className="border-b w-full border-neutral-200" />
              <span className="opacity-70">or</span>
              <div className="border-b w-full border-neutral-200" />
            </div>
            <button
              onClick={() =>
                signIn("google", { redirect: true, callbackUrl: "/dashboard" })
              }
              className="w-full flex  py-2 px-1 gap-2 justify-center items-center h-11 border border-neutral-200     rounded-xl cursor-pointer"
            >
              <Image
                src={"/google.png"}
                className="w-7"
                width={400}
                height={400}
                alt="logo"
              />

              <span>Connexion avec Google</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
