"use client";
import { api } from "@/convex/_generated/api";
import { Employee, Proejct } from "@/types";
import { useMutation } from "convex/react";
import { useSession } from "next-auth/react";
import React, { FormEvent, useRef } from "react";
import { toast } from "sonner";

const AddEmployees = () => {
  const { data: users } = useSession();
  const project = (users?.user?.project || [] ) as Proejct[];
  const addnew = useMutation(api.functions.employees.addNewEmployyes);
  const formRef = useRef<HTMLFormElement>(null);
  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formdata = new FormData(e.currentTarget);
      const data = Object.fromEntries(formdata.entries());
      const employee = {
        ...data,
        Matricule: Number(data.Matricule),
        status: "inactive",
        createdAt: "",
      };
      const result = await addnew(employee);
          result
        ? toast.success("Merci beaucoup !")
        : toast.error("Le matricule de l’employé existe déjà");
      formRef.current?.reset();
    } catch (error) {}
  }
  return (
    <div className="flex justify-center items-center h-dvh">
      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="w-1/2  flex flex-col gap-2 h-max p-2 bg-white rounded-2xl"
      >
        <div className="">
          <h1 className="text-2xl">Ajouter un employé</h1>
          <p>
            Créez et gérez les profils des employés en les ajoutant au système.
          </p>
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-sm opacity-70">Matricule</span>
          <input type="number" name="Matricule" id="" className="input" />
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-sm opacity-70">Prénom</span>
          <input type="text" name="firstname" id="" className="input" />
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-sm opacity-70">Nom</span>
          <input type="text" name="lastname" id="" className="input" />
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-sm opacity-70">function</span>
          <input type="text" name="function" id="" className="input" />
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-sm opacity-70">Responsable de site</span>
          <input type="text" name="siteManger" readOnly value={users?.user?.name as string} id="" className="input" />
        </div>
        <div className="flex flex-col gap-2 ">
          <span className="text-sm opacity-70">chaniter</span>
          <select name="Project" className="input">
            {project.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name}{" "}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full h-11 bg-tgcc-500 text-white rounded-md"
        >
        Ajouter        </button>
      </form>
    </div>
  );
};

export default AddEmployees;
