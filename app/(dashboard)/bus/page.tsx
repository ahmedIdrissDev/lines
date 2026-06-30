"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { store } from "@/store";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Bus, 
  Wrench, 
  XCircle, 
  CheckCircle, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Users,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import moment from "moment";
import { Toggle } from "@/components/ui/toggle";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";


// ─── Zod Schemas ────────────────────────────────────────────────────────────

const busSchema = z.object({
  matricule: z.string().min(1, "La matricule est obligatoire").regex(
    /^[A-Za-z0-9\-\s]+$/,
    "Format invalide (ex: 12345-A-6)"
  ),
  busType: z.enum(["Bus", "Minibus"]),
  status: z.enum(["Active", "Maintenance", "Out of Service"]),
  capacity: z.string().optional(),
  destination: z.string().optional(),
  km: z.string().optional(),
  notes: z.string().optional(),
});

const tripSchema = z.object({
  matricule: z.string().min(1, "Veuillez sélectionner une destination"),
  date: z.string().min(1, "La date est obligatoire"),
  time: z.string().min(1, "L'heure est obligatoire"),
});

const pointageSchema = z.object({
  isWorking: z.boolean(),
  driverName: z.string().optional(),
  employeeCount: z.string().optional(),
  destination: z.string().optional(),
  comment: z.string().optional(),
});

type BusFormValues = z.infer<typeof busSchema>;
type TripFormValues = z.infer<typeof tripSchema>;
type PointageFormValues = z.infer<typeof pointageSchema>;

