"use client";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { Id } from "@/convex/_generated/dataModel";
import { Building2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import AddSubcontractorDialog from "@/components/features/projects/add-subcontractor-dialog";
import { SubcontractorSkeleton } from "@/components/features/projects/subcontractor-skeleton";
import { Badge } from "@/components/ui/badge";

const SubcontractorsPage = () => {
  const { ProjectID } = store();
  const projectId = ProjectID as Id<"Project"> | undefined;
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
    <main className="flex flex-col gap-4 bg-canvas p-4 md:p-8">
      <Card className="gap-0 overflow-hidden border-0 bg-transparent p-0">
        <div className="bg-primary px-5 py-4 text-on-primary">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="caption-tight text-on-dark-mute">SUB</p>
              <h1 className="heading-md text-on-primary">Sous-traitants</h1>
            </div>
            <Badge variant="secondary" className="w-fit">
              Module
            </Badge>
          </div>
        </div>
      </Card>

      {subcontractors === undefined ? (
        <SubcontractorSkeleton />
      ) : Array.isArray(subcontractors) ? (
        subcontractors.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] bg-surface-card rounded-md">
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <AddSubcontractorDialog />
            {subcontractors.map((sub) => (
              <Link key={sub._id} href={`/sous-traitants/sub/${sub._id}`}>
                <Card className="min-h-36 cursor-pointer rounded-md border-0 bg-surface-card p-4 transition-colors hover:bg-surface-bone">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center text-primary">
                      <Building2 />
                    </div>
                    <span className="rounded-sm border border-hairline px-2 py-1 code-sm text-ash">
                      SUB
                    </span>
                  </div>
                  <div className="mt-4">
                    <h2 className="body-md font-medium text-ink capitalize">
                      {sub.name.toLowerCase()}
                    </h2>
                    <p className="mt-1 min-h-10 body-sm text-charcoal">
                      Fiche sous-traitant
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-md bg-surface-card px-6 text-center">
          <div className="text-red-500 mb-2">
            <Loader2 className="size-8 mx-auto animate-spin opacity-20" />
          </div>
          <p className="text-ash text-sm">
            {typeof subcontractors === "object" &&
            subcontractors !== null &&
            "error" in subcontractors
              ? String(subcontractors.error)
              : "Une erreur est survenue lors de la récupération des sous-traitants."}
          </p>
        </div>
      )}
    </main>
  );
};

export default SubcontractorsPage;
