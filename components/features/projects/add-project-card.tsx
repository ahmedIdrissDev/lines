'use client'
import { Plus, X, Loader2 } from 'lucide-react';
import React, { FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner'

interface FormProps {
    name: string,
    type: string,
    site?: string,
    status?: string,
    startDate?: string,
    endDate?: string
}

const Projectcard = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const openclose = () => setOpen(!open);
    
    const setProject = useMutation(api.functions.project.SetProject);

    const handleProjectSubmition = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formdata = new FormData(e.currentTarget);
            const data = Object.fromEntries(formdata.entries());
            
            if (data.name) {
                await setProject({
                    name: data.name as string,
                    type: data.type as string,
                    site: data.site as string || undefined,
                    status: data.status as string || 'active',
                    startDate: data.startDate as string || undefined,
                    endDate: data.endDate as string || undefined,
                });
                toast.success('projet créé avec succès');
                openclose();
            } else {
                toast.error('veuillez remplir le nom du projet');
            }
        } catch (error) {
            console.error(error);
            toast.error('erreur lors de la création du projet');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div onClick={openclose}
                className="text-sm cursor-pointer gap-1.5 bg-white border border-neutral-200 hover:border-primary/50 transition-colors rounded-xl w-full h-40 flex flex-col justify-center items-center group"
            >
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Plus className="text-primary" />
                </div>
                <span className="font-medium text-neutral-600">ajouter un projet</span>
            </div>

            <AnimatePresence>
                {open && (
                    <div onClick={openclose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 flex justify-center items-center">
                        <motion.form
                            onSubmit={handleProjectSubmition}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white relative flex flex-col gap-4 p-6 w-full md:w-[550px] rounded-2xl border border-neutral-200 shadow-xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold text-neutral-800">nouveau projet</h2>
                                <X onClick={openclose} className="size-5 text-neutral-400 cursor-pointer hover:text-neutral-600" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-neutral-600 ml-1">nom du projet</label>
                                    <input 
                                        type="text" 
                                        name='name' 
                                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                        placeholder='chantier x...' 
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-neutral-600 ml-1">site / emplacement</label>
                                    <input 
                                        type="text" 
                                        name='site' 
                                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                        placeholder='ville, quartier...' 
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-neutral-600 ml-1">type</label>
                                    <select 
                                        className='w-full h-11 px-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white' 
                                        name="type"
                                    >
                                        <option value="tgcc">tgcc</option>
                                        <option value="sous-traitants">sous-traitants</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-neutral-600 ml-1">statut</label>
                                    <select 
                                        className='w-full h-11 px-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white' 
                                        name="status"
                                    >
                                        <option value="active">actif</option>
                                        <option value="pending">en attente</option>
                                        <option value="completed">terminé</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-neutral-600 ml-1">date de début</label>
                                    <input 
                                        type="date" 
                                        name='startDate' 
                                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-neutral-600 ml-1">date de fin (estimée)</label>
                                    <input 
                                        type="date" 
                                        name='endDate' 
                                        className="w-full h-11 px-4 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className='w-full flex justify-center items-center gap-2 h-11 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-2'
                            >
                                {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                                <span>créer le projet</span>
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Projectcard