"use client";
import React, { useEffect, useEffectEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { store } from "@/store";
import { useSession } from "next-auth/react";
import { getToday, handlePresentsUpdate } from "@/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface Proejct {
  _id: string;
  name: string;
}
const Project = () => {
  const { data: users } = useSession();
  const { setdata  ,PojectID ,setProjectId } = store();
  const project = users?.user?.project as Proejct[];
  const ProjectId = PojectID as Id<"Project">
 /// get project data 
 const getPresents =  useQuery(api.functions.present.Presents , projectdd ? {Project:ProjectId} :"skip")
 const getEmployees =  useQuery(api.functions.employees.employees , projectdd ? {Project:ProjectId} :"skip")
  
const onUser = useEffectEvent(() => {
    try {
      if (project[0]._id) {
        setProjectId(project[0]._id)
      }
    } catch (error) {
      console.log("error");
    }
  });
  const ondata = useEffectEvent(async () => {
    try {
      
      console.log( "iis",PojectID)
        const today = getToday()
        const curredlastdate =getPresents?.reverse().find((item) => item) || []
        console.log("current last",PojectID)
         const Matricule = getPresents?.find(({ date }) => date === today) || curredlastdate ;
                const Updated = handlePresentsUpdate({
                Matricule: Matricule?.employees,
                data: getEmployees,
              });
              setdata(Updated)
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    onUser();
  }, [users]);

  useEffect(() => {

    ondata();

  }, [getEmployees , getPresents , PojectID]);

  return (
    <>
   
    <Select onValueChange={(e) =>{
      // setProjectId(e)
setPoject(e)    } }>
      <SelectTrigger
      
        className="w-12 md:w-[180px] bg-white"
      >
        <SelectValue placeholder={project[0].name as string} />
      </SelectTrigger>
      <SelectContent>
        {project.map(({ _id, name }) => (
          <SelectItem key={_id} value={_id}>
            {name}{" "}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </>
  );
};

export default Project;
