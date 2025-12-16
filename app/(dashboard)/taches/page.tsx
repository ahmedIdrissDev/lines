'use client'
import Alert from '@/components/kits/alert'
import Mail from '@/components/kits/mail'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import Link from 'next/link'

const page = () => {
  const data = useQuery(api.functions.login.getUsers)
  return (
      <></>

  )
}

export default page
