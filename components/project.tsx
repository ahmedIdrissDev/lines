"use client";

import React, { useEffect, useMemo } from "react";
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

interface Project {
  _id: Id<"Project">;
  name: string;
}

export default function ProjectSelect() {
  const { data: session } = useSession();
  const { setdata, PojectID, setProjectId } = store();

  const projects = (session?.user?.project || []) as Project[];
  const projectId = PojectID as Id<"Project"> | undefined;
   
  const presents = useQuery(
    api.functions.present.Presents,
    projectId ? { Project: projectId } : undefined
  );

  const employees = useQuery(
    api.functions.employees.employees,
    projectId ? { Project: projectId } : undefined
  );

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0]._id);
    }
  }, [projectId, projects, setProjectId]);

  const updatedData = useMemo(() => {
    if (!presents || !employees) return [];

    const today = getToday();

    const lastPresent =
      [...presents].reverse().find(Boolean) ?? null;

    const todayPresent =
      presents.find((p) => p.date === today) ?? lastPresent;

    if (!todayPresent) return [];

    return handlePresentsUpdate({
      Matricule: todayPresent.employees,
      data: employees,
    });
  }, [presents, employees]);

  useEffect(() => {
    setdata(updatedData);
  }, [updatedData, setdata]);

  return (
    <Select
      value={projectId}
      onValueChange={(id) => setProjectId(id as Id<"Project">)}
    >
      <SelectTrigger className="w-12 md:w-[180px] bg-white">
        <SelectValue placeholder="Select project" />
      </SelectTrigger>

      <SelectContent>
        {projects.map(({ _id, name }) => (
          <SelectItem key={_id} value={_id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
