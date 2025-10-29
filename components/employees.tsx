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
  console.log('data from zustand ', data)
  useEffect(()=>{
   (async()=>{
    try {
      const response = await fetch('https://sheetdb.io/api/v1/s6vt0lc3cghvn',{cache:'no-cache'});
      const data = await response.json()
      // console.log(data)
      setdata(data)
    } catch (error) {
    }
  
   })()
  } ,[])
  return (
    <>
    <div className="border border-neutral-200 rounded-2xl">
    <Table className=''>
  <TableHeader>
    <TableRow className=''>
      <TableHead className="w-[100px]">Registration number</TableHead>
      <TableHead>function</TableHead>
      <TableHead>Full name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Project</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
      {
        data?.map(({Matricule ,Project ,function:fun ,status ,fullname} , index)=>(
         <TableRow key={index}>
      <TableCell className="font-medium">{Matricule} </TableCell>
      <TableCell>{fun} </TableCell>
      <TableCell>{fullname} </TableCell>
      <TableCell>{status==='active' ? <div className='w-3 h-3 bg-green-400 rounded-full'></div>:<span className='w-3 h-3 bg-yellow-400 rounded-full'>j</span>} </TableCell>

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
