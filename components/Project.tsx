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

const Project = () => {
  const {setProject} = store()
  return (
   <Select onValueChange={e=>setProject(e)}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Project" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">CHU RABAT</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
  )
}

export default Project
