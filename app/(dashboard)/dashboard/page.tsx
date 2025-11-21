'use client'
import AI from '@/components/ai'
import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import Super from '@/components/super'
import { api } from '@/convex/_generated/api'
import { useQuery } from "convex/react";

const page = () => {
   const users = useQuery(api.functions.login.get);
   console.log('users',users)

   
  return (
   <>
   
<AI/>
         <Chat/>
         <Super/>
<Employees/> 
   </>
  )
}

export default page
