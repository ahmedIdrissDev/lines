"use client";

import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  AlertCircle,
  BadgeCheck,
  CheckCircle2,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AttendanceAction = "check-in" | "check-out";
type AttendanceStatus = "not-checked-in" | "checked-in" | "checked-out";
type ActionState =
  | "idle"
  | "requesting-location"
  | "submitting-attendance"
  | "success"
  | "error";
type LocationPermissionState =
  | "unknown"
  | "prompt"
  | "granted"
  | "denied"
  | "unsupported"
  | "insecure";
type BadgeFlowStep = "start" | "project" | "location" | "attendance";

type EmployeeProfileMetadata = {
  employeeProfile?: {
    name?: string;
    matricule?: string;
    setupCompleted?: boolean;
  };
};

type BadgeState = {
  employee: {
    name: string;
    matricule: string;
  };
  project: {
    id: Id<"Project">;
    name: string;
    locationConfigured: boolean;
  } | null;
  attendance: {
    attendanceDate: string;
    checkInTime?: number;
    checkOutTime?: number;
    status: AttendanceStatus;
  };
};

type BadgeStateResult = BadgeState | { error: string };

type SetupResult = {
  success: boolean;
  employee: {
    name: string;
    matricule: string;
  };
};

type AttendanceResult = {
  success: boolean;
  action: AttendanceAction;
  attendanceStatus: "checked-in" | "checked-out";
  eventTime: number;
  message: string;
};

type LocationSnapshot = {
  latitude: number;
  longitude: number;
  accuracy: number;
  capturedAt: number;
};

type ProjectSummary = {
  _id: Id<"Project">;
  name: string;
  xCoordinate?: number;
  yCoordinate?: number;
  attendanceRadiusMeters?: number;
};

type ProjectsResult = ProjectSummary[] | { error: string };

type AttendanceApi = {
  functions: {
    attendance: {
      getMyBadgeState: FunctionReference<
        "query",
        "public",
        { clerkUserId?: string; name?: string; matricule?: string },
        BadgeStateResult
      >;
      setupMyBadge: FunctionReference<
        "mutation",
        "public",
        { name: string; matricule: string },
        SetupResult
      >;
      recordBadgeAttendance: FunctionReference<
        "mutation",
        "public",
        {
          action: AttendanceAction;
          projectId: Id<"Project">;
          clerkUserId?: string;
          name?: string;
          matricule?: string;
          latitude: number;
          longitude: number;
          accuracy: number;
          capturedAt: number;
        },
        AttendanceResult
      >;
    };
    project: {
      getProjects: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        ProjectsResult
      >;
    };
  };
};

const attendanceApi = api as unknown as AttendanceApi;
const LOCATION_MAX_AGE_MS = 60_000;
const MAX_LOCATION_ACCURACY_METERS = 100;

