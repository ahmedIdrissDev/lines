"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import AddSubcontractorDialog from "@/components/features/projects/add-subcontractor-dialog";
import { SubcontractorSkeleton } from "@/components/features/projects/subcontractor-skeleton";
import { useUser } from "@clerk/nextjs";

const SubcontractorsPage = () => {
  const { ProjectID } = store();
  const projectId = ProjectID as Id<"Project"> | undefined;
  const user = useUser();
  const subcontractors = useQuery(
    api.functions.subcontractors.getSubcontractorsByProject,
    projectId ? { projectId } : "skip",
  );

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-ash">
        <svg
          className="w-12 h-11 opacity-20"
          width="457"
          height="268"
          viewBox="0 0 457 268"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.7523 221.748C130.997 224.167 159.239 246.1 197.289 177.128C217.19 141.056 187.597 107.922 208.143 72.214C253.226 -6.13942 438.972 85.3512 438.972 85.3512"
            stroke="currentColor"
            strokeWidth="81"
          />
        </svg>
        <p className="text-sm">
          Veuillez sélectionner un projet pour voir les sous-traitants.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="heading-xl text-ink">Sous-traitants</h1>
        <p className="body-sm text-ash mt-2">
          Liste des sous-traitants pour le projet sélectionné
        </p>
      </div>

      {subcontractors === undefined ? (
        <SubcontractorSkeleton />
      ) : Array.isArray(subcontractors) ? (
        subcontractors.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-md border border-hairline border-dashed">
            <svg
              className="w-12 h-11 opacity-20"
              width="457"
              height="268"
              viewBox="0 0 457 268"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.7523 221.748C130.997 224.167 159.239 246.1 197.289 177.128C217.19 141.056 187.597 107.922 208.143 72.214C253.226 -6.13942 438.972 85.3512 438.972 85.3512"
                stroke="currentColor"
                strokeWidth="81"
              />
            </svg>
            <p className="body-sm text-ash mt-4">
              Aucun sous-traitant trouvé pour ce projet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <AddSubcontractorDialog />
            {subcontractors.map((sub) => (
              <Link key={sub._id} href={`/sous-traitants/sub/${sub._id}`}>
                <Card className="h-44 flex flex-col items-center justify-center p-6 bg-white  b cursor-pointer group rounded-md hover:border-primary/50 transition-all shadow-sm">
                  <span className="text-md text-ink text-center capitalize">
                    {sub.name.toLowerCase()}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-2xl border border-hairline border-dashed px-6 text-center">
          <div className="text-red-500 mb-2">
            <Loader2 className="size-8 mx-auto animate-spin opacity-20" />
          </div>
          <p className="text-ash text-sm">
            {typeof subcontractors === "object" &&
            subcontractors !== null &&
            "error" in subcontractors
              ? (subcontractors as any).error
              : "Une erreur est survenue lors de la récupération des sous-traitants."}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubcontractorsPage;
