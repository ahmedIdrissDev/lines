"use client";
import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { FormEvent } from "react";
export default function Home() {
  const { status } = useSession();
  function login(e:FormEvent<HTMLFormElement>){
           e.preventDefault()
           const formdata = new FormData(e.currentTarget)
           const data =  Object.fromEntries(formdata.entries())
           signIn('credentials' ,{...data , redirect:true , callbackUrl:'/dashboard'})
  }
  return (
    <div className="flex justify-center items-center w-full h-dvh">
      <div className=" w-full md:w-[70%] flex  p-3 justify-center items-center gap-2 flex-col h-96 rounded-2xl">
        <div className="flex justify-center items-center">
          <Image
            src={"/icon.png"}
            width={1000}
            height={1000}
            className="w-20 object-cover"
            alt="logo"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl">Tgcc teams</h1>
          <p className="text-sm">Plateforme intelligente de gestion des ressources humaines </p>
        </div>
        {status == "authenticated" && (
          <>
            <Link
              href={"/dashboard"}
              className="h-11 cursor-pointer flex justify-center items-center w-full bg-tgcc-700 text-white rounded-md"
            >
              <span>Dashboard</span>
            </Link>
          </>
        )}
        {status == "unauthenticated" && (
          <>
            <form onSubmit={login} className="w-full flex gap-2 flex-col" action="">
              <input
                className="w-full h-11 rounded-xl outline-0 focus:outline-1 focus:outline-tgcc-500 border border-neutral-200 px-2"
                type="email"
                required
                name="email"
                placeholder="email "
              />
               <input
                className="w-full h-11 rounded-xl outline-0 focus:outline-1 focus:outline-tgcc-500 border border-neutral-200 px-2"
                type="password"
                required
                name="password"
                placeholder=" Mode de pass"
              />
              <button className="h-11 cursor-pointer w-full bg-tgcc-700 text-white rounded-xl">
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
