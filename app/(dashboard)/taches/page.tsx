'use client'
import Alert from '@/components/kits/alert'
import Mail from '@/components/kits/mail'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

const page = () => {
  const data = useQuery(api.functions.login.getUsers)
  console.log(data)
  return (
       <>
       <div className="w-full h-"></div>
       <Alert/>

       </>

  )
}

export default page
