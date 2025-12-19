'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { store } from '@/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserPen } from 'lucide-react'
import Hr from '../Hr'
import Search from '../search'
import PDF from '../kits/pdf'
import Moderh from '../kits/hrmode'
import ProjectSelect from '../project'

const Navbar = () => {
  const {data } = useSession()
  const auth = ['HR' , 'ADMIN']
  const isincluds = new Set(auth.map((role)=> role))
  const isAuthorize = isincluds.has(data?.user?.role)
  const route = useRouter()
  return (
    <div className='flex  px-3 md:px-6 h-12 justify-end items-center w-full'>
    <div className=" flex items-center gap-2.5">
     <Hr/>
      <Search/>
      <PDF/>
              <ProjectSelect></ProjectSelect>
      <button onClick={()=> route.push("/dashboard/add") } className='cursor-pointer h-11  px-3'> <UserPen/></button>
      {isAuthorize &&    <Moderh/> }

    </div>
    </div>
  )
}

export default Navbar
