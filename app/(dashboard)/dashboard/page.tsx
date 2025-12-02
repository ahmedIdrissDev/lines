import AI from '@/components/ai'
import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import { EffectifGeneral } from '@/components/charts/General'
import Title from '@/components/section'
import Super from '@/components/super'
import { store } from '@/store'
const page = () => {
  
  return (
   <>
         <AI/>
         <Chat/>
         <EffectifGeneral/>
         
         <Super/> 
         <Employees/>
   </>
  )
}

export default page
