'use client'
import { ArrowUp, Paperclip } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
interface FormProps{
    handlefrom:(e:FormEvent<HTMLFormElement> , files?:FileList)=> void  

}

const Form = ({handlefrom}:FormProps) => {
      const [files, setFiles] = useState<FileList | undefined>(undefined);
  return (
    <form onSubmit={e=> handlefrom(e , files) } className='w-full p-1 h-30 rounded-2xl bg-tgcc-50 border border-tgcc-400'>
      <input name="text"type='text' className='w-full h-[50%] outline-0 resize-none'  placeholder='asking about something ' id=""/>
      <div className="flex justify-end gap-2 items-center">
      <label htmlFor="file">
         <Paperclip/>
      </label>
      <input multiple onChange={e=>{
                    if (e.target.files) {
              setFiles(e.target.files);
            }
      }} type="file" name='file' hidden id='file' />
      <button className='w-9 h-9 bg-black rounded-full text-white flex justify-center items-center'><ArrowUp/></button>
      </div>
    </form>
  )
}

export default Form
