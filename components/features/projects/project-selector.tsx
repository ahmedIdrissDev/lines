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
import { getToday, handlePresentsUpdate } from "@/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

interface Project {
  _id: Id<"Project">;
  name: string;
}

export default function ProjectSelect() {
  const { isLoaded, user } = useUser();
  const { setdata, ProjectID, setProjectId } = store();
  
  const allProjects = useQuery(api.functions.project.getProjects);
  
  const projects = useMemo(() => {
    if (!isLoaded || !allProjects || !Array.isArray(allProjects)) return [];
    
    const assignedProjectIds = (user?.publicMetadata?.projects as string[]) || [];
    const permissions = (user?.publicMetadata?.permissions as string[]) || [];
    
    // If admin, show all projects, otherwise filter by assigned IDs
    if (permissions.includes("user:access:admin")) {
      return allProjects;
    }
    
    return allProjects.filter(p => assignedProjectIds.includes(p._id));
  }, [isLoaded, user, allProjects]);

  const isLoading = !isLoaded || allProjects === undefined;
  const projectId = ProjectID as Id<"Project"> | undefined;
   
  const presents = useQuery(
    api.functions.present.Presents,
    projectId ? { Project: projectId } : "skip"
  );

  const employees = useQuery(
    api.functions.employees.employees,
    projectId ? { Project: projectId } : "skip"
  );

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0]._id);
    }
  }, [projectId, projects, setProjectId]);

  const updatedData = useMemo(() => {
    if (!presents || !employees) return [];
    
    // Check for security error objects
    if ("error" in presents || "error" in employees) {
      return [];
    }

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
      disabled={isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un chantier"} />
      </SelectTrigger>

      <SelectContent>
        {projects.length === 0 && !isLoading ? (
          <div className="p-2 text-sm text-ash italic text-center">Aucun projet disponible</div>
        ) : (
          projects.map(({ _id, name }) => (
            <SelectItem key={_id} value={_id}>
              {name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
