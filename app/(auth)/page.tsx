"use client";
import { SignIn } from "@clerk/nextjs";
import Logo from "@/components/ui/logo";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center p-6 w-full max-w-md bg-white rounded-2xl border border-hairline shadow-sm">
      <div className="mb-8 text-center flex flex-col items-center">
        <Logo />
        <p className="text-sm text-ash mt-2">Plateforme intelligente de gestion de projets</p>
      </div>
      
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border-none p-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            footer: "hidden",
            formButtonPrimary: "bg-primary hover:bg-primary-deep text-sm h-11 rounded-full",
            formFieldInput: "rounded-full border-hairline h-11",
            dividerRow: "hidden",
            socialButtonsBlockButton: "hidden",
          }
        }}
      />
    </div>
  );
}
