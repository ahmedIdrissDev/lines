"use client";

import {
  Bus,
  Construction,
  FileText,
  FolderKanban,
  Settings,
  type LucideIcon,
  UserPlus,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const modules = [
  {
    code: "HCM",
    label: "Gestion personnel",
    description: "Pointage, présence et suivi des équipes.",
    path: "/personnel",
    icon: UsersRound,
  },
  {
    code: "TRN",
    label: "Gestion Bus",
    description: "Transport, bus et affectations.",
    path: "/bus",
    icon: Bus,
  },
  {
    code: "PRJ",
    label: "Chantier",
    description: "Sites, coordonnées et zones de pointage.",
    path: "/chantier",
    icon: FolderKanban,
  },
  {
    code: "SUB",
    label: "Sous-traitants",
    description: "Entreprises partenaires et présence.",
    path: "/sous-traitants",
    icon: Construction,
  },
  {
    code: "RPT",
    label: "Rapport Général",
    description: "Rapports personnel et transport.",
    path: "/rapport-general",
    icon: FileText,
  },
  {
    code: "ADM",
    label: "Administration",
    description: "Création et gestion des accès.",
    path: "/add",
    icon: UserPlus,
  },
  {
    code: "CFG",
    label: "Paramètres",
    description: "Configuration de l’application.",
    path: "/settings",
    icon: Settings,
  },
] satisfies Array<{
  code: string;
  label: string;
  description: string;
  path: string;
  icon: LucideIcon;
}>;

const DashboardPage = () => {
  return (
    <main className="min-h-[calc(100dvh-3.75rem)] bg-canvas p-4 md:p-8">
      <Card className="gap-0 overflow-hidden border-0 bg-transparent p-0">
        <div className="bg-primary px-5 py-4 text-on-primary">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="caption-tight text-on-dark-mute">TGCC Lines</p>
              <h1 className="heading-md text-on-primary">Accueil modules</h1>
            </div>
            <Badge variant="secondary" className="w-fit">
              {modules.length} modules
            </Badge>
          </div>
        </div>

        <CardContent className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.code}
                href={module.path}
                className="group rounded-md border border-transparent bg-surface-card p-4 transition-colors hover:bg-surface-bone"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center text-primary">
                    <Icon />
                  </div>
                  <span className="rounded-sm border border-hairline px-2 py-1 code-sm text-ash">
                    {module.code}
                  </span>
                </div>
                <div className="mt-4">
                  <h2 className="body-md font-medium text-ink">
                    {module.label}
                  </h2>
                  <p className="mt-1 min-h-10 body-sm text-charcoal">
                    {module.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </main>
  );
};

export default DashboardPage;
