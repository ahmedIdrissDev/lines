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
interface Proejct{
  _id:string ,
  name:string
}
const Project = () => {
  const {data:users} = useSession()
  const {setdata , data} = store()
  const project = users?.user?.project as Proejct[]
  return (
   <Select  >
  <SelectTrigger className="w-12 md:w-[180px] bg-white">
    <SelectValue placeholder={project[0].name as string } />
  </SelectTrigger>
  <SelectContent>
    {project.map(({_id ,name} )=>(
      <SelectItem key={_id} value={_id} >{name} </SelectItem>
    ))}

  </SelectContent>
</Select>
  )
}

export default Project
