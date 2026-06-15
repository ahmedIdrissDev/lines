"use client";
import { api } from "@/convex/_generated/api";
import { Proejct } from "@/types";
import { useMutation, useQuery } from "convex/react";
import React, { FormEvent, useRef } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const AddEmployees = () => {
  const user = useQuery(api.functions.users.getMe);
  const project = (user?.projects || [] ) as Proejct[];
  const addnew = useMutation(api.functions.employees.addNewEmployyes);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formdata = new FormData(e.currentTarget);
      const data = Object.fromEntries(formdata.entries());
      
      if (!data.Project) {
        toast.error("Veuillez sélectionner un chantier");
        return;
      }

      const employee = {
        Matricule: Number(data.Matricule),
        firstname: data.firstname as string,
        lastname: data.lastname as string,
        function: data.function as string,
        siteManger: data.siteManger as string, // Matches mutation spelling
        status: "inactive" as const,
        Project: data.Project as any,
        createdAt: new Date().toISOString(),
      };

      const result = await addnew(employee);
      if (result) {
        toast.success("Employé ajouté avec succès !");
        formRef.current?.reset();
      } else {
        toast.error("Le matricule de l’employé existe déjà");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'ajout");
    }
  }

  if (user === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-canvas">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-ash font-medium">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4 bg-canvas">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className=" w-1/2 flex flex-col gap-8 p-10 bg-surface-card border border-hairline rounded-lg shadow-sm"
      >
        <div className="flex flex-col gap-3">
          <h1 className="heading-lg text-ink">Ajouter un employé</h1>
          <p className="text-charcoal body-sm">
            Créez et gérez les profils des employés en les ajoutant au système de suivi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="caption-tight text-ash px-1">Matricule</label>
            <Input type="number" name="Matricule" placeholder="Ex: 12345" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="caption-tight text-ash px-1">Prénom</label>
            <Input type="text" name="firstname" placeholder="Prénom" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="caption-tight text-ash px-1">Nom</label>
            <Input type="text" name="lastname" placeholder="Nom" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="caption-tight text-ash px-1">Fonction</label>
            <Input type="text" name="function" placeholder="Ex: Chef de chantier" required />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="caption-tight text-ash px-1">Responsable de site</label>
          <Input type="text" name="siteManger" readOnly value={user?.name || ""} className="bg-surface-bone/50 cursor-not-allowed opacity-80" />
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="caption-tight text-ash px-1">Chantier</label>
          <div className="relative">
            <select 
              name="Project" 
              className="w-full px-5 rounded-full border border-hairline bg-surface-card h-11 outline-none focus:ring-2 focus:ring-ring-focus transition-all body-md appearance-none cursor-pointer text-ink pr-10"
              defaultValue=""
              required
            >
              <option value="" disabled>Sélectionnez un chantier</option>
              {project.map(({ _id, name }) => (
                <option key={_id} value={_id}>
                  {name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-ash flex items-center">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-4 h-11 text-sm font-bold shadow-lg shadow-primary/10">
          Ajouter l&apos;employé
        </Button>
      </form>
    </div>
  );
};

export default AddEmployees;