const ERROR_MESSAGES: Record<string, string> = {
  EMPLOYEE_NOT_FOUND:
    "Votre profil employé est introuvable. Veuillez contacter le service RH.",
  EMPLOYEE_INACTIVE:
    "Votre badge est actuellement désactivé. Veuillez contacter le service RH.",
  NO_ASSIGNED_PROJECT: "Aucun chantier ne vous est actuellement affecté.",
  PROJECT_LOCATION_MISSING:
    "La localisation de ce chantier n’est pas encore configurée.",
  INVALID_LATITUDE: "Une erreur est survenue pendant le pointage. Veuillez réessayer.",
  INVALID_LONGITUDE: "Une erreur est survenue pendant le pointage. Veuillez réessayer.",
  LOCATION_EXPIRED: "Votre position n’est plus récente. Veuillez réessayer.",
  LOCATION_ACCURACY_TOO_LOW:
    "La précision de votre position est insuffisante. Activez la localisation précise puis réessayez.",
  OUTSIDE_CHANTIER_ZONE:
    "Vous êtes en dehors de la zone autorisée du chantier.",
  DUPLICATE_CHECK_IN: "Votre entrée a déjà été enregistrée aujourd’hui.",
  DAY_ALREADY_COMPLETED: "Votre sortie a déjà été enregistrée aujourd’hui.",
  CHECK_OUT_BEFORE_CHECK_IN: "Vous devez d’abord enregistrer votre entrée.",
  DUPLICATE_CHECK_OUT: "Votre sortie a déjà été enregistrée aujourd’hui.",
  POINTAGE_AUTH_UNAVAILABLE:
    "La session de pointage n’est pas prête. Déconnectez-vous puis reconnectez-vous.",
  INVALID_ATTENDANCE_PAYLOAD:
    "Une erreur est survenue pendant le pointage. Veuillez réessayer.",
  INVALID_ATTENDANCE_ACTION:
    "Une erreur est survenue pendant le pointage. Veuillez réessayer.",
  POINTAGE_FAILED:
    "Une erreur est survenue pendant le pointage. Veuillez réessayer.",
  GEOLOCATION_INSECURE:
    "La localisation nécessite une adresse sécurisée. Ouvrez l’application en HTTPS ou sur localhost.",
  GEOLOCATION_UNSUPPORTED:
    "La localisation n’est pas prise en charge par cet appareil.",
  SETUP_REQUIRED_FIELDS: "Le nom complet et la matricule sont obligatoires.",
  MATRICULE_ALREADY_LINKED:
    "Cette matricule est déjà liée à un autre compte. Veuillez contacter le service RH.",
  USER_ALREADY_LINKED:
    "Votre compte est déjà lié à un autre employé. Veuillez contacter le service RH.",
  BADGE_STATE_UNAVAILABLE:
    "Une erreur est survenue pendant le chargement du badge. Veuillez réessayer.",
};

const GEOLOCATION_ERROR_MESSAGES: Record<number, string> = {
  1: "La localisation est bloquée pour ce site. Ouvrez les paramètres du navigateur, autorisez la position pour ce site, puis réessayez.",
  2: "Votre position est actuellement indisponible. Réessayez dans quelques instants.",
  3: "La localisation a pris trop de temps. Activez la localisation précise puis réessayez.",
};

function isBadgeState(result: BadgeStateResult | undefined): result is BadgeState {
  return Boolean(result && !("error" in result));
}

function isProjectsResult(result: ProjectsResult | undefined): result is ProjectSummary[] {
  return Array.isArray(result);
}

function getErrorMessage(error: unknown): string {
  const text = error instanceof Error ? error.message : String(error);
  const key = Object.keys(ERROR_MESSAGES).find((code) => text.includes(code));
  return key ? ERROR_MESSAGES[key] : "Une erreur est survenue pendant le pointage. Veuillez réessayer.";
}

function formatBadgeTime(timestamp?: number): string {
  if (!timestamp) return "--:--";

  return new Intl.DateTimeFormat("fr-MA", {
    timeZone: "Africa/Casablanca",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

function getTodayBadgeDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function resolveAllowedRadius(radius?: number): number {
  if (typeof radius !== "number") {
    return 250;
  }

  return Math.min(1000, Math.max(0, radius));
}

function validateCoordinates(latitude: number, longitude: number): void {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new Error("INVALID_LATITUDE");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new Error("INVALID_LONGITUDE");
  }
}

function isValidCoordinatePair(latitude: number, longitude: number): boolean {
  return (
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function calculateDistanceMeters(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number,
): number {
  const earthRadiusMeters = 6_371_000;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const latitudeDelta = toRadians(latitude2 - latitude1);
  const longitudeDelta = toRadians(longitude2 - longitude1);
  const firstLatitude = toRadians(latitude1);
  const secondLatitude = toRadians(latitude2);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMeters * c;
}

function getNearestProjectDistanceMeters(
  location: LocationSnapshot,
  project: ProjectSummary,
): number {
  const projectLatitude = project.yCoordinate;
  const projectLongitude = project.xCoordinate;

  if (
    typeof projectLatitude !== "number" ||
    typeof projectLongitude !== "number" ||
    !isValidCoordinatePair(projectLatitude, projectLongitude)
  ) {
    throw new Error("INVALID_LATITUDE");
  }

  return calculateDistanceMeters(
    location.latitude,
    location.longitude,
    projectLatitude,
    projectLongitude,
  );
}

function validatePointageLocation(
  location: LocationSnapshot,
  project: ProjectSummary | null,
) {
  validateCoordinates(location.latitude, location.longitude);

  if (Date.now() - location.capturedAt > LOCATION_MAX_AGE_MS) {
    throw new Error("LOCATION_EXPIRED");
  }

  if (
    !Number.isFinite(location.accuracy) ||
    location.accuracy <= 0 ||
    location.accuracy > MAX_LOCATION_ACCURACY_METERS
  ) {
    throw new Error("LOCATION_ACCURACY_TOO_LOW");
  }

  if (
    typeof project?.yCoordinate !== "number" ||
    typeof project.xCoordinate !== "number"
  ) {
    throw new Error("PROJECT_LOCATION_MISSING");
  }

  const distanceMeters = getNearestProjectDistanceMeters(location, project);
  const radiusMeters = resolveAllowedRadius(project.attendanceRadiusMeters);

  if (distanceMeters > radiusMeters) {
    throw new Error("OUTSIDE_CHANTIER_ZONE");
  }
}

function requestCurrentLocation(): Promise<LocationSnapshot> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && !window.isSecureContext) {
      reject(new Error("GEOLOCATION_INSECURE"));
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("GEOLOCATION_UNSUPPORTED"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          capturedAt: position.timestamp || Date.now(),
        });
      },
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 15_000,
        maximumAge: 0,
      },
    );
  });
}

