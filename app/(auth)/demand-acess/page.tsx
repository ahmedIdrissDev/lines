import Image from 'next/image'
import React from 'react'
import Logo from '@/components/ui/logo'

const page = () => {
  return (
    <div className='flex flex-col justify-center items-center p-6 w-96 bg rounded-2xl border border-hairline shadow-sm'>
       <div className="mb-8 text-center flex flex-col items-center">
        <Logo />
        <h1 className='text-xl mt-4'>Accès Restreint</h1>
        <p className='text-sm text-ash mt-2 text-center'>
          Vous n'avez pas encore les permissions nécessaires pour accéder à la plateforme.
        </p>
      </div>
       
       <div className='w-full p-4 rounded-lg bg-primary/5 border border-primary/10 text-center'>
          <p className='text-sm text-ink'>
            Pour demander un accès, veuillez contacter :
          </p>
          <a 
            href="mailto:ahmed.hallouf@tgcc.ma" 
            className='text-primary font-medium hover:underline block mt-1'
          >
            ahmed.hallouf@tgcc.ma
          </a>
       </div>
       
       <a href="/sign-in" className="w-full mt-6 text-center text-sm text-ash hover:text-ink transition-colors">
         Retour à la connexion
       </a>
    </div>
  )
}

export default page