const BusPage = () => {
  const { ProjectID } = store();
  const projectId = (ProjectID || undefined) as Id<"Project"> | undefined;
  
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"fleet" | "pointage" | "trips">("fleet");
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [deletingTripId, setDeletingTripId] = useState<Id<"supplementaires"> | null>(null);
  const [isDeletingTrip, setIsDeletingTrip] = useState(false);
  const [deletingBusId, setDeletingBusId] = useState<Id<"buses"> | null>(null);
  const [isDeletingBus, setIsDeletingBus] = useState(false);
  const [isSubmittingBus, setIsSubmittingBus] = useState(false);
  const [pointageDate, setPointageDate] = useState(moment().format("YYYY-MM-DD"));
  const [editingPointage, setEditingPointage] = useState<any>(null);
  const [isEditPointageOpen, setIsEditPointageOpen] = useState(false);
  const [deletingPointageId, setDeletingPointageId] = useState<Id<"busTracking"> | null>(null);
  const [isDeletingPointage, setIsDeletingPointage] = useState(false);

  const today = moment().format("YYYY-MM-DD");

  // Queries — fleet tab always shows today; pointage tab has its own date picker
  const busesQueryResult = useQuery(api.functions.buses.getBuses, {
    siteId: projectId,
    date: today,
  });

  const buses = Array.isArray(busesQueryResult) ? busesQueryResult : [];
  const busesError = busesQueryResult && !Array.isArray(busesQueryResult) ? (busesQueryResult as any).error : null;

  const visibleBuses = buses.filter((bus) => {
    const matchesType = typeFilter === "all" || bus.busType === typeFilter;
    const matchesStatus = statusFilter === "all" || bus.status === statusFilter;
    const destinationLabel = bus.destination?.trim();
    const searchLower = search.trim().toLowerCase();
    const matchesSearch =
      !searchLower ||
      [destinationLabel, bus.matricule, bus.siteName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchLower));

    return matchesType && matchesStatus && matchesSearch;
  });

  const kpisQueryResult = useQuery(api.functions.buses.getBusKPIs, { 
    date: pointageDate,
    siteId: projectId,
  });

  const kpis = kpisQueryResult && !("error" in kpisQueryResult) ? kpisQueryResult : null;
  const kpisError = kpisQueryResult && "error" in kpisQueryResult ? (kpisQueryResult as any).error : null;

  // Pointage Query
  const pointageData = useQuery(
    api.functions.buses.getPointageByDate,
    projectId ? { siteId: projectId, date: pointageDate } : "skip"
  );

  // Mutations
  const createBus = useMutation(api.functions.buses.createBus);
  const updateBus = useMutation(api.functions.buses.updateBus);
  const archiveBus = useMutation(api.functions.buses.archiveBus);
  const recordTracking = useMutation(api.functions.buses.recordDailyTracking);
  const createPointage = useMutation(api.functions.buses.createPointage);
  const updatePointage = useMutation(api.functions.buses.updatePointage);
  const deletePointage = useMutation(api.functions.buses.deletePointage);

  const handleRecordTracking = async (busId: Id<"buses">, isWorking: boolean) => {
    try {
      await recordTracking({
        busId,
        date: today,
        isWorking,
      });
      toast.success("Suivi mis à jour");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleCreatePointage = async (data: any) => {
    try {
      await createPointage({
        busId: data.busId,
        siteId: projectId!,
        date: pointageDate,
        isWorking: data.isWorking,
        driverName: data.driverName || undefined,
        employeeCount: data.employeeCount ? Number(data.employeeCount) : undefined,
        destination: data.destination || undefined,
        comment: data.comment || undefined,
      });
      toast.success("Pointage ajouté");
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout du pointage");
    }
  };

  const handleUpdatePointage = async (data: any) => {
    if (!editingPointage) return;
    try {
      await updatePointage({
        id: editingPointage._id,
        isWorking: data.isWorking,
        driverName: data.driverName || undefined,
        employeeCount: data.employeeCount ? Number(data.employeeCount) : undefined,
        destination: data.destination || undefined,
        comment: data.comment || undefined,
      });
      toast.success("Pointage mis à jour");
      setIsEditPointageOpen(false);
      setEditingPointage(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleDeletePointage = async () => {
    if (!deletingPointageId) return;
    setIsDeletingPointage(true);
    try {
      await deletePointage({ id: deletingPointageId });
      toast.success("Pointage supprimé");
      setDeletingPointageId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setIsDeletingPointage(false);
    }
  };

  // Trips Queries
  const tripsQueryResult = useQuery(
    api.functions.buses.getSupplementaires,
    projectId ? { siteId: projectId } : "skip"
  );
  const trips = Array.isArray(tripsQueryResult) ? tripsQueryResult : [];

  const addTrip = useMutation(api.functions.buses.addSupplementaire);
  const deleteTrip = useMutation(api.functions.buses.deleteSupplementaire);

  const handleAddTrip = async (data: any) => {
    setIsCreatingTrip(true);
    try {
      await addTrip({
        matricule: data.matricule,
        siteId: projectId as any,
        date: data.date,
        time: data.time,
      });
      toast.success("Trajet supplémentaire ajouté");
      setIsAddTripDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!deletingTripId) return;
    setIsDeletingTrip(true);
    try {
      await deleteTrip({ id: deletingTripId });
      toast.success("Trajet supprimé");
      setDeletingTripId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setIsDeletingTrip(false);
    }
  };

  const handleArchiveBus = async () => {
    if (!deletingBusId) return;
    setIsDeletingBus(true);
    try {
      await archiveBus({ id: deletingBusId });
      toast.success("Bus supprimé");
      setDeletingBusId(null);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setIsDeletingBus(false);
    }
  };

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-ash">
        <svg className="w-12 h-11 opacity-20" width="457" height="268" viewBox="0 0 457 268" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.7523 221.748C130.997 224.167 159.239 246.1 197.289 177.128C217.19 141.056 187.597 107.922 208.143 72.214C253.226 -6.13942 438.972 85.3512 438.972 85.3512" stroke="currentColor" strokeWidth="81" />
        </svg>
        <p className="text-sm">Veuillez sélectionner un projet pour gérer les bus.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-2 w-full max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl text-ink">Gestion des Bus</h1>
        <p className="text-ash text-sm mt-1">Suivi quotidien et gestion de la flotte par site</p>
      </div>

      {/* View Switcher */}
      <div className="flex gap-2 bg-ash/5 p-1 rounded-md w-fit">
        <button
          onClick={() => setActiveTab("fleet")}
          className={`px-4 py-1.5 text-sm transition-all !rounded-md ${
            activeTab === "fleet" ? "bg-white shadow-sm text-ink font-medium" : "text-ash hover:text-ink"
          }`}
        >
          Flotte de Bus
        </button>
        <button
          onClick={() => setActiveTab("pointage")}
          className={`px-4 py-1.5 text-sm transition-all !rounded-md ${
            activeTab === "pointage" ? "bg-white shadow-sm text-ink font-medium" : "text-ash hover:text-ink"
          }`}
        >
          Pointage
        </button>
        <button
          onClick={() => setActiveTab("trips")}
          className={`px-4 py-1.5 text-sm transition-all !rounded-md ${
            activeTab === "trips" ? "bg-white shadow-sm text-ink font-medium" : "text-ash hover:text-ink"
          }`}
        >
          Trajets Supplémentaires
        </button>
      </div>

      {activeTab === "fleet" && (
        <>
          {/* Filters & Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-end bg-white p-4 rounded-lg border border-hairline shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 flex-1">
              <div className="space-y-1.5">
                <Label className="text-xs text-ash">Recherche</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-ash" />
                  <Input
                    placeholder="Destination..."
                    className="pl-8 h-9 !rounded-md"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-ash">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9 !rounded-md">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Minibus">Minibus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-ash">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 !rounded-md">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="Active">Actif</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Out of Service">Hors Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="h-9 gap-2 !rounded-md"
              onClick={() => {
                setEditingBus(null);
                setIsAddDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4" /> Nouveau Bus
            </Button>
          </div>

          {/* Bus Table */}
          <Card className="overflow-hidden w-full border-hairline shadow-sm">
            <Table>
              <TableHeader className="bg-ash/5">
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>KM</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>En service</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {busesQueryResult === undefined ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-ash/40" />
                    </TableCell>
                  </TableRow>
                ) : visibleBuses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-ash">
                      {busesError || "Aucun bus trouvé."}
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleBuses.map((bus) => (
                    <TableRow key={bus._id}>
                      <TableCell className="font-medium uppercase">{bus.matricule}</TableCell>
                      <TableCell className="font-medium">{bus.destination?.trim() || "-"}</TableCell>
                      <TableCell>{bus.busType}</TableCell>
                      <TableCell>{bus.siteName}</TableCell>
                      <TableCell className="text-sm">{bus.km || "-"}</TableCell>
                      <TableCell>
                        <StatusBadge status={bus.status} />
                      </TableCell>
                      <TableCell>
                        <Toggle
                          pressed={bus.workingToday}
                          onPressedChange={(pressed) => handleRecordTracking(bus._id, pressed)}
                          className={`h-8 px-3 gap-2 data-[state=on]:bg-primary data-[state=on]:text-white !rounded-md`}
                          disabled={bus.status !== "Active"}
                        >
                          {bus.workingToday ? "Oui" : "Non"}
                        </Toggle>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 !rounded-md"
                            onClick={() => {
                              setEditingBus(bus);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 !rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeletingBusId(bus._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Add Bus Dialog */}
          <BusDialog
            open={isAddDialogOpen && !editingBus}
            onOpenChange={(open: boolean) => {
              setIsAddDialogOpen(open);
              if (!open) setEditingBus(null);
            }}
            title="Ajouter un nouveau bus"
            isLoading={isSubmittingBus}
            onSubmit={async (data: any) => {
              setIsSubmittingBus(true);
              try {
                await createBus({
                  matricule: data.matricule,
                  busType: data.busType,
                  status: data.status,
                  siteId: projectId,
                  capacity: data.capacity ? Number(data.capacity) : undefined,
                  destination: data.destination || undefined,
                  km: data.km ? Number(data.km) : undefined,
                  notes: data.notes || undefined,
                });
                toast.success("Bus ajouté avec succès");
                setIsAddDialogOpen(false);
              } catch (error: any) {
                toast.error(error.message || "Erreur lors de l'ajout");
              } finally {
                setIsSubmittingBus(false);
              }
            }}
          />

          {/* Edit Bus Dialog */}
          {editingBus && (
            <BusDialog
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              title="Modifier le bus"
              initialData={editingBus}
              isLoading={isSubmittingBus}
              onSubmit={async (data: any) => {
                setIsSubmittingBus(true);
                try {
                  await updateBus({
                    id: editingBus._id,
                    matricule: data.matricule,
                    busType: data.busType,
                    status: data.status,
                    capacity: data.capacity ? Number(data.capacity) : undefined,
                    destination: data.destination || undefined,
                    km: data.km ? Number(data.km) : undefined,
                    notes: data.notes || undefined,
                  });
                  toast.success("Bus mis à jour");
                  setIsEditDialogOpen(false);
                } catch (error: any) {
                  toast.error(error.message || "Erreur lors de la mise à jour");
                } finally {
                  setIsSubmittingBus(false);
                }
              }}
            />
          )}

          {/* Delete Bus Confirmation */}
          <DeleteConfirmDialog
            open={!!deletingBusId}
            onOpenChange={(open: boolean) => { if (!open && !isDeletingBus) setDeletingBusId(null); }}
            title="Supprimer le bus"
            description="Êtes-vous sûr de vouloir supprimer ce bus ? Cette action est irréversible."
            isLoading={isDeletingBus}
            onConfirm={handleArchiveBus}
            onCancel={() => setDeletingBusId(null)}
          />
        </>
      )}

      {activeTab === "pointage" && (
        <>
          {/* Date Picker & Actions */}
          <div className="flex flex-col md:flex-row gap-4 justify-between w-full items-end bg-white p-4 rounded-lg border border-hairline shadow-sm">
            <div className="flex items-end gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-ash">Date du pointage</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-ash" />
                  <Input
                    type="date"
                    value={pointageDate}
                    onChange={(e) => setPointageDate(e.target.value)}
                    className="pl-8 h-9 !rounded-md w-56"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                className="h-9 !rounded-md"
                onClick={() => setPointageDate(today)}
              >
                Aujourd'hui
              </Button>
            </div>
            <div className="text-sm text-ash">
              {pointageData && Array.isArray(pointageData) && (
                <span>{pointageData.filter(p => p.pointage?.isWorking).length} / {pointageData.length} bus en service</span>
              )}
            </div>
          </div>

          {/* Pointage Table */}
          <Card className="overflow-hidden w-full border-hairline shadow-sm">
            <Table>
              <TableHeader className="bg-ash/5">
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Destination (Bus)</TableHead>
                  <TableHead>En service</TableHead>
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Employés</TableHead>
                  <TableHead>Destination (Pointage)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointageData === undefined ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-ash/40" />
                    </TableCell>
                  </TableRow>
                ) : !Array.isArray(pointageData) || pointageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-ash">
                      Aucun bus trouvé pour cette date.
                    </TableCell>
                  </TableRow>
                ) : (
                  pointageData.map((row: any) => {
                    const p = row.pointage;
                    return (
                      <TableRow key={row.busId}>
                        <TableCell className="font-medium uppercase">{row.matricule}</TableCell>
                        <TableCell>{row.busType}</TableCell>
                        <TableCell className="text-xs text-ash">{row.busDestination?.trim() || "-"}</TableCell>
                        <TableCell>
                          {p ? (
                            <span className={cn(
                              "inline-flex items-center gap-1 text-xs font-medium",
                              p.isWorking ? "text-green-600" : "text-red-500"
                            )}>
                              {p.isWorking ? "Oui" : "Non"}
                            </span>
                          ) : (
                            <span className="text-ash text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{p?.driverName || "-"}</TableCell>
                        <TableCell className="text-sm">{p?.employeeCount ?? "-"}</TableCell>
                        <TableCell className="text-xs text-ash">{p?.destination?.trim() || "-"}</TableCell>
                        <TableCell className="text-xs text-ash max-w-[150px] truncate">{p?.comment || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {!p ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 !rounded-md text-primary"
                                onClick={() => {
                                  setEditingPointage({ busId: row.busId, matricule: row.matricule, isWorking: true });
                                  setIsAddDialogOpen(true);
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 !rounded-md"
                                  onClick={() => {
                                    setEditingPointage({ ...p, matricule: row.matricule, busId: row.busId });
                                    setIsEditPointageOpen(true);
                                  }}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 !rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setDeletingPointageId(p._id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Add Pointage Dialog */}
          <PointageDialog
            open={isAddDialogOpen && editingPointage && !editingPointage?._id}
            onOpenChange={(open: boolean) => { setIsAddDialogOpen(open); if (!open) setEditingPointage(null); }}
            title={`Ajouter un pointage - ${editingPointage?.matricule || ""}`}
            busId={editingPointage?.busId}
            initialData={null}
            onSubmit={handleCreatePointage}
          />

          {/* Edit Pointage Dialog */}
          {editingPointage?._id && (
            <PointageDialog
              
              open={isEditPointageOpen}
              onOpenChange={setIsEditPointageOpen}
              title={`Modifier le pointage - ${editingPointage?.matricule || ""}`}
              busId={editingPointage?.busId}
              initialData={editingPointage}
              onSubmit={handleUpdatePointage}
              
            />
          )}

          {/* Delete Pointage Confirmation */}
          <DeleteConfirmDialog
            open={!!deletingPointageId}
            onOpenChange={(open: boolean) => { if (!open && !isDeletingPointage) setDeletingPointageId(null); }}
            title="Supprimer le pointage"
            description="Êtes-vous sûr de vouloir supprimer ce pointage ? Cette action est irréversible."
            isLoading={isDeletingPointage}
            onConfirm={handleDeletePointage}
            onCancel={() => setDeletingPointageId(null)}
          />
        </>
      )}

      {activeTab === "trips" && (
        <div className="space-y-6">
          {/* Actions */}
          <div className="flex justify-between w-full items-center bg-white p-4 rounded-lg border border-hairline shadow-sm">
            <div>
              <h2 className="text-sm font-medium text-ink">Trajets Supplémentaires</h2>
              <p className="text-xs text-ash">Liste des trajets supplémentaires enregistrés pour ce projet</p>
            </div>
            <Button
              className="h-9 gap-2 !rounded-md"
              onClick={() => setIsAddTripDialogOpen(true)}
              disabled={buses.length === 0}
            >
              <Plus className="w-4 h-4" /> Nouveau Trajet
            </Button>
          </div>

          {/* Trips Table */}
          <Card className="overflow-hidden w-full border-hairline shadow-sm">
            <Table>
              <TableHeader className="bg-ash/5">
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tripsQueryResult === undefined ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-ash/40" />
                    </TableCell>
                  </TableRow>
                ) : trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-ash">
                      Aucun trajet supplémentaire enregistré.
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip: any) => (
                    <TableRow key={trip._id}>
                      <TableCell className="font-medium">{trip.destination?.trim() || "-"}</TableCell>
                      <TableCell>{moment(trip.date).format("DD/MM/YYYY")}</TableCell>
                      <TableCell>{trip.time}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 !rounded-md text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeletingTripId(trip._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* Add Trip Dialog */}
      <AddTripDialog
        open={isAddTripDialogOpen}
        onOpenChange={setIsAddTripDialogOpen}
        buses={buses}
        onSubmit={handleAddTrip}
        isLoading={isCreatingTrip}
      />

      {/* Delete Trip Confirmation */}
      <DeleteConfirmDialog
        open={!!deletingTripId}
        onOpenChange={(open: boolean) => { if (!open && !isDeletingTrip) setDeletingTripId(null); }}
        title="Supprimer le trajet"
        description="Êtes-vous sûr de vouloir supprimer ce trajet supplémentaire ? Cette action est irréversible."
        isLoading={isDeletingTrip}
        onConfirm={handleDeleteTrip}
        onCancel={() => setDeletingTripId(null)}
      />
    </div>
  );
};

// ─── Sub-components ─────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  return <Badge variant="tag">{status}</Badge>;
};

const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  isLoading,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[380px]">
      <DialogHeader>
        <DialogTitle className="font-normal flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100">
            <Trash2 className="w-4 h-4 text-red-600" />
          </div>
          {title}
        </DialogTitle>
      </DialogHeader>
      <p className="text-sm text-ash py-2">{description}</p>
      <DialogFooter className="gap-2">
        <Button variant="outline" className="!rounded-md" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="destructive" className="!rounded-md gap-2" onClick={onConfirm} disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Supprimer
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const BusDialog = ({ open, onOpenChange, title, onSubmit, initialData, isLoading }: any) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BusFormValues>({
    resolver: zodResolver(busSchema),
    defaultValues: {
      matricule: "",
      busType: "Bus",
      status: "Active",
      capacity: "",
      destination: "",
      km: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        matricule: initialData.matricule,
        busType: initialData.busType,
        status: initialData.status,
        capacity: initialData.capacity !== undefined ? String(initialData.capacity) : "",
        notes: initialData.notes || "",
        km: initialData.km !== undefined ? String(initialData.km) : "",
        destination: initialData.destination || "",
      });
    } else if (open && !initialData) {
      reset({
        matricule: "",
        busType: "Bus",
        status: "Active",
        capacity: "",
        notes: "",
        km: "",
        destination: "",
      });
    }
  }, [open, initialData, reset]);

  if (isLoading) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[260px] flex flex-col items-center justify-center gap-4 py-10" showCloseButton={false}>
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-ash text-center">Enregistrement en cours...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-normal">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="matricule">Matricule <span className="text-red-500">*</span></Label>
            <Input
              id="matricule"
              className={cn("!rounded-md", errors.matricule && "border-red-500 focus:ring-red-500")}
              placeholder="ex: 12345-A-6"
              {...register("matricule")}
            />
            {errors.matricule && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.matricule.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
              <Controller
                name="busType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="type" className={cn("!rounded-md", errors.busType && "border-red-500")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Minibus">Minibus</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.busType && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.busType.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Statut <span className="text-red-500">*</span></Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className={cn("!rounded-md", errors.status && "border-red-500")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Actif</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Out of Service">Hors Service</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{errors.status.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacité (optionnel)</Label>
            <Input
              id="capacity"
              type="number"
              min={1}
              className={cn("!rounded-md", errors.capacity && "border-red-500")}
              {...register("capacity")}
            />
            {errors.capacity && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.capacity.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="destination">Destination (optionnel)</Label>
            <Input
              id="destination"
              className="!rounded-md"
              placeholder="ex: Sidi shaf -> chu rabat"
              {...register("destination")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="km">KM (optionnel)</Label>
            <Input
              id="km"
              type="number"
              min={0}
              className={cn("!rounded-md", errors.km && "border-red-500")}
              {...register("km")}
            />
            {errors.km && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.km.message as string}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              className="!rounded-md"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="submit" className="!rounded-md">
              {initialData ? "Enregistrer les modifications" : "Ajouter le bus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const PointageDialog = ({
  open,
  onOpenChange,
  title,
  busId,
  initialData,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  busId: string;
  initialData: any;
  onSubmit: (data: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PointageFormValues>({
    resolver: zodResolver(pointageSchema),
    defaultValues: {
      isWorking: true,
      driverName: "",
      employeeCount: "",
      destination: "",
      comment: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        isWorking: initialData?.isWorking ?? true,
        driverName: initialData?.driverName || "",
        employeeCount: initialData?.employeeCount?.toString() ?? "",
        destination: initialData?.destination || "",
        comment: initialData?.comment || "",
      });
    }
  }, [open, initialData, reset]);

  const isWorking = watch("isWorking");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-normal">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => onSubmit({ ...data, busId }))} className="grid gap-4 py-4">
          {/* En service toggle */}
          <div className="flex items-center gap-3 p-3 bg-ash/5 rounded-lg">
            <span className="text-sm text-ink">Bus en service</span>
            <button
              type="button"
              onClick={() => setValue("isWorking", !isWorking)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                isWorking ? "bg-green-500" : "bg-ash/30"
              )}
            >
              <span
                className={cn(
                  "inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform",
                  isWorking ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          <DialogFooter>
            <Button type="submit" className="!rounded-md">
              {initialData?._id ? "Enregistrer les modifications" : "Ajouter le pointage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddTripDialog = ({ open, onOpenChange, buses, onSubmit, isLoading }: any) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      matricule: "",
      date: moment().format("YYYY-MM-DD"),
      time: moment().format("HH:mm"),
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        matricule: buses[0]?.matricule || "",
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm"),
      });
    }
  }, [open, buses, reset]);

  if (isLoading) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-[260px] flex flex-col items-center justify-center gap-4 py-10" showCloseButton={false}>
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm text-ash text-center">Enregistrement en cours...</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-normal">Ajouter un trajet supplémentaire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="trip-destination">Destination du Bus</Label>
            <Controller
              name="matricule"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="trip-destination"
                    className={cn("!rounded-md", errors.matricule && "border-red-500 focus:ring-red-500")}
                  >
                    <SelectValue placeholder="Sélectionner une destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {buses.map((bus: any) => (
                      <SelectItem key={bus._id} value={bus.matricule}>
                        {bus.destination?.trim() || "Sans destination"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.matricule && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.matricule.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="trip-date">Date</Label>
            <Input
              id="trip-date"
              type="date"
              className={cn("!rounded-md", errors.date && "border-red-500 focus:ring-red-500")}
              {...register("date")}
            />
            {errors.date && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.date.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="trip-time">Heure</Label>
            <Input
              id="trip-time"
              type="time"
              className={cn("!rounded-md", errors.time && "border-red-500 focus:ring-red-500")}
              {...register("time")}
            />
            {errors.time && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{errors.time.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" className="!rounded-md">
              Ajouter le trajet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BusPage;
