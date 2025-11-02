import { ArrowUp, Paperclip } from 'lucide-react'
import React, { FormEvent } from 'react'
interface FormProps{
    handlefrom:(e:FormEvent<HTMLFormElement>)=> void 
}
const Form = ({handlefrom}:FormProps) => {
  return (
    <form onSubmit={handlefrom} className='w-full p-1 h-30 rounded-2xl bg-tgcc-50 border border-tgcc-400'>
      <input name="text"type='text' className='w-full h-[50%] outline-0 resize-none'  placeholder='asking about something ' id=""/>
      <div className="flex justify-end gap-2 items-center">
      <label htmlFor="file">
         <Paperclip/>
      </label>
      <input type="file" name='file' hidden id='file' />
      <button className='w-9 h-9 bg-black rounded-full text-white flex justify-center items-center'><ArrowUp/></button>
      </div>
    </form>
  )
}

export default Form
