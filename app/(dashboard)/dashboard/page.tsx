import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import { EffectifGeneral } from '@/components/charts/General'
import Super from '@/components/super'
const page = () => {
  
  return (
   <>
         <Chat/>
         <EffectifGeneral/>
         <Super/> 
   </>
  )
}

export default page
