"use client"
import { store } from '@/store';
import { Repeat, SearchIcon, X } from 'lucide-react'
import { AnimatePresence  , motion} from 'motion/react'
import { useState } from 'react';

const Search = () => {
  const [open, setOpen] = useState(false);
  const [openEmployee , setopenEmployee] = useState(false)
  const [func , setfunction] = useState(false)
      const openclose = ()=> open ? setOpen(false) : setOpen(true)
      const setfunctions = ()=> func ? setfunction(false) : setfunction(true)

      const HendleOpenEmployee = ()=> openEmployee ? setopenEmployee(false) : setopenEmployee(true)
 
      const [text , settext]= useState('')
      const {data} = store()
      const result = func ?  data.filter(item=> item.function?.toLocaleLowerCase().startsWith(text.toLocaleLowerCase())  ) : data.filter(item=> item.Matricule?.toString().toLocaleLowerCase().startsWith(text.toLocaleLowerCase())  )
  return (
    <>
     <button onClick={openclose} className='  px-2  text-white    cursor-pointer  justify-center  flex w-10  items-center gap-1.5 h-10 bg-neutral-950'>
            <SearchIcon className=''/>
        </button>
    <AnimatePresence>
        {open && (
          <div
            className="w-full   fixed z-20 bg-neutral-900/10 flex justify-center items-center inset-0"
          >
            <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }} className=" gap-2 flex h-max  flex-col p-4 w-full md:w-1/2  rounded-md ">
              <motion.div 
                          layout
    
                            layoutId='input'

              className="w-full flex justify-between items-center px-2 h-12 bg-white border border-neutral-200 rounded-md ">
                <input type="text" onInput={e=> settext(e.currentTarget.value)} className='outline-0 border-0 w-full h-full' autoFocus placeholder='Trouver des employés' />
                <X onClick={openclose} className='scale-75 opacity-70 cursor-pointer'/>
              </motion.div>
              {text && 
              
             <motion.div
              layout
              layoutId='result'
              initial={{ scale: 0.9, opacity: 0 , translateY:-6 }}
            animate={{ scale: 1, opacity: 1 , translateY:0}}
            exit={{ scale: 0.9, opacity: 0 , translateY:-6 }} 
             
             className="w-full flex flex-col gap-2 p-2 min-h-96 bg-neutral-900 text-white border border-neutral-200/0 rounded-md ">
              <div className="w-full p-2.5 flex items-center gap-1 h-11 border bg-neutral-800 border-neutral-200/5 rounded-md">
                  <span>Résumé des effectifs par </span>

                  <button onClick={setfunctions} className='w-30 flex items-center justify-center gap-2 h-7 bg-neutral-900 text-white rounded-md cursor-pointer'>
                    <Repeat size={16}/>
                   {func ? 'function':'Matricule'}
                  </button> 
                  <button className='w-7 h-7 rounded-md border border-neutral-100/5'>
                {result.length}

                  </button>
              </div>
              {result.splice(0 , 8) .map(({firstname , Matricule , function:fun  , lastname , status , siteManger} , index)=>(

                <div key={index} className="flex items-center  gap-2">
                  <img  onClick={HendleOpenEmployee} src={'/avatar.png'} className='w-9 border border-neutral-200 bg-white h-9 rounded-full cursor-pointer' />
                  <div className="flex items-center gap-1.5">
                  <span>{firstname.toLocaleLowerCase()}  {lastname.toLocaleLowerCase() }  </span>
                  <span  className='w-max px-2  bg-tgcc-100/10 border text-tgcc-100 border-tgcc-800/5 text-sm cursor-pointer  rounded-full  '>{fun}    </span>
                        <p>{status==='active' ? <div className='w-max px-2  bg-tgcc-100/10 border text-tgcc-400 border-tgcc-800 rounded-full'>Present</div>:<div className='w-max px-2  bg-neutral-100/10 border text-neutral-700 border-neutral-800 rounded-full'>Absent</div>} </p>
                  </div>
                  <AnimatePresence>


                  {
                    openEmployee && 

                <div className="fixed inset-0 p-4 bg-neutral-950/5 flex justify-center items-center">

                  <motion.div
                  layout
              layoutId='profile'
              initial={{ scale: 0.9, opacity: 0 , translateY:-6 }}
            animate={{ scale: 1, opacity: 1 , translateY:0}}
            exit={{ scale: 0.9, opacity: 0 , translateY:-6 }} 
                  
                  className="w-full md:w-1/2 flex flex-col gap-2 h-1/2 bg-white p-3 rounded-2xl">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-1">
                                    <img  onClick={HendleOpenEmployee} src={'/avatar.png'} className='w-9 border border-neutral-200 bg-white h-9 rounded-full cursor-pointer' />
                    <h1>         {firstname.toLocaleLowerCase()}  {lastname.toLocaleLowerCase() }  </h1>

                    </div>
                                 <X onClick={HendleOpenEmployee} className='scale-75 opacity-70 cursor-pointer'/>

                  </div>
                  <div className="flex flex-col gap-1.5">
                                        <span className='w-max text-sm cursor-pointer p-1.5 bg-tgcc-200 rounded-full  '> function : {fun}    </span>
                                        <span>Matricule: {Matricule} </span>
                                        <p>{status==='active' ? <div className='w-max px-2  bg-tgcc-100/10 border text-tgcc-950 border-tgcc-800 rounded-full'>Present</div>:<div className='w-max px-2  bg-neutral-100/10 border text-neutral-700 border-neutral-800 rounded-full'>Absent</div>} </p>
                                                                                                        <span className='w-max text-sm cursor-pointer p-1.5 bg-tgcc-200 rounded-full  '>{siteManger}    </span>
                  </div>

                  </motion.div>
                </div>
                  }
                                    </AnimatePresence>

                </div>
              ))}
              </motion.div>
              
              }
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>

  )
}

export default Search
