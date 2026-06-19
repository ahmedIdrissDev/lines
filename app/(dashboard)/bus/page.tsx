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
  AlertCircle
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

const BusPage = () => {
  const { ProjectID } = store();
  const projectId = (ProjectID || undefined) as Id<"Project"> | undefined;
  
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"fleet" | "trips">("fleet");
  const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);

  const today = moment().format("YYYY-MM-DD");

  // Queries
  const busesQueryResult = useQuery(api.functions.buses.getBuses, {
    siteId: projectId,
    busType: typeFilter === "all" ? undefined : (typeFilter as any),
    status: statusFilter === "all" ? undefined : (statusFilter as any),
    search: search || undefined,
    date: today
  });

  const buses = Array.isArray(busesQueryResult) ? busesQueryResult : [];
  const busesError = busesQueryResult && !Array.isArray(busesQueryResult) ? (busesQueryResult as any).error : null;

  const kpisQueryResult = useQuery(api.functions.buses.getBusKPIs, { 
    date: today,
    siteId: projectId 
  });

  const kpis = kpisQueryResult && !("error" in kpisQueryResult) ? kpisQueryResult : null;
  const kpisError = kpisQueryResult && "error" in kpisQueryResult ? (kpisQueryResult as any).error : null;

  const allProjects = useQuery(api.functions.project.getProjects);

  // Trips Queries
  const tripsQueryResult = useQuery(
    api.functions.buses.getSupplementaires,
    projectId ? { siteId: projectId } : "skip"
  );
  const trips = Array.isArray(tripsQueryResult) ? tripsQueryResult : [];

  // Mutations
  const createBus = useMutation(api.functions.buses.createBus);
  const updateBus = useMutation(api.functions.buses.updateBus);
  const archiveBus = useMutation(api.functions.buses.archiveBus);
  const recordTracking = useMutation(api.functions.buses.recordDailyTracking);
  const addTrip = useMutation(api.functions.buses.addSupplementaire);
  const deleteTrip = useMutation(api.functions.buses.deleteSupplementaire);

  const handleAddTrip = async (data: any) => {
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
    }
  };

  const handleDeleteTrip = async (id: Id<"supplementaires">) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      try {
        await deleteTrip({ id });
        toast.success("Trajet supprimé");
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression");
      }
    }
  };

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

  const handleArchiveBus = async (id: Id<"buses">) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce bus ?")) {
      try {
        await archiveBus({ id });
        toast.success("Bus supprimé");
      } catch (error: any) {
        toast.error(error.message || "Erreur lors de la suppression");
      }
    }
  };

  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-ash">
        <Bus className="w-12 h-12 opacity-20 mb-4" />
        <p className="text-sm">Veuillez sélectionner un projet pour gérer les bus.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-2 w-full max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl  text-ink">Gestion des Bus</h1>
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
                placeholder="Matricule..."
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
          onClick={() => setIsAddDialogOpen(true)}
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
              <TableHead>Type</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>KM</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>En service aujourd'hui</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {busesQueryResult === undefined ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-ash/40" />
                </TableCell>
              </TableRow>
            ) : buses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-ash">
                  {busesError || "Aucun bus trouvé."}
                </TableCell>
              </TableRow>
            ) : (
              buses.map((bus) => (
                <TableRow key={bus._id}>
                  <TableCell className="font-medium">{bus.matricule}</TableCell>
                  <TableCell>{bus.busType}</TableCell>
                  <TableCell>{bus.siteName}</TableCell>
                  <TableCell className="text-sm">{bus.destination || "-"}</TableCell>
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
                        className="h-8 w-8 !rounded-md"
                        onClick={() => handleArchiveBus(bus._id)}
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
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Ajouter un nouveau bus"
        onSubmit={async (data: any) => {
          try {
            await createBus({ ...data, siteId: projectId });
            toast.success("Bus ajouté avec succès");
            setIsAddDialogOpen(false);
          } catch (error: any) {
            toast.error(error.message || "Erreur lors de l'ajout");
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
          onSubmit={async (data: any) => {
            try {
              await updateBus({ id: editingBus._id, ...data });
              toast.success("Bus mis à jour");
              setIsEditDialogOpen(false);
            } catch (error: any) {
              toast.error(error.message || "Erreur lors de la mise à jour");
            }
          }}
        />
      )}
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
                  <TableHead>Matricule</TableHead>
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
                  trips.map((trip) => (
                    <TableRow key={trip._id}>
                      <TableCell className="font-medium">{trip.matricule}</TableCell>
                      <TableCell>{moment(trip.date).format("DD/MM/YYYY")}</TableCell>
                      <TableCell>{trip.time}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 !rounded-md"
                          onClick={() => handleDeleteTrip(trip._id)}
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
      />
    </div>
  );
};

const AddTripDialog = ({ open, onOpenChange, buses, onSubmit }: any) => {
  const [formData, setFormData] = useState({
    matricule: "",
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm"),
  });

  React.useEffect(() => {
    if (open) {
      setFormData({
        matricule: buses[0]?.matricule || "",
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm"),
      });
    }
  }, [open, buses]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] ">
        <DialogHeader>
          <DialogTitle className="font-normal">Ajouter un trajet supplémentaire</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="trip-matricule">Matricule du Bus</Label>
            <Select 
              value={formData.matricule} 
              onValueChange={(v) => setFormData({ ...formData, matricule: v })}
            >
              <SelectTrigger id="trip-matricule" className="!rounded-md">
                <SelectValue placeholder="Sélectionner un bus" />
              </SelectTrigger>
              <SelectContent>
                {buses.map((bus: any) => (
                  <SelectItem key={bus._id} value={bus.matricule}>
                    {bus.matricule} ({bus.busType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trip-date">Date</Label>
            <Input
              id="trip-date"
              type="date"
              className="!rounded-md"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trip-time">Heure</Label>
            <Input
              id="trip-time"
              type="time"
              className="!rounded-md"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="!rounded-md" onClick={() => onSubmit(formData)}>
            Ajouter le trajet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};



const StatusBadge = ({ status }: { status: string }) => {
   
      return <Badge variant="tag">{status}</Badge>;
  
};

const BusDialog = ({ open, onOpenChange, title, onSubmit, initialData }: any) => {
  const [formData, setFormData] = useState({
    matricule: initialData?.matricule || "",
    busType: initialData?.busType || "Bus",
    status: initialData?.status || "Active",
    capacity: initialData?.capacity || undefined,
    notes: initialData?.notes || "",
    km: initialData?.km || undefined,
    destination: initialData?.destination || "",
  });

  React.useEffect(() => {
    if (open && initialData) {
      setFormData({
        matricule: initialData.matricule,
        busType: initialData.busType,
        status: initialData.status,
        capacity: initialData.capacity,
        notes: initialData.notes || "",
        km: initialData.km,
        destination: initialData.destination || "",
      });
    } else if (open && !initialData) {
      setFormData({
        matricule: "",
        busType: "Bus",
        status: "Active",
        capacity: undefined,
        notes: "",
        km: undefined,
        destination: "",
      });
    }
  }, [open, initialData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl ">
        <DialogHeader>
          <DialogTitle className="font-normal">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="matricule">Matricule</Label>
            <Input
              id="matricule"
              className="!rounded-md"
              value={formData.matricule}
              onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
              placeholder="ex: 12345-A-6"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.busType} 
                onValueChange={(v) => setFormData({ ...formData, busType: v as any })}
              >
                <SelectTrigger id="type" className="!rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bus">Bus</SelectItem>
                  <SelectItem value="Minibus">Minibus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(v) => setFormData({ ...formData, status: v as any })}
              >
                <SelectTrigger id="status" className="!rounded-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Actif</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Out of Service">Hors Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="capacity">Capacité (optionnel)</Label>
            <Input
              id="capacity"
              className="!rounded-md"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination (optionnel)</Label>
            <Input
              id="destination"
              className="!rounded-md"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="ex: Sidi shaf -> chu rabat"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="km">KM (optionnel)</Label>
            <Input
              id="km"
              className="!rounded-md"
              type="number"
              value={formData.km || ""}
              onChange={(e) => setFormData({ ...formData, km: e.target.value ? parseInt(e.target.value) : undefined })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              className="!rounded-md"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="!rounded-md" onClick={() => onSubmit(formData)}>
            {initialData ? "Enregistrer les modifications" : "Ajouter le bus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BusPage;
