'use client'
import AI from '@/components/ai'
import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import { EffectifGeneral } from '@/components/kits/ParMonth'
import { store } from '@/store'
const page = () => {
  const {data} = store()
  if(!data) return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-1">
       <div className="w-full h-60 bg-neutral-300"></div>
       <div className="w-full h-60 bg-neutral-300"></div>
       <div className="w-full h-60 bg-neutral-300"></div>


      </div>
    </div>
  )
  return (
   <>
         <AI/>
         <Chat/>
         <EffectifGeneral/>
         <Employees/> 
   </>
  )
}

export default page