function isFreshLocation(location: LocationSnapshot | null): location is LocationSnapshot {
  return Boolean(location && Date.now() - location.capturedAt < 45_000);
}

const BadgeLoadingSkeleton = () => (
  <main className="min-h-dvh overflow-x-hidden bg-primary">
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] min-w-0 flex-col gap-4 bg-background p-5 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-56 w-full rounded-md" />
      <Skeleton className="h-36 w-full rounded-md" />
      <Skeleton className="h-16 w-full rounded-full" />
    </div>
  </main>
);

const Feedback = ({ message, type }: { message: string | null; type: "error" | "success" }) => {
  if (!message) return null;

  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div
      aria-live="polite"
      className="flex items-start gap-3 rounded-md border border-hairline bg-surface-card p-4 body-sm"
    >
      <Icon className={type === "success" ? "text-badge-success" : "text-destructive"} />
      <p>{message}</p>
    </div>
  );
};

const StepBadge = ({
  activeStep,
}: {
  activeStep: BadgeFlowStep;
}) => {
  const steps: Array<{ id: BadgeFlowStep; label: string }> = [
    { id: "start", label: "Début" },
    { id: "project", label: "Chantier" },
    { id: "location", label: "Position" },
    { id: "attendance", label: "Pointage" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 rounded-md border border-hairline bg-surface-card p-2">
      {steps.map((step, index) => {
        const isActive = activeStep === step.id;
        const isDone =
          steps.findIndex((item) => item.id === activeStep) > index;

        return (
          <div
            key={step.id}
            className={cn(
              "flex min-h-10 items-center justify-center rounded-full border px-2 caption-tight",
              isActive && "border-primary bg-primary text-on-primary",
              isDone && "border-badge-success bg-badge-success text-on-dark",
              !isActive && !isDone && "border-transparent bg-surface-bone text-ash",
            )}
          >
            {isDone ? <CheckCircle2 /> : step.label}
          </div>
        );
      })}
    </div>
  );
};

const BadgeBarcode = () => (
  <div className="flex h-9 items-end gap-1 rounded-sm bg-surface-bone px-3 py-2" aria-hidden="true">
    {[3, 7, 4, 10, 5, 8, 3, 11, 6, 4, 9, 5, 7, 3, 10, 4].map(
      (height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-1 bg-ink"
          style={{ height }}
        />
      ),
    )}
  </div>
);

function getAttendanceStatusContent(status: AttendanceStatus) {
  if (status === "checked-in") {
    return {
      label: "Présent",
      description: "Présent sur le chantier",
      variant: "success" as const,
    };
  }

  if (status === "checked-out") {
    return {
      label: "Terminé",
      description: "Journée terminée",
      variant: "secondary" as const,
    };
  }

  return {
    label: "À pointer",
    description: "Entrée non enregistrée",
    variant: "outline" as const,
  };
}

const BadgePage = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [setupCompletedOverride, setSetupCompletedOverride] = useState(false);
  const [setupProfileOverride, setSetupProfileOverride] = useState<{
    name: string;
    matricule: string;
  } | null>(null);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [setupLoading, setSetupLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"Project"> | "">("");
  const [currentLocation, setCurrentLocation] = useState<LocationSnapshot | null>(null);
  const [locationPermission, setLocationPermission] =
    useState<LocationPermissionState>("unknown");
  const [flowStep, setFlowStep] = useState<BadgeFlowStep>("start");
  const [flowOpen, setFlowOpen] = useState(false);

  const metadata = user?.publicMetadata as EmployeeProfileMetadata | undefined;
  const metadataProfile = metadata?.employeeProfile;
  const metadataName =
    setupProfileOverride?.name ??
    (typeof metadataProfile?.name === "string" ? metadataProfile.name.trim() : "");
  const metadataMatricule =
    setupProfileOverride?.matricule ??
    (typeof metadataProfile?.matricule === "string"
      ? metadataProfile.matricule.trim()
      : "");
  const setupCompleted = Boolean(
    setupCompletedOverride ||
      (metadataProfile?.setupCompleted && metadataName && metadataMatricule),
  );

  const badgeStateResult = useQuery(
    attendanceApi.functions.attendance.getMyBadgeState,
    isLoaded && isSignedIn && setupCompleted
      ? { clerkUserId: user?.id, name: metadataName, matricule: metadataMatricule }
      : "skip",
  );
  const projectsResult = useQuery(
    attendanceApi.functions.project.getProjects,
    isLoaded && isSignedIn && setupCompleted ? {} : "skip",
  );
  const recordAttendance = useMutation(
    attendanceApi.functions.attendance.recordBadgeAttendance,
  );

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in?redirect_url=/badge");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.isSecureContext) {
      setLocationPermission("insecure");
      return;
    }

    if (!navigator.geolocation) {
      setLocationPermission("unsupported");
      return;
    }

    if (!navigator.permissions?.query) {
      setLocationPermission("prompt");
      return;
    }

    let permissionStatus: PermissionStatus | null = null;

    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((status) => {
        permissionStatus = status;

        const syncPermission = () => {
          setLocationPermission(status.state);
        };

        syncPermission();
        status.onchange = syncPermission;
      })
      .catch(() => {
        setLocationPermission("prompt");
      });

    return () => {
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  const badgeState = isBadgeState(badgeStateResult) ? badgeStateResult : null;
  const activeEmployee = badgeState?.employee ?? {
    name: metadataName,
    matricule: metadataMatricule,
  };
  const activeAttendance = badgeState?.attendance ?? {
    attendanceDate: getTodayBadgeDate(),
    status: "not-checked-in" as AttendanceStatus,
  };
  const projects = isProjectsResult(projectsResult) ? projectsResult : [];
  const projectsError =
    projectsResult && "error" in projectsResult ? projectsResult.error : null;
  const selectedProject = selectedProjectId
    ? projects.find((project) => project._id === selectedProjectId) ?? null
    : null;
  const badgeError =
    badgeStateResult && "error" in badgeStateResult
      ? badgeStateResult.error === "UNAUTHENTICATED"
        ? null
        : ERROR_MESSAGES[badgeStateResult.error] ?? ERROR_MESSAGES.BADGE_STATE_UNAVAILABLE
      : null;
  const isBlockingBadgeError = Boolean(
    badgeError &&
      badgeStateResult &&
      "error" in badgeStateResult &&
      !["EMPLOYEE_NOT_FOUND", "NO_ASSIGNED_PROJECT"].includes(badgeStateResult.error),
  );

  useEffect(() => {
    if (selectedProjectId || !badgeState?.project?.id) return;
    setSelectedProjectId(badgeState.project.id);
  }, [badgeState?.project?.id, selectedProjectId]);

  const locationReady = isFreshLocation(currentLocation);
  const activeFlowStep: BadgeFlowStep = flowStep === "start"
    ? "start"
    : !selectedProjectId
    ? "project"
    : !locationReady && flowStep === "attendance"
      ? "location"
      : flowStep;
  const currentAction = activeAttendance.status === "checked-in" ? "check-out" : "check-in";
  const isBusy = actionState === "requesting-location" || actionState === "submitting-attendance";
  const attendanceComplete = activeAttendance.status === "checked-out";
  const accountName =
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress ||
    "Mon compte";
  const statusContent = getAttendanceStatusContent(activeAttendance.status);
  const actionLabel = useMemo(() => {
    if (actionState === "requesting-location") return "Vérification de votre position…";
    if (actionState === "submitting-attendance") return "Enregistrement du pointage…";
    if (attendanceComplete) return "Journée terminée";
    return currentAction === "check-in" ? "Pointer mon entrée" : "Pointer ma sortie";
  }, [actionState, attendanceComplete, currentAction]);

  const handleAllowLocation = async () => {
    setFeedback(null);

    setActionState("requesting-location");

    try {
      const location = await requestCurrentLocation();
      setCurrentLocation(location);
      setLocationPermission("granted");
      setActionState("idle");
      setFlowStep("attendance");
      setFeedback({
        type: "success",
        message: "Localisation autorisée. Vous pouvez valider le pointage.",
      });
    } catch (error: unknown) {
      setActionState("error");
      const code =
        typeof error === "object" && error && "code" in error
          ? Number((error as { code: unknown }).code)
          : 0;
      const message = error instanceof Error ? error.message : "";

      if (message.includes("GEOLOCATION_INSECURE")) {
        setLocationPermission("insecure");
      } else if (message.includes("GEOLOCATION_UNSUPPORTED")) {
        setLocationPermission("unsupported");
      } else if (code === 1) {
        setLocationPermission("denied");
      }

      setFeedback({
        type: "error",
        message:
          GEOLOCATION_ERROR_MESSAGES[code] ??
          "Autorisez la localisation dans votre navigateur puis réessayez.",
      });
    }
  };

  const handleSetup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const matricule = String(formData.get("matricule") ?? "").trim();

    if (!name || !matricule) {
      setFeedback({
        type: "error",
        message: "Le nom complet et la matricule sont obligatoires.",
      });
      return;
    }

    setSetupLoading(true);
    try {
      const response = await fetch("/api/badge/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, matricule }),
      });

      if (!response.ok) {
        throw new Error("METADATA_UPDATE_FAILED");
      }

      await user?.reload();
      setSetupProfileOverride({ name, matricule });
      setSetupCompletedOverride(true);
      setFlowStep("project");
      setFeedback({
        type: "success",
        message: "Votre badge numérique a été activé.",
      });
    } catch (error: unknown) {
      setFeedback({ type: "error", message: getErrorMessage(error) });
    } finally {
      setSetupLoading(false);
    }
  };

  const handleAttendance = async (action: AttendanceAction) => {
    setFeedback(null);

    if (!isLoaded || !isSignedIn) {
      setActionState("error");
      setFeedback({
        type: "error",
        message: "Reconnectez-vous avant de valider le pointage.",
      });
      return;
    }

    if (!selectedProjectId) {
      setActionState("error");
      setFeedback({
        type: "error",
        message: "Sélectionnez un chantier avant de valider le pointage.",
      });
      return;
    }

    setActionState("requesting-location");

    try {
      const location = isFreshLocation(currentLocation)
        ? currentLocation
        : await requestCurrentLocation();

      setCurrentLocation(location);
      setLocationPermission("granted");
      validatePointageLocation(location, selectedProject);
      setActionState("submitting-attendance");

      const result = await recordAttendance({
        action,
        projectId: selectedProjectId,
        clerkUserId: user?.id,
        name: metadataName,
        matricule: metadataMatricule,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        capturedAt: location.capturedAt,
      });

      setActionState("success");
      setFeedback({
        type: "success",
        message: `${result.message} Heure : ${formatBadgeTime(result.eventTime)}.`,
      });
    } catch (error: unknown) {
      setActionState("error");

      const code =
        typeof error === "object" && error && "code" in error
          ? Number((error as { code: unknown }).code)
          : 0;
      const message = error instanceof Error ? error.message : "";

      if (message.includes("GEOLOCATION_INSECURE")) {
        setLocationPermission("insecure");
      } else if (message.includes("GEOLOCATION_UNSUPPORTED")) {
        setLocationPermission("unsupported");
      } else if (code === 1) {
        setLocationPermission("denied");
      }

      setFeedback({
        type: "error",
        message: code ? GEOLOCATION_ERROR_MESSAGES[code] : getErrorMessage(error),
      });
    }
  };

  if (!isLoaded) {
    return <BadgeLoadingSkeleton />;
  }

  if (!isSignedIn) {
    return <BadgeLoadingSkeleton />;
  }

  return (
    <main className="min-h-dvh overflow-x-hidden bg-surface-dark">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] min-w-0 flex-col gap-5 bg-canvas p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+1.25rem)]">
        <div className="flex min-h-12 items-center justify-between gap-3 rounded-full border border-divider-dark bg-surface-dark px-4 text-on-dark">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
              <ShieldCheck />
            </div>
            <p className="min-w-0 truncate body-sm">{accountName}</p>
          </div>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "size-9",
              },
            }}
          />
        </div>

        <header className="flex items-center justify-between">
          <div>
            <p className="caption-tight text-primary">TGCC Lines</p>
            <h1 className="heading-lg text-ink">Badge numérique</h1>
          </div>
          <div className="flex size-12 items-center justify-center rounded-full border border-hairline bg-surface-card text-primary">
            <BadgeCheck />
          </div>
        </header>

        <Card className="overflow-hidden border-hairline bg-surface-card p-0">
          <CardContent className="p-0">
            <div className="border-b border-hairline bg-primary px-4 py-3 text-on-primary">
              <div className="flex items-center justify-between gap-3">
                <p className="caption-tight">Pointage sécurisé</p>
                <Badge
                  variant={statusContent.variant}
                  className="shrink-0 border-divider-dark bg-surface-card text-ink"
                >
                  {statusContent.label}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="caption text-ash">Titulaire</p>
                  <h2 className="heading-md truncate text-ink">
                    {setupCompleted ? activeEmployee.name : accountName}
                  </h2>
                  <p className="code-md text-charcoal">
                    {setupCompleted
                      ? activeEmployee.matricule
                      : "Activation requise"}
                  </p>
                </div>
                <div className="flex size-16 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface-bone text-primary">
                  <BadgeCheck />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-hairline bg-canvas p-3">
                  <p className="caption text-ash">Statut</p>
                  <p className="body-sm font-medium text-ink">
                    {statusContent.description}
                  </p>
                </div>
                <div className="rounded-md border border-hairline bg-canvas p-3">
                  <p className="caption text-ash">Chantier</p>
                  <p className="body-sm font-medium text-ink truncate">
                    {selectedProject?.name ?? badgeState?.project?.name ?? "À choisir"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <BadgeBarcode />
                <div className="flex items-center justify-between caption text-ash">
                  <span>{activeAttendance.attendanceDate}</span>
                  <span>{formatBadgeTime(activeAttendance.checkInTime)}</span>
                </div>
              </div>

              <Drawer
                open={flowOpen}
                onOpenChange={(open) => {
                  setFlowOpen(open);
                  if (open) {
                    setFeedback(null);
                    setFlowStep(setupCompleted ? "project" : "start");
                  }
                }}
              >
                <DrawerTrigger asChild>
                  <Button
                    type="button"
                    className="h-14 w-full border-0 bg-gradient-to-r from-primary via-primary to-surface-dark text-base text-on-primary hover:opacity-95"
                  >
                    <ShieldCheck data-icon="inline-start" />
                    Commencer
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="max-h-[92dvh] bg-canvas">
                  <DrawerHeader>
                    <DrawerTitle>Pointage</DrawerTitle>
                    <DrawerDescription>
                      Chantier, localisation, validation.
                    </DrawerDescription>
                  </DrawerHeader>

                  <div className="flex flex-col gap-5 overflow-y-auto px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
                    {!setupCompleted ? (
                      <Card className="gap-0 p-0">
                        <CardHeader className="p-5">
                          <CardTitle>Activation du badge</CardTitle>
                          <CardDescription>
                            Entrez vos informations.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                          <form onSubmit={handleSetup} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="badge-name">Nom complet</Label>
                              <Input id="badge-name" name="name" autoComplete="name" required />
                            </div>
                            <div className="flex flex-col gap-2">
                              <Label htmlFor="badge-matricule">Matricule</Label>
                              <Input
                                id="badge-matricule"
                                name="matricule"
                                autoCapitalize="characters"
                                autoComplete="off"
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="h-14"
                              disabled={setupLoading}
                            >
                              {setupLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck data-icon="inline-start" />}
                              Activer mon badge
                            </Button>
                          </form>
                        </CardContent>
                      </Card>
                    ) : isBlockingBadgeError ? (
                      <Feedback type="error" message={badgeError} />
                    ) : (
                      <>
                        <StepBadge activeStep={activeFlowStep === "start" ? "project" : activeFlowStep} />

                        <Card className="gap-0 p-0">
                          <CardHeader className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <CardTitle>Statut du jour</CardTitle>
                                <CardDescription>
                                  {statusContent.description}
                                </CardDescription>
                              </div>
                              <Badge variant={statusContent.variant}>
                                {statusContent.label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-3 p-5 pt-0">
                            {activeAttendance.checkInTime ? (
                              <div className="flex items-center justify-between rounded-md bg-canvas px-3 py-2 body-sm">
                                <span className="text-ash">Entrée</span>
                                <span className="font-medium text-ink">
                                  {formatBadgeTime(activeAttendance.checkInTime)}
                                </span>
                              </div>
                            ) : null}
                            {activeAttendance.checkOutTime ? (
                              <div className="flex items-center justify-between rounded-md bg-canvas px-3 py-2 body-sm">
                                <span className="text-ash">Sortie</span>
                                <span className="font-medium text-ink">
                                  {formatBadgeTime(activeAttendance.checkOutTime)}
                                </span>
                              </div>
                            ) : activeAttendance.checkInTime ? (
                              <div className="flex items-center justify-between rounded-md bg-canvas px-3 py-2 body-sm">
                                <span className="text-ash">Sortie</span>
                                <span className="font-medium text-ash">--:--</span>
                              </div>
                            ) : (
                              <div className="rounded-md bg-canvas px-3 py-3 body-sm text-ash">
                                Aucun pointage enregistré aujourd’hui.
                              </div>
                            )}
                          </CardContent>
                        </Card>

                        {badgeError && !isBlockingBadgeError ? (
                          <Feedback type="error" message={badgeError} />
                        ) : null}

                        {locationPermission === "denied" ? (
                          <Feedback
                            type="error"
                            message="La localisation est refusée dans votre navigateur. Ouvrez les paramètres du site, autorisez Position/Localisation, puis revenez appuyer sur Autoriser la localisation."
                          />
                        ) : locationPermission === "insecure" ? (
                          <Feedback
                            type="error"
                            message="La localisation ne fonctionne pas sur cette adresse. Ouvrez l’application avec HTTPS ou sur localhost."
                          />
                        ) : locationPermission === "unsupported" ? (
                          <Feedback
                            type="error"
                            message="La localisation n’est pas disponible sur cet appareil ou ce navigateur."
                          />
                        ) : null}

                        {activeFlowStep === "project" ? (
                          <Card className="gap-0 p-0">
                            <CardHeader className="p-5">
                              <CardTitle>Chantier</CardTitle>
                              <CardDescription>
                                Choisissez votre chantier.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 p-5 pt-0">
                              {projectsResult === undefined ? (
                                <>
                                  <Skeleton className="h-16 w-full rounded-md" />
                                  <Skeleton className="h-16 w-full rounded-md" />
                                </>
                              ) : projectsError ? (
                                <p className="rounded-md border border-hairline bg-surface-bone p-4 body-sm text-ash">
                                  Les chantiers ne sont pas disponibles pour le moment.
                                </p>
                              ) : projects.length === 0 ? (
                                <p className="rounded-md border border-hairline bg-surface-bone p-4 body-sm text-ash">
                                  Aucun chantier disponible.
                                </p>
                              ) : (
                                projects.map((project) => {
                                  const isSelected = selectedProjectId === project._id;
                                  const hasLocation =
                                    typeof project.yCoordinate === "number" &&
                                    typeof project.xCoordinate === "number";

                                  return (
                                    <button
                                      key={project._id}
                                      type="button"
                                      disabled={isBusy}
                                      aria-pressed={isSelected}
                                      onClick={() => {
                                        setSelectedProjectId(project._id);
                                        setCurrentLocation(null);
                                        setFlowStep("location");
                                        setFeedback(null);
                                      }}
                                      className={cn(
                                        "flex min-h-16 w-full items-center justify-between gap-3 rounded-md border p-4 text-left transition-colors disabled:opacity-60",
                                        isSelected
                                          ? "border-primary bg-primary/10 text-ink"
                                          : "border-hairline bg-canvas hover:bg-surface-bone",
                                      )}
                                    >
                                      <div className="min-w-0">
                                        <p className="body-md font-medium text-ink">{project.name}</p>
                                        <p className="caption text-ash">
                                          {hasLocation ? "Localisation configurée" : "Localisation manquante"}
                                        </p>
                                      </div>
                                      <MapPin
                                        className={hasLocation ? "shrink-0 text-badge-success" : "shrink-0 text-ash"}
                                      />
                                    </button>
                                  );
                                })
                              )}
                            </CardContent>
                          </Card>
                        ) : null}

                        {activeFlowStep === "location" ? (
                          <Card className="gap-0 p-0">
                            <CardHeader className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <CardTitle>Localisation</CardTitle>
                                  <CardDescription>
                                    Autorisez votre position.
                                  </CardDescription>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() => {
                                    setCurrentLocation(null);
                                    setFlowStep("project");
                                    setFeedback(null);
                                  }}
                                >
                                  Changer
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 p-5 pt-0">
                              <div className="rounded-md border border-hairline bg-transparent p-4">
                                <p className="caption-tight text-ash">Chantier sélectionné</p>
                                <p className="body-md text-ink">
                                  {selectedProject?.name ?? "À sélectionner"}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                className="h-14 text-base"
                                disabled={
                                  isBusy ||
                                  attendanceComplete ||
                                  locationPermission === "insecure" ||
                                  locationPermission === "unsupported"
                                }
                                onClick={handleAllowLocation}
                              >
                                {actionState === "requesting-location" ? (
                                  <Loader2 className="animate-spin" />
                                ) : locationReady ? (
                                  <CheckCircle2 />
                                ) : (
                                  <MapPin />
                                )}
                                {locationReady
                                  ? "Localisation autorisée"
                                  : locationPermission === "denied"
                                    ? "Réessayer la localisation"
                                    : "Autoriser la localisation"}
                              </Button>
                            </CardContent>
                          </Card>
                        ) : null}

                        {activeFlowStep === "attendance" ? (
                          <Card className="gap-0 p-0">
                            <CardHeader className="p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <CardTitle>Validation</CardTitle>
                                  <CardDescription>
                                    {selectedProject?.name ?? "Chantier sélectionné"}
                                  </CardDescription>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() => {
                                    setFlowStep("project");
                                    setCurrentLocation(null);
                                    setFeedback(null);
                                  }}
                                >
                                  Changer
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 p-5 pt-0">
                              <Button
                                type="button"
                                className="h-16 text-base"
                                disabled={
                                  isBusy ||
                                  attendanceComplete ||
                                  !selectedProjectId
                                }
                                onClick={() => handleAttendance(currentAction)}
                              >
                                {isBusy ? (
                                  <Loader2 className="animate-spin" />
                                ) : currentAction === "check-in" ? (
                                  <LogIn />
                                ) : (
                                  <LogOut />
                                )}
                                {actionLabel}
                              </Button>
                            </CardContent>
                          </Card>
                        ) : null}

                        <div className="flex items-start gap-3 rounded-md border border-hairline bg-surface-card p-4">
                          <MapPin className="mt-0.5 text-ash" />
                          <p className="caption text-ash">
                            Votre position est utilisée uniquement au moment du pointage. Elle n’est pas enregistrée.
                          </p>
                        </div>
                      </>
                    )}

                    {feedback ? <Feedback type={feedback.type} message={feedback.message} /> : null}
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default BadgePage;
