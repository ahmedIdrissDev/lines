'use client'
import React, { useEffect, useState } from 'react'

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
    <div className='w-full py-3 flex flex-col space-y-2 h-dvh'>
      <div className="w-full h-full p-2.5 rounded-2xl border border-neutral-200">
      {
        employee?.map(({Matricule ,Project ,function:fun ,status ,fullname} , index)=>(
          <div key={index} className="w-full px-3 flex justify-between items-center border border-neutral-100 h-10 rounded-md">
            <span>{Matricule} </span>
            <span>{fullname} </span>


            <span>{fun} </span>
            <span className='bg-green-300 rounded-full px-1.5'>{status} </span>
            <span>{Project} </span>



          </div>

        ))
      }
    
      </div>

    </div>
  )
}

export default Employees
