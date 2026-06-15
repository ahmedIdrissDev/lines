'use client'
import { Plus, X, Loader2, Building2, Mail, Phone, MapPin, FolderGit2 } from 'lucide-react';
import React, { FormEvent, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner'
import { Id } from '@/convex/_generated/dataModel';

const AddSubcontractorDialog = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const openclose = () => setOpen(!open);
    
    const createSubcontractor = useMutation(api.functions.subcontractors.createSubcontractor);
    const projects = useQuery(api.functions.project.getProjects);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formdata = new FormData(e.currentTarget);
            const data = Object.fromEntries(formdata.entries());
            
            if (data.name) {
                await createSubcontractor({
                    name: data.name as string,
                    email: data.email as string || undefined,
                    phone: data.phone as string || undefined,
                    address: data.address as string || undefined,
                    projectId: data.projectId ? (data.projectId as Id<"Project">) : undefined,
                });
                toast.success('sous-traitant ajouté avec succès');
                openclose();
            } else {
                toast.error('veuillez remplir le nom');
            }
        } catch (error) {
            console.error(error);
            toast.error('erreur lors de l\'ajout');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button 
                onClick={openclose}
                className="flex bg cursor-pointer items-center justify-center flex-col gap-2 p-6 bg-surface-card border border-hairline rounded-md text-charcoal hover:bg-canvas hover:border-primary/50 transition-all shadow-sm group"
            >
                    <Plus className="size-6 text-ash group-hover:text-primary transition-colors" />
                <span className="">ajouter un sous-traitant</span>
            </button>

            <AnimatePresence>
                {open && (
                    <div onClick={openclose} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-4 flex justify-center items-center">
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-canvas bg relative flex flex-col gap-6 p-8 w-full md:w-[480px] rounded-md shadow-2xl border border-hairline"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="heading-md text-ink">Nouveau sous-traitant</h2>
                                <button type="button" onClick={openclose} className="p-2 hover:bg-surface-bone rounded-full transition-colors text-charcoal">
                                    <X className="size-5" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="caption-tight text-ash ml-1">Nom de l&apos;entreprise</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ash" />
                                    <input 
                                        type="text" 
                                        name='name' 
                                        className="input pl-11" 
                                        placeholder='Ex: Atlas Construction' 
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="caption-tight text-ash ml-1">Chantier / Projet</label>
                                <div className="relative">
                                    <FolderGit2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ash" />
                                    <select 
                                        name="projectId"
                                        className="input pl-11 appearance-none bg-surface-card"
                                    >
                                        <option value="">Sélectionner un projet...</option>
                                        {Array.isArray(projects) && projects.map(p => (
                                            <option key={p._id} value={p._id}>{p.name.toLowerCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="caption-tight text-ash ml-1">Adresse (optionnel)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-ash" />
                                    <input 
                                        type="text" 
                                        name='address' 
                                        className="input pl-11" 
                                        placeholder='Adresse du siège...' 
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className='btn-primary w-full mt-2'
                            >
                                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Plus className="size-4 mr-2" />}
                                <span>Ajouter le sous-traitant</span>
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}

export default AddSubcontractorDialog
