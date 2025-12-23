'use client'
import { Camera } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import PopoverUI from './ui/popover'

const Profile = () => {
  const {data} = useSession()
  return (

  <></>
  )
}

export default Profile