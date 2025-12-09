"use client";
import React, { useEffect, useEffectEvent } from "react";
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

interface Proejct {
  _id: string;
  name: string;
}
const Project = () => {
  const { data: users } = useSession();
  const { setdata , setProjectId  , PojectID} = store();
  const project = users?.user?.project as Proejct[];
  const ProjectId = PojectID as Id<"Project">;
  const fetchemployees = useQuery(api.functions.employees.employees ,   ProjectId ? { ProjectId: ProjectId } : "skip");
  const fetchPresents = useQuery(api.functions.present.Presents , ProjectId ? { Project: ProjectId } : "skip");
  const today = getToday();
  console.log(fetchemployees)
  const onUser = useEffectEvent(() => {
    try {
      if (project[0]._id) {
        setProjectId(project[0]._id);
      }
    } catch (error) {}
  });

  const ondata = useEffectEvent(() => {
    try {
      const Matricule =
        fetchPresents?.find(({ date }) => date === today) ||
        fetchPresents?.find((item) => item);
      const Updated = handlePresentsUpdate({
        Matricule: Matricule?.employees,
        data: fetchemployees,
      });
      setdata(Updated);
    } catch (error) {
      console.log("error");
    }
  });
  useEffect(()=>{
    onUser()
  } ,[users])
  useEffect(() => {
    ondata();
  }, [fetchemployees, fetchPresents]);

  return (
    <Select onValueChange={e=> setProjectId(e)}>
      <SelectTrigger  className="w-12 md:w-[180px] bg-white">
        <SelectValue  placeholder={project[0].name as string} />
      </SelectTrigger>
      <SelectContent>
        {project.map(({ _id, name }) => (
          <SelectItem key={_id} value={_id}>
            {name}{" "}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Project;
