"use client"
import { Employee } from '@/types';
import { store } from '@/store';
import { Repeat, SearchIcon, X } from 'lucide-react'
import { AnimatePresence  , motion} from 'motion/react'
import { useState } from 'react';

const Search = () => {
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [func , setfunction] = useState(false)
      const openclose = ()=> open ? setOpen(false) : setOpen(true)
      const setfunctions = ()=> func ? setfunction(false) : setfunction(true)

      const handleOpenEmployee = (employee: Employee)=> setSelectedEmployee(employee);
      const handleCloseEmployee = ()=> setSelectedEmployee(null);
 
      const [text , settext]= useState('')
      const {data} = store()
      const result = func ?  data.filter(item=> item.function?.toLocaleLowerCase().startsWith(text.toLocaleLowerCase())  ) : data.filter(item=> item.Matricule?.toString().toLocaleLowerCase().startsWith(text.toLocaleLowerCase())  )
  return (
    <>
     <button onClick={openclose} className='px-2 text-ink cursor-pointer justify-center flex w-10 items-center gap-1.5 h-10 hover:bg-surface-bone rounded-full transition-colors'>
            <SearchIcon size={20}/>
        </button>
    <AnimatePresence>
        {open && (
          <div
            className="w-full h-full fixed z-50 bg-ink/20 backdrop-blur-sm flex justify-center items-center inset-0 p-4"
          >
            <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }} 
            className="flex flex-col gap-3 w-full md:w-[500px]"
            >
              <motion.div 
                layout
                layoutId='input'
                className="w-full flex justify-between items-center px-4 h-11 bg-surface-card border border-hairline rounded-full shadow-xl focus-within:ring-2 focus-within:ring-ring-focus transition-all"
              >
                <input 
                  type="text" 
                  onInput={e=> settext(e.currentTarget.value)} 
                  className='outline-none border-0 w-full h-full body-md text-ink placeholder:text-ash bg-transparent' 
                  autoFocus 
                  placeholder='Trouver des employés...' 
                />
                <button onClick={openclose} className='p-2 hover:bg-surface-bone rounded-full transition-colors cursor-pointer text-charcoal'>
                  <X className='w-5 h-5'/>
                </button>
              </motion.div>

              {text && (
                <motion.div
                  layout
                  layoutId='result'
                  initial={{ scale: 0.95, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: -10 }} 
                  className="w-full flex flex-col gap-1 p-2 min-h-[400px] max-h-[600px] overflow-y-auto bg-surface-dark text-on-dark border border-hairline shadow-2xl rounded-md"
                >
                  <div className="w-full p-4 flex items-center justify-between border-b border-divider-dark mb-2">
                    <div className="flex items-center gap-3">
                      <span className="caption-tight text-on-dark-mute">Filtrer par</span>
                      <button onClick={setfunctions} className='flex items-center justify-center gap-2 px-4 h-8 bg-surface-deep text-on-dark rounded-full caption-tight border border-divider-dark hover:bg-black transition-colors cursor-pointer'>
                        <Repeat size={12}/>
                        {func ? 'Fonction':'Matricule'}
                      </button> 
                    </div>
                    <span className='px-3 py-1 rounded-full bg-primary text-on-primary caption-tight font-bold'>
                      {result.length}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 p-2">
                    {result.slice(0, 8).map((employee, index) => (
                      <div key={index} onClick={() => handleOpenEmployee(employee)} className="flex p-3 rounded-md cursor-pointer hover:bg-surface-deep items-center gap-4 transition-colors group border border-transparent hover:border-divider-dark">
                        <div className="w-12 h-12 rounded-full border border-divider-dark overflow-hidden bg-surface-card flex-shrink-0">
                          <img src={'/avatar.png'} alt="avatar" className='w-full h-full object-cover' />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="body-md font-bold truncate text-on-dark group-hover:text-primary transition-colors">{employee.firstname} {employee.lastname}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="caption text-on-dark-mute bg-surface-deep px-2 py-0.5 rounded-full border border-divider-dark">{employee.function}</span>
                            {employee.status === 'active' ? 
                              <span className="caption font-bold text-badge-success flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-badge-success animate-pulse"/> PRÉSENT</span> : 
                              <span className="caption font-bold text-ash flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-stone"/> ABSENT</span>
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedEmployee && (
                      <div className="fixed inset-0 z-[60] p-4 bg-ink/40 backdrop-blur-md flex justify-center items-center">
                        <motion.div
                          layout
                          layoutId='profile'
                          initial={{ scale: 0.95, opacity: 0, y: 10 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.95, opacity: 0, y: 10 }} 
                          className="w-full md:w-[450px] flex flex-col bg-canvas rounded-lg border border-hairline shadow-2xl overflow-hidden"
                        >
                          <div className="p-6 border-b border-hairline bg-surface-card flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full border border-hairline overflow-hidden shadow-sm">
                                <img src={'/avatar.png'} alt={selectedEmployee.firstname} className='w-full h-full object-cover' />
                              </div>
                              <h1 className="heading-md text-ink">{selectedEmployee.firstname} {selectedEmployee.lastname}</h1>
                            </div>
                            <button onClick={handleCloseEmployee} className="p-2 hover:bg-surface-bone rounded-full transition-colors text-charcoal cursor-pointer">
                              <X className='w-5 h-5'/>
                            </button>
                          </div>
                          
                          <div className="p-8 flex flex-col gap-8">
                            <div className="grid grid-cols-2 gap-8">
                              <div className="flex flex-col gap-1.5">
                                <span className="caption-tight text-ash">Matricule</span>
                                <span className="body-lg font-bold text-ink font-mono">{selectedEmployee.Matricule}</span>
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <span className="caption-tight text-ash">Statut</span>
                                {selectedEmployee.status === 'active' ? 
                                  <span className="body-md font-bold text-badge-success flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-badge-success shadow-lg shadow-success/20"/> Présent sur site</span> : 
                                  <span className="body-md font-bold text-charcoal flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-stone"/> Absent</span>
                                }
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="caption-tight text-ash">Fonction</span>
                              <span className="body-md font-bold text-ink bg-surface-card px-4 py-1.5 rounded-full border border-hairline w-max">{selectedEmployee.function}</span>
                            </div>

                            <div className="flex flex-col gap-1.5">
                              <span className="caption-tight text-ash">Responsable de Site</span>
                              <span className="body-md text-charcoal italic">{selectedEmployee.siteManger}</span>
                            </div>
                          </div>

                          <div className="p-6 bg-surface-bone border-t border-hairline flex justify-center">
                            <button onClick={handleCloseEmployee} className="caption-tight text-charcoal hover:text-ink transition-colors cursor-pointer font-bold">Fermer le profil</button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    
    </>

  )
}

export default Search
