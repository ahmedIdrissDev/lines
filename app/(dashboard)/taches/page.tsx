'use client'
import Alert from '@/components/kits/alert'
import Mail from '@/components/kits/mail'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const page = () => {
  const data = useQuery(api.functions.login.getUsers)
  console.log(data)
  return (
       <>
       <Alert/>

       </>

  )
}

export default page
