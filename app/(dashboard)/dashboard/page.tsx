'use client'
import AI from '@/components/ai'
import Chat from '@/components/Chat'
import Employees from '@/components/employees'
import Title from '@/components/section'
import Super from '@/components/super'
import { api } from '@/convex/_generated/api'
import { useQuery } from "convex/react";

const page = () => {
   const users = useQuery(api.function.login.get);
   console.log(users)
  return (
   <>
   {/* <div className="w-60   flex justify-center items-center h-60 relative">
   <svg className='w-50  inset-0' width="451" height="484" viewBox="0 0 451 484" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M447 4V480H4V137.552H173C176.866 137.552 180 134.418 180 130.552V4H447Z" fill="#C8FE36" fill-opacity="0.35" stroke="#D0FF00" stroke-width="8"/>
</svg>
<p className='absolute'>Zon A2</p>
   </div> */}
<AI/>
         <Chat/>
         <Super/>
<Employees/> 
   </>
  )
}

export default page
