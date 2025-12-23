'use client'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { store } from '@/store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, UserPen } from 'lucide-react'
import Hr from '../Hr'
import Search from '../search'
import PDF from '../kits/pdf'
import Moderh from '../kits/hrmode'
import ProjectSelect from '../project'
import Profile from '../users/profile'
import PopoverUI from '../users/ui/popover'

const Navbar = () => {
  const {data } = useSession()
  const auth = ['HR' , 'ADMIN']
  const isincluds = new Set(auth.map((role)=> role))
  const isAuthorize = isincluds.has(data?.user?.role)
  const route = useRouter()
  return (
    <div className='flex  rounded-xl  px-3 md:px-6 h-12 justify-end items-center w-full'>
    <div className=" flex items-center gap-2.5">
     <Hr/>
     <Moderh/>
     <ProjectSelect/>
      <Search/>
      <PDF/>
      <PopoverUI/>
    </div>
    </div>
  )
}

export default Navbar
