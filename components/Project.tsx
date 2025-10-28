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

const Project = () => {
  const {setdata , data} = store()
  const selectProject= async (e:string)=>{
    try {
      
      const response = await fetch('https://sheetdb.io/api/v1/s6vt0lc3cghvn',{cache:'no-cache'});
 const data:Employee[] = await response.json()
    const newArrayFromSelected = data.filter(({Project})=>Project.toLocaleUpperCase().trim()===e.toLocaleUpperCase().trim())
    console.log(newArrayFromSelected)
    setdata(newArrayFromSelected)
    } catch (error) {
        console.log(error)
    }
  }
  return (
   <Select onValueChange={selectProject}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Project" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="CHU RABAT">CHU RABAT</SelectItem>
    <SelectItem value="JINAN ">JINAN </SelectItem>

  </SelectContent>
</Select>
  )
}

export default Project
