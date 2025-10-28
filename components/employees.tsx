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

interface Employee {
  Matricule: string;
  Project: string;
  Responsable: string; // could be 'TRUE' | 'FALSE' if it's always like that
  fullname: string;
  function: string;
  id: string; // removed extra space from key "id "
  status: 'active' | 'inactive'; // assuming limited status options
}

const Employees = () => {
  const [employee , setemployess] = useState< Employee[] >()
  useEffect(()=>{
   (async()=>{
    try {
      const response = await fetch('https://sheetdb.io/api/v1/s6vt0lc3cghvn',{cache:'no-cache'});
      const data = await response.json()
      // console.log(data)
      setemployess(data)
    } catch (error) {
        console.log(error)
    }
  
   })()
  } ,[])
  console.log(employee)
  return (
    <>
    <div className="border border-neutral-200 rounded-2xl">
    <Table className=''>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Matricule</TableHead>
      <TableHead>function</TableHead>
      <TableHead>status</TableHead>
      <TableHead className="text-right">Project</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
      {
        employee?.map(({Matricule ,Project ,function:fun ,status ,fullname} , index)=>(
         <TableRow>
      <TableCell className="font-medium">{Matricule} </TableCell>
      <TableCell>{fun} </TableCell>
      <TableCell>{fullname} </TableCell>
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
