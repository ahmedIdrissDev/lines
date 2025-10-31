'use client'
import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { store } from '@/store';
import { Employee } from '@/types';



const Employees = () => {
  const [employee , setemployess] = useState< Employee[] >()
  const  {setdata ,data} = store()

  useEffect(()=>{
   (async()=>{
    try {
      const response = await fetch('https://sheetdb.io/api/v1/s6vt0lc3cghvn',{cache:'no-cache'});
      const data = await response.json()
      setdata(data)
    } catch (error) {
      console.log(error)
    }
  
   })()
  } ,[])
  const grup = Object.groupBy(data , ({lot})=> lot)  
  const key = Object.keys(grup)
  console.log(key)
  
  return (
    <>
    <div className="border bg-white border-neutral-200 rounded-2xl">
    <Table className=''>
  <TableHeader>
    <TableRow className=''>
      <TableHead className="w-[100px]">Registration number</TableHead>
      <TableHead>function</TableHead>
      <TableHead>first name</TableHead>
      <TableHead>last name</TableHead>

      <TableHead>Status</TableHead>
      <TableHead className="text-right">Project</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
      {
        data?.map(({Matricule ,Project ,function:fun ,status ,firstname ,lastname} , index)=>(
         <TableRow key={index}>
      <TableCell className="font-medium">{Matricule} </TableCell>
      <TableCell>{fun} </TableCell>
      <TableCell>{firstname} </TableCell>
      <TableCell>{lastname} </TableCell>
      <TableCell>{status==='active' ? <div className='w-max px-2  bg-tgcc-100/10 border text-tgcc-950 border-tgcc-800 rounded-full'>Present</div>:<div className='w-max px-2  bg-neutral-100/10 border text-neutral-700 border-neutral-800 rounded-full'>Absent</div>} </TableCell>
      <TableCell className="text-right">{Project} </TableCell>
    </TableRow>

        ))
      }
    
    
  </TableBody>
</Table>
    </div>
    </>
  )
}

export default Employees
