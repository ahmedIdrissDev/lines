'use client'
import { User, UserRoundPlus } from 'lucide-react'
import React, { FormEvent, useState } from 'react'

const Add = () => {
  const [open , setOpen ]  = useState(false)
  const openclose = ()=> open ? setOpen(false) : setOpen(true)
  async function HendleAddEmployes(e:FormEvent<HTMLFormElement>) {
         e.preventDefault()
         const  fromdata = new FormData(e.currentTarget)
         const data = {
              Matricule: fromdata.get('Matricule') || 'hajhajs' ,
  Project: fromdata.get('Matricule') || 'hajhajs'  ,
  Responsable: fromdata.get('Responsable') || 'hajhajs'  ,// could be 'TRUE' | 'FALSE' if it's always like that
  fullname:fromdata.get('fullname') || 'hajhajs' ,
  function: fromdata.get('function') || 'hajhajs'  ,
  id:'873487384734' ,
  status:true
         } 
   const response = await fetch('https://sheetdb.io/api/v1/s6vt0lc3cghvn',
    {
      method:'POST' ,
      body:JSON.stringify(data) ,
      headers:{
        'Content-Type':'application/json'
      }
    }
  );
      const req = await response.json()
               try {
          
         } catch (error) {
          
         }
  }
  return (
    <>
            <button onClick={openclose} className='w-30 hidden cursor-pointer rounded-md  md:flex justify-center items-center gap-1.5 h-9 bg-tgcc-700 text-white'>
            <UserRoundPlus/>
            <span> Employee </span>
        </button>
        {
          open && 
          <div className="w-full fixed z-20 bg-neutral-900/5 flex justify-center items-center inset-0">
            <div className="bg-white flex flex-col gap-1.5  p-2 w-1/2 h-1/2 rounded-2xl">
              <h1>Add new </h1>
              <form className='flex flex-col gap-2' onSubmit={HendleAddEmployes}>
                <input className='input' type="text" placeholder='Code' />
                <input className='input' type="text" placeholder='Full name' />
                <input className='input' type="text" placeholder='function' />
                <input className='input' type="text" placeholder='status' />
            <input list="fruits" id="fruit" className='input' name="fruit" />

<datalist id="fruits">
  <option value="Apple">Ads Acess</option>
  <option value="Apple">Ads Acess</option>
  <option value="Apple">Ads Acess</option>
  <option value="Apple">Ads Acess</option>

</datalist>
   <button className='w-full h-11 bg-blue-700 text-white rounded-2xl '>Add new Employee</button>
              </form>
            </div>
          </div>
        }
    </>

  )
}

export default Add
