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

const Presents = () => {
    const { data: users } = useSession();
    const [date , setdate] =useState('')
      const { setdata  ,PojectID ,setProjectId } = store();
     const project = users?.user?.project as Proejct[];
      const ProjectId = PojectID as Id<"Project">
     /// get project data 
          const getEmployees =  useQuery(api.functions.employees.employees , ProjectId? {Project:ProjectId} :"skip")
          const getPresents =  useQuery(api.functions.present.Presents , ProjectId? {Project:ProjectId} :"skip")
         console.log(getEmployees)
    
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
    
             const Matricule = getPresents?.find(({ date }) => date===date)  ;
                    const Updated = handlePresentsUpdate({
                    Matricule: Matricule?.employees,
                    data: getEmployees,
                  });
                  setdata(Updated)
                  console.log(date)
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
    <div className="">
        <input type="date" onChange={(e)=>  setdate(e.currentTarget.value)} name="" id="" />
       <Employees/>
    </div>
    </>
  )
}

export default Presents