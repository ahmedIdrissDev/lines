'use client'
import { useSession } from 'next-auth/react';
import React from 'react'

const AddEmployees = () => {
     const { data: users } = useSession();
         const project = users?.user?.project as Proejct[];
  return (
    <div className='flex justify-center items-center h-dvh' >
          <form className="w-1/2  flex flex-col gap-2 h-max p-2 bg-white rounded-2xl">
             <div className="flex flex-col gap-2 ">
                  <span className='text-sm opacity-70'>Matricule</span>
                  <input type="number" name="Matricule" id="" className="input" />
             </div>
             <div className="flex flex-col gap-2 ">
                  <span className='text-sm opacity-70'>Prénom</span>
                  <input type="text" name="firstname" id="" className="input" />
             </div>
             <div className="flex flex-col gap-2 ">
                  <span className='text-sm opacity-70'>Nom</span>
                  <input type="text" name="lastname" id="" className="input" />
             </div>
             <div className="flex flex-col gap-2 ">
                  <span className='text-sm opacity-70'>function</span>
                  <input type="text" name="function" id="" className="input" />
             </div>
             <div className="flex flex-col gap-2 ">
                  <span className='text-sm opacity-70'>Responsable de site</span>
                  <input type="text" name="siteManger" id="" className="input" />
             </div>
             <div className="flex flex-col gap-2 ">
                  <span className='text-sm opacity-70'>chaniter</span>
                  <select name="" className='input' >
                    {project.map(({_id , name})=>(
                         <option value={_id} >{name} </option>

                    ))}
                  </select>
             </div>
             
             <button type="submit" className='w-full h-11 bg-tgcc-500 text-white rounded-md'>add new</button>
          </form>
    </div>
  )
}

export default AddEmployees