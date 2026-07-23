"use client";

import React, { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Project = Doc<"Project">;
type ProjectStatus = "Active" | "In Progress" | "Completed" | "Archived";
type SortKey = "name" | "city" | "status" | "_creationTime";
type SortDirection = "asc" | "desc";

type ProjectFormValues = {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  status: ProjectStatus;
  xCoordinate?: number;
  yCoordinate?: number;
  attendanceRadiusMeters?: number;
};

type CoordinateFields = {
  xCoordinate: string;
  yCoordinate: string;
};

const STATUSES: ProjectStatus[] = [
  "Active",
  "In Progress",
  "Completed",
  "Archived",
];

const PAGE_SIZE = 8;

const normalizeStatus = (status?: string): ProjectStatus => {
  const normalized = status?.trim().toLowerCase();

  if (normalized === "in progress" || normalized === "pending") {
    return "In Progress";
  }

  if (normalized === "completed") {
    return "Completed";
  }

  if (normalized === "archived") {
    return "Archived";
  }

  return "Active";
};

const statusBadgeVariant = (status: ProjectStatus) => {
  if (status === "Completed") return "success";
  if (status === "Archived") return "outline";
  if (status === "In Progress") return "secondary";
  return "default";
};

const getProjectSearchText = (project: Project) =>
  [
    project.name,
    project.description,
    project.address,
    project.city,
    project.site,
    normalizeStatus(project.status),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

const getSortValue = (project: Project, key: SortKey) => {
  if (key === "_creationTime") return project._creationTime;
  if (key === "status") return normalizeStatus(project.status);
  return project[key] ?? "";
};

const emptyToUndefined = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "").trim();
  return text || undefined;
};

const optionalNumber = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "").trim();
  if (!text) return undefined;

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const clampAttendanceRadius = (radius?: number) => {
  if (typeof radius !== "number") {
    return undefined;
  }

  return Math.min(1000, Math.max(0, radius));
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

const formatCoordinate = (coordinate: number) => coordinate.toFixed(7);

const projectToFormDefaults = (project: Project): ProjectFormValues => ({
  name: project.name,
  description: project.description,
  address: project.address,
  city: project.city,
  status: normalizeStatus(project.status),
  xCoordinate: project.xCoordinate,
  yCoordinate: project.yCoordinate,
  attendanceRadiusMeters: clampAttendanceRadius(project.attendanceRadiusMeters),
});

const parseProjectForm = (form: HTMLFormElement): ProjectFormValues => {
  const formData = new FormData(form);
  const name = String(formData.get("name") ?? "").trim();

  return {
    name,
    description: emptyToUndefined(formData.get("description")),
    address: emptyToUndefined(formData.get("address")),
    city: emptyToUndefined(formData.get("city")),
    status: String(formData.get("status") ?? "Active") as ProjectStatus,
    xCoordinate: optionalNumber(formData.get("xCoordinate")),
    yCoordinate: optionalNumber(formData.get("yCoordinate")),
    attendanceRadiusMeters: clampAttendanceRadius(
      optionalNumber(formData.get("attendanceRadiusMeters")),
    ),
  };
};

const ProjectForm = ({
  defaultValues,
  coordinates,
  submitLabel,
  isSubmitting,
  isLocating = false,
  onCoordinateChange,
  onUseCreatorLocation,
  onSubmit,
}: {
  defaultValues?: ProjectFormValues;
  coordinates?: CoordinateFields;
  submitLabel: string;
  isSubmitting: boolean;
  isLocating?: boolean;
  onCoordinateChange?: (coordinates: CoordinateFields) => void;
  onUseCreatorLocation?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) => (
  <form onSubmit={onSubmit} className="flex flex-col gap-5">
    <div className="flex flex-col gap-2">
      <Label htmlFor="project-name">Nom du projet</Label>
      <Input
        id="project-name"
        name="name"
        defaultValue={defaultValues?.name ?? ""}
        placeholder="Nom du chantier"
        required
      />
    </div>

    <div className="flex flex-col gap-2">
      <Label htmlFor="project-description">Description</Label>
      <textarea
        id="project-description"
        name="description"
        defaultValue={defaultValues?.description ?? ""}
        className="min-h-24 w-full resize-none rounded-md border border-hairline bg-surface-card px-4 py-3 body-md placeholder:text-ash outline-none transition-all focus-visible:border-hairline-strong focus-visible:ring-2 focus-visible:ring-ring-focus"
        placeholder="Notes, contexte ou portée du chantier"
      />
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-address">Adresse</Label>
        <Input
          id="project-address"
          name="address"
          defaultValue={defaultValues?.address ?? ""}
          placeholder="Adresse"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-city">Ville</Label>
        <Input
          id="project-city"
          name="city"
          defaultValue={defaultValues?.city ?? ""}
          placeholder="Ville"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Label>Statut</Label>
        <Select name="status" defaultValue={defaultValues?.status ?? "Active"}>
          <SelectTrigger className="w-full rounded-full">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-x">Coordonnée X</Label>
        <Input
          id="project-x"
          name="xCoordinate"
          type="number"
          step="any"
          {...(coordinates
            ? {
                value: coordinates.xCoordinate,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  onCoordinateChange?.({
                    ...coordinates,
                    xCoordinate: event.target.value,
                  }),
              }
            : { defaultValue: defaultValues?.xCoordinate ?? "" })}
          placeholder="Optionnel"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-y">Coordonnée Y</Label>
        <Input
          id="project-y"
          name="yCoordinate"
          type="number"
          step="any"
          {...(coordinates
            ? {
                value: coordinates.yCoordinate,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  onCoordinateChange?.({
                    ...coordinates,
                    yCoordinate: event.target.value,
                  }),
              }
            : { defaultValue: defaultValues?.yCoordinate ?? "" })}
          placeholder="Optionnel"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="project-radius">Zone pointage (m)</Label>
        <Input
          id="project-radius"
          name="attendanceRadiusMeters"
          type="number"
          min={0}
          max={1000}
          step={1}
          defaultValue={defaultValues?.attendanceRadiusMeters ?? 250}
          placeholder="0 à 1000"
        />
      </div>
    </div>

    {onUseCreatorLocation ? (
      <Button
        type="button"
        variant="outline"
        onClick={onUseCreatorLocation}
        disabled={isLocating}
        className="w-fit"
      >
        {isLocating ? <Loader2 className="animate-spin" /> : <MapPin />}
        Utiliser ma position
      </Button>
    ) : null}

    <DialogFooter>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus />}
        {submitLabel}
      </Button>
    </DialogFooter>
  </form>
);

const ChantierPage = () => {
  const projectsQueryResult = useQuery(api.functions.project.getProjects);
  const createProject = useMutation(api.functions.project.SetProject);
  const updateProject = useMutation(api.functions.project.updateProject);
  const deleteProject = useMutation(api.functions.project.deleteProject);

  const [search, setSearch] = useState("");
  const [sortKey] = useState<SortKey>("_creationTime");
  const [sortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [createCoordinates, setCreateCoordinates] = useState<CoordinateFields>({
    xCoordinate: "",
    yCoordinate: "",
  });
  const [editCoordinates, setEditCoordinates] = useState<CoordinateFields>({
    xCoordinate: "",
    yCoordinate: "",
  });

  const projects = useMemo(
    () => (Array.isArray(projectsQueryResult) ? projectsQueryResult : []),
    [projectsQueryResult],
  );
  const projectsError =
    projectsQueryResult && !Array.isArray(projectsQueryResult)
      ? (projectsQueryResult as { error?: string }).error
      : null;

  const sortedProjects = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      if (!searchText) return true;
      return getProjectSearchText(project).includes(searchText);
    });

    return [...filtered].sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [projects, search, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedProjects.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const requestUserLocation = (onSuccess: (coordinates: CoordinateFields) => void) => {
    if (!("geolocation" in navigator)) {
      toast.error("La géolocalisation n'est pas disponible sur ce navigateur");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onSuccess({
          xCoordinate: formatCoordinate(position.coords.longitude),
          yCoordinate: formatCoordinate(position.coords.latitude),
        });
        toast.success("Position ajoutée");
        setIsLocating(false);
      },
      () => {
        toast.error("Impossible de récupérer la position");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 60_000,
        timeout: 10_000,
      },
    );
  };

  const requestCreatorLocation = () => {
    requestUserLocation(setCreateCoordinates);
  };

  const requestEditorLocation = () => {
    requestUserLocation(setEditCoordinates);
  };

  const handleOpenCreate = () => {
    setCreateCoordinates({
      xCoordinate: "",
      yCoordinate: "",
    });
    setIsCreateOpen(true);
    requestCreatorLocation();
  };

  const handleOpenEdit = (project: Project) => {
    setEditCoordinates({
      xCoordinate:
        project.xCoordinate !== undefined
          ? formatCoordinate(project.xCoordinate)
          : "",
      yCoordinate:
        project.yCoordinate !== undefined
          ? formatCoordinate(project.yCoordinate)
          : "",
    });
    setEditingProject(project);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = parseProjectForm(event.currentTarget);

    if (!values.name) {
      toast.error("Le nom du projet est obligatoire");
      return;
    }

    setIsSubmitting(true);
    try {
      await createProject(values);
      toast.success("Chantier créé");
      setIsCreateOpen(false);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Erreur lors de la création du chantier"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingProject) return;

    const values = parseProjectForm(event.currentTarget);

    if (!values.name) {
      toast.error("Le nom du projet est obligatoire");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProject({
        id: editingProject._id,
        ...values,
      });
      toast.success("Chantier mis à jour");
      setEditingProject(null);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Erreur lors de la mise à jour du chantier"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      await deleteProject({ id: deletingProject._id });
      toast.success("Chantier supprimé");
      setDeletingProject(null);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error, "Erreur lors de la suppression du chantier"),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="body-md font-medium text-ink">Chantiers</h1>
        <Button onClick={handleOpenCreate}>
          <Plus />
          Nouveau chantier
        </Button>
      </div>

      <Card className="gap-0 p-0">
        <CardHeader className="m-0 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Liste des chantiers</CardTitle>
            <CardDescription>
              {sortedProjects.length} chantier
              {sortedProjects.length > 1 ? "s" : ""} trouvé
              {sortedProjects.length > 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ash" />
            <Input
              value={search}
              onChange={(event) => handleSearch(event.target.value)}
              className="pl-11"
              placeholder="Rechercher un chantier"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {projectsQueryResult === undefined ? (
            <div className="flex min-h-72 items-center justify-center text-ash">
              <Loader2 className="animate-spin" />
            </div>
          ) : projectsError ? (
            <div className="flex min-h-72 items-center justify-center px-6 text-center text-sm text-destructive">
              {projectsError}
            </div>
          ) : sortedProjects.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-3 px-6 text-center text-ash">
              <Building2 className="opacity-30" />
              <p className="body-sm">
                {search
                  ? "Aucun chantier ne correspond à cette recherche."
                  : "Aucun chantier créé pour le moment."}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      Nom
                    </TableHead>
                    <TableHead>
                      Ville
                    </TableHead>
                    <TableHead>
                      Statut
                    </TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProjects.map((project) => {
                    const status = normalizeStatus(project.status);

                    return (
                      <TableRow key={project._id}>
                        <TableCell className="font-medium text-ink">
                          {project.name}
                        </TableCell>
                        <TableCell>{project.city || project.site || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={statusBadgeVariant(status)}>
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-ash">
                          {clampAttendanceRadius(project.attendanceRadiusMeters) ?? 250} m
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleOpenEdit(project)}
                              aria-label={`Modifier ${project.name}`}
                            >
                              <Pencil />
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => setDeletingProject(project)}
                              aria-label={`Supprimer ${project.name}`}
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 border-t border-hairline p-4 md:flex-row md:items-center md:justify-between">
                <p className="caption-tight text-ash">
                  Page {currentPage} sur {pageCount}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft />
                    Précédent
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((value) => Math.min(pageCount, value + 1))
                    }
                    disabled={currentPage === pageCount}
                  >
                    Suivant
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau chantier</DialogTitle>
            <DialogDescription>
              Créer un projet avec ses informations principales.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            coordinates={createCoordinates}
            submitLabel="Créer le chantier"
            isSubmitting={isSubmitting}
            isLocating={isLocating}
            onCoordinateChange={setCreateCoordinates}
            onUseCreatorLocation={requestCreatorLocation}
            onSubmit={handleCreate}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingProject)}
        onOpenChange={(open) => {
          if (!open) setEditingProject(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le chantier</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations du projet.
            </DialogDescription>
          </DialogHeader>
          {editingProject ? (
            <ProjectForm
              defaultValues={projectToFormDefaults(editingProject)}
              coordinates={editCoordinates}
              submitLabel="Enregistrer"
              isSubmitting={isSubmitting}
              isLocating={isLocating}
              onCoordinateChange={setEditCoordinates}
              onUseCreatorLocation={requestEditorLocation}
              onSubmit={handleUpdate}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => {
          if (!open) setDeletingProject(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le chantier</DialogTitle>
            <DialogDescription>
              Confirmez la suppression de ce chantier. Cette action supprimera
              le projet et retirera son association des sous-traitants.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-hairline bg-surface-bone p-4">
            <p className="body-sm font-medium text-ink">
              {deletingProject?.name}
            </p>
            <p
              className={cn(
                "caption-tight text-ash",
                !deletingProject?.city && "hidden",
              )}
            >
              {deletingProject?.city}
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingProject(null)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChantierPage;
