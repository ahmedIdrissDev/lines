'use client'
import AI from '@/components/ai'
import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import { EffectifGeneral } from '@/components/kits/ParMonth'
const page = () => {

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
