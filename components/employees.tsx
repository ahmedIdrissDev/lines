'use client'
import React, { useEffect, useEffectEvent, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { store } from '@/store';
import { Employee, Proejct } from '@/types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { getToday, handlePresentsUpdate } from '@/utils';
import { useSession } from 'next-auth/react';



const Employees = () => {
  const  {data} = store()
  
  
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
    </TableRow>
  </TableHeader>
  <TableBody>
      {
        data.splice(0 , 20)?.map(({Matricule ,Project ,function:fun ,status ,firstname ,lastname} , index)=>(
         <TableRow key={index}>
      <TableCell className="font-medium">{Matricule} </TableCell>
      <TableCell>{fun} </TableCell>
      <TableCell>{firstname} </TableCell>
      <TableCell>{lastname} </TableCell>
      <TableCell>{status==='active' ? <div className='w-max px-2  bg-tgcc-100/10 border text-tgcc-950 border-tgcc-800 rounded-full'>Present</div>:<div className='w-max px-2  bg-neutral-100/10 border text-neutral-700 border-neutral-800 rounded-full'>Absent</div>} </TableCell>
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
