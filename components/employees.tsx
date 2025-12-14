'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { store } from '@/store';


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
      <TableHead>Project</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
      {
        data.map(({Matricule ,Project ,function:fun ,status ,firstname ,lastname} , index)=>(
         <TableRow key={index}>
      <TableCell className="font-medium">{Matricule} </TableCell>
      <TableCell>{fun} </TableCell>
      <TableCell>{firstname} </TableCell>
      <TableCell>{lastname} </TableCell>
      <TableCell>{status==='active' ? <div className='h-3 w-3 bg-amber-400  rounded-full'/>:<div className='h-3 w-3 bg-neutral-500  rounded-full'/>} </TableCell>
      <TableCell>{Project} </TableCell>
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
