'use client'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { store } from '@/store'
import { Employee } from '@/types'
import { useSession } from 'next-auth/react'

const Project = () => {
  const {data:users} = useSession()
  const {setdata , data} = store()
  return (
   <Select  >
  <SelectTrigger className="w-12 md:w-[180px] bg-white">
    <SelectValue placeholder={users?.user?.project} />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CHU RABAT">CHU RABAT</SelectItem>
    <SelectItem value="JINAN ">JINAN </SelectItem>

  </SelectContent>
</Select>
  )
}

export default Project
