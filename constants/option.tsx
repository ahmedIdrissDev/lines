import { File, Users, Zap } from "lucide-react";
import React from "react";

interface OptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
}

export const options: OptionProps[] = [
  {
    icon: <Users />,
    label: "Gestion du personnel",
    description:
      "Consultez les informations des employés, les dossiers RH et les données associées en toute simplicité."
  },

  {
    icon: <File />,
    label: "Gestion des sous-traitants",
    description:
      "Ajoutez, mettez à jour et gérez les informations des sous-traitants et de leurs employés."
  },

  {
    icon: <Zap />,
    label: "Génération de documents",
    description:
      "Créez automatiquement des documents professionnels à partir de modèles prédéfinis."
  }
];