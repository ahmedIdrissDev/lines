"use client";

import { useQuery } from "convex/react";
import { FunctionReference } from "convex/server";
import { Clock3, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type TodayPointageEntry = {
  _id: Id<"attendance">;
  projectId: Id<"Project">;
  matricule: string;
  employeeName: string;
  attendanceDate: string;
  checkInTime: number;
  checkOutTime?: number;
  status: "checked-in" | "checked-out";
};

type TodayPointageGroup = {
  projectId: Id<"Project">;
  projectName: string;
  count: number;
  checkedInCount: number;
  checkedOutCount: number;
  entries: TodayPointageEntry[];
};

type DashboardApi = {
  functions: {
    attendance: {
      getTodayAttendanceGroupedByProject: FunctionReference<
        "query",
        "public",
        Record<string, never>,
        TodayPointageGroup[]
      >;
    };
  };
};

const dashboardApi = api as unknown as DashboardApi;

function formatTime(timestamp?: number): string {
  if (!timestamp) return "--:--";

  return new Intl.DateTimeFormat("fr-MA", {
    timeZone: "Africa/Casablanca",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}

function formatToday(): string {
  return new Intl.DateTimeFormat("fr-MA", {
    timeZone: "Africa/Casablanca",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

const DashboardPage = () => {
  const pointageGroups = useQuery(
    dashboardApi.functions.attendance.getTodayAttendanceGroupedByProject,
    {},
  );
  const totalPointages = Array.isArray(pointageGroups)
    ? pointageGroups.reduce((total, group) => total + group.count, 0)
    : 0;
  const pointageRows = Array.isArray(pointageGroups)
    ? pointageGroups
        .flatMap((group) =>
          group.entries.map((entry) => ({
            ...entry,
            projectName: group.projectName,
          })),
        )
        .sort((first, second) => second.checkInTime - first.checkInTime)
    : [];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <Card className="gap-0 p-0">
        <CardHeader className="p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="body-md font-medium text-ink">Pointage du jour</h1>
              <CardDescription className="capitalize">
                {formatToday()}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="w-fit">
              <UsersRound />
              {totalPointages} pointage{totalPointages > 1 ? "s" : ""}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pointageGroups === undefined ? (
            <div className="space-y-2 p-5 pt-0">
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          ) : pointageRows.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center gap-2 p-6 text-center text-ash">
              <Clock3 />
              <p className="body-sm">Aucun pointage enregistré aujourd’hui.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Entrée</TableHead>
                  <TableHead>Sortie</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pointageRows.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell className="font-medium text-ink">
                      {entry.employeeName}
                    </TableCell>
                    <TableCell className="text-ash">{entry.matricule}</TableCell>
                    <TableCell>{formatTime(entry.checkInTime)}</TableCell>
                    <TableCell>{formatTime(entry.checkOutTime)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          entry.status === "checked-out"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {entry.status === "checked-out" ? "Terminé" : "Présent"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
