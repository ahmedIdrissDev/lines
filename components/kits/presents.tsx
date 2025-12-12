'use client'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { store } from '@/store';
import { Proejct } from '@/types';
import { getToday, handlePresentsUpdate } from '@/utils';
import { useQuery } from 'convex/react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useEffectEvent, useState } from 'react'
import Employees from '../employees';
import { toast } from 'sonner';

const Presents = () => {
    const { data: users } = useSession();
    const [date , setdate] =useState('')
      const { setdata  ,PojectID ,setProjectId } = store();
     const project = users?.user?.project as Proejct[];
      const ProjectId = PojectID as Id<"Project">
     /// get project data 
          const getEmployees =  useQuery(api.functions.employees.employees , ProjectId? {Project:ProjectId} :"skip")
          const getPresents =  useQuery(api.functions.present.Presents , ProjectId? {Project:ProjectId} :"skip")
    
      const onUser = useEffectEvent(() => {
        try {
          if (project[0]._id) {
            setProjectId(project[0]._id);
          }
        } catch (error) {
          console.log("error");
        }
      });
      const ondata = useEffectEvent(async () => {
        try {
    
             const Matricule = getPresents?.find((present) => present.date===date)  ;
             if(!Matricule) return toast.error('عفاك اختار تاريخ صحيح.')
             console.log(Matricule)
                    const Updated = handlePresentsUpdate({
                    Matricule: Matricule?.employees,
                    data: getEmployees,
                  });
                  setdata(Updated)
                  toast.success('مزيان، التاريخ صحيح.')
        } catch (error) {
          console.log(error);
        }
      });
      useEffect(() => {
          onUser();
        }, [users]);
      
        useEffect(() => {
          ondata();
        }, [date]);
      
  return (
    <>
        <div className="h-12 border border-neutral-200 p-1.5 flex justify-between items-center w-full bg-white rounded-2xl">
         <span>{project[0].name} </span>
        <input type="date" className='outline-0' onChange={(e)=>  setdate(e.currentTarget.value)} name="" id="" />
        </div>
       <Employees/>
    </>
  )
}

export default Presents