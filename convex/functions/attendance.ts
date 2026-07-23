import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

type AttendanceAction = "check-in" | "check-out";
type BadgeProfileArgs = {
  clerkUserId?: string;
  name?: string;
  matricule?: string;
};

const LOCATION_MAX_AGE_MS = 60_000;
const MAX_LOCATION_ACCURACY_METERS = 100;
const DEFAULT_ATTENDANCE_RADIUS_METERS = 250;

function normalizeMatricule(matricule: string): string {
  return matricule.trim().replace(/\s+/g, "").toUpperCase();
}

function resolveAllowedRadius(radius?: number): number {
  if (typeof radius !== "number" || !Number.isFinite(radius)) {
    return DEFAULT_ATTENDANCE_RADIUS_METERS;
  }

  return Math.min(1000, Math.max(0, radius));
}

function getLocationToleranceMeters(accuracy: number): number {
  if (!Number.isFinite(accuracy) || accuracy <= 0) {
    return 0;
  }

  return Math.min(MAX_LOCATION_ACCURACY_METERS, accuracy);
}

function validateCoordinates(latitude: number, longitude: number): void {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new ConvexError("INVALID_LATITUDE");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new ConvexError("INVALID_LONGITUDE");
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
  latitude: number,
  longitude: number,
  project: Doc<"Project">,
): number {
  const projectLatitude = project.yCoordinate;
  const projectLongitude = project.xCoordinate;

  if (
    typeof projectLatitude !== "number" ||
    typeof projectLongitude !== "number" ||
    !isValidCoordinatePair(projectLatitude, projectLongitude)
  ) {
    throw new ConvexError("PROJECT_LOCATION_MISSING");
  }

  const directDistanceMeters = calculateDistanceMeters(
    latitude,
    longitude,
    projectLatitude,
    projectLongitude,
  );

  if (isValidCoordinatePair(projectLongitude, projectLatitude)) {
    const swappedDistanceMeters = calculateDistanceMeters(
      latitude,
      longitude,
      projectLongitude,
      projectLatitude,
    );

    return Math.min(directDistanceMeters, swappedDistanceMeters);
  }

  return directDistanceMeters;
}

function validatePointageLocation(args: {
  latitude: number;
  longitude: number;
  accuracy: number;
  capturedAt: number;
  project: Doc<"Project">;
  now: number;
}) {
  validateCoordinates(args.latitude, args.longitude);

  if (!Number.isFinite(args.capturedAt) || args.now - args.capturedAt > LOCATION_MAX_AGE_MS) {
    throw new ConvexError("LOCATION_EXPIRED");
  }

  if (
    !Number.isFinite(args.accuracy) ||
    args.accuracy <= 0 ||
    args.accuracy > MAX_LOCATION_ACCURACY_METERS
  ) {
    throw new ConvexError("LOCATION_ACCURACY_TOO_LOW");
  }

  const distanceMeters = getNearestProjectDistanceMeters(
    args.latitude,
    args.longitude,
    args.project,
  );
  const radiusMeters = resolveAllowedRadius(args.project?.attendanceRadiusMeters);
  const toleranceMeters = getLocationToleranceMeters(args.accuracy);

  if (distanceMeters > radiusMeters + toleranceMeters) {
    throw new ConvexError(
      `OUTSIDE_CHANTIER_ZONE:${Math.round(distanceMeters)}:${Math.round(radiusMeters)}:${Math.round(args.accuracy)}`,
    );
  }
}

function getCasablancaAttendanceDate(timestamp = Date.now()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(new Date(timestamp));
}

type BadgeCtx = QueryCtx | MutationCtx;

async function getAuthClerkUserId(ctx: BadgeCtx) {
  const identity = await ctx.auth.getUserIdentity();

  return identity?.subject ?? null;
}

async function resolveBadgeProfile(ctx: BadgeCtx, profile: BadgeProfileArgs) {
  const authClerkUserId = await getAuthClerkUserId(ctx);
  const matricule = profile.matricule ? normalizeMatricule(profile.matricule) : "";
  const name = profile.name?.trim() || "Utilisateur badge";

  if (!matricule) {
    throw new ConvexError("SETUP_REQUIRED_FIELDS");
  }

  return {
    clerkUserId:
      authClerkUserId ?? profile.clerkUserId?.trim() ?? `matricule:${matricule}`,
    name,
    matricule,
  };
}

async function resolveAttendanceProject(
  ctx: BadgeCtx,
  projectId?: Id<"Project">,
) {
  if (!projectId) {
    throw new ConvexError("NO_ASSIGNED_PROJECT");
  }

  const project = await ctx.db.get(projectId);

  if (!project) {
    throw new ConvexError("NO_ASSIGNED_PROJECT");
  }

  return project;
}

async function getTodayAttendance(
  ctx: BadgeCtx,
  clerkUserId: string,
  attendanceDate: string,
) {
  return await ctx.db
    .query("attendance")
    .withIndex("by_user_date", (q) =>
      q.eq("clerkUserId", clerkUserId).eq("attendanceDate", attendanceDate),
    )
    .unique();
}

export const getMyBadgeState = query({
  args: {
    clerkUserId: v.optional(v.string()),
    name: v.optional(v.string()),
    matricule: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const profile = await resolveBadgeProfile(ctx, args);
      const attendanceDate = getCasablancaAttendanceDate();
      const attendance = await getTodayAttendance(
        ctx,
        profile.clerkUserId,
        attendanceDate,
      );

      return {
        employee: {
          name: profile.name,
          matricule: profile.matricule,
        },
        project: null,
        attendance: {
          attendanceDate,
          checkInTime: attendance?.checkInTime,
          checkOutTime: attendance?.checkOutTime,
          status: attendance?.status ?? "not-checked-in",
        },
      };
    } catch (error) {
      if (error instanceof ConvexError) {
        return { error: String(error.data) };
      }

      return { error: "BADGE_STATE_UNAVAILABLE" };
    }
  },
});

export const setupMyBadge = mutation({
  args: {
    name: v.string(),
    matricule: v.string(),
  },
  handler: async (ctx, args) => {
    const matricule = normalizeMatricule(args.matricule);
    const typedName = args.name.trim();

    if (!typedName || !matricule) {
      throw new ConvexError("SETUP_REQUIRED_FIELDS");
    }

    return {
      success: true,
      employee: {
        name: typedName,
        matricule,
      },
    };
  },
});

export const recordBadgeAttendance = mutation({
  args: {
    action: v.union(v.literal("check-in"), v.literal("check-out")),
    projectId: v.optional(v.id("Project")),
    clerkUserId: v.optional(v.string()),
    name: v.optional(v.string()),
    matricule: v.optional(v.string()),
    latitude: v.number(),
    longitude: v.number(),
    accuracy: v.number(),
    capturedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const profile = await resolveBadgeProfile(ctx, args);
    const project = await resolveAttendanceProject(ctx, args.projectId);
    validatePointageLocation({
      latitude: args.latitude,
      longitude: args.longitude,
      accuracy: args.accuracy,
      capturedAt: args.capturedAt,
      project,
      now,
    });

    const attendanceDate = getCasablancaAttendanceDate(now);
    const existingAttendance = await getTodayAttendance(
      ctx,
      profile.clerkUserId,
      attendanceDate,
    );

    if (args.action === "check-in") {
      if (existingAttendance?.status === "checked-in") {
        throw new ConvexError("DUPLICATE_CHECK_IN");
      }

      if (existingAttendance?.status === "checked-out") {
        throw new ConvexError("DAY_ALREADY_COMPLETED");
      }

      await ctx.db.insert("attendance", {
        projectId: project._id,
        matricule: profile.matricule,
        employeeName: profile.name,
        clerkUserId: profile.clerkUserId,
        attendanceDate,
        checkInTime: now,
        status: "checked-in",
      });

      return {
        success: true,
        action: args.action as AttendanceAction,
        attendanceStatus: "checked-in",
        eventTime: now,
        message: "Votre entrée a été enregistrée avec succès.",
      };
    }

    if (!existingAttendance) {
      throw new ConvexError("CHECK_OUT_BEFORE_CHECK_IN");
    }

    if (existingAttendance.status === "checked-out" || existingAttendance.checkOutTime) {
      throw new ConvexError("DUPLICATE_CHECK_OUT");
    }

    await ctx.db.patch(existingAttendance._id, {
      checkOutTime: now,
      status: "checked-out",
    });

    return {
      success: true,
      action: args.action as AttendanceAction,
      attendanceStatus: "checked-out",
      eventTime: now,
      message: "Votre sortie a été enregistrée avec succès.",
    };
  },
});

export const getTodayAttendanceGroupedByProject = query({
  args: {},
  handler: async (ctx) => {
    const attendanceDate = getCasablancaAttendanceDate();
    const entries = await ctx.db
      .query("attendance")
      .withIndex("by_date", (q) => q.eq("attendanceDate", attendanceDate))
      .collect();
    const projectIds = [...new Set(entries.map((entry) => entry.projectId))];
    const projects = await Promise.all(
      projectIds.map(async (projectId) => await ctx.db.get(projectId)),
    );
    const projectNameById = new Map(
      projects
        .filter((project): project is NonNullable<typeof project> => project !== null)
        .map((project) => [project._id, project.name]),
    );
    const groups = new Map<
      Id<"Project">,
      {
        projectId: Id<"Project">;
        projectName: string;
        entries: typeof entries;
      }
    >();

    for (const entry of entries) {
      const group = groups.get(entry.projectId) ?? {
        projectId: entry.projectId,
        projectName: projectNameById.get(entry.projectId) ?? "Chantier inconnu",
        entries: [],
      };

      group.entries.push(entry);
      groups.set(entry.projectId, group);
    }

    return [...groups.values()]
      .map((group) => ({
        ...group,
        count: group.entries.length,
        checkedInCount: group.entries.filter(
          (entry) => entry.status === "checked-in",
        ).length,
        checkedOutCount: group.entries.filter(
          (entry) => entry.status === "checked-out",
        ).length,
        entries: group.entries.sort((first, second) => {
          return second.checkInTime - first.checkInTime;
        }),
      }))
      .sort((first, second) => first.projectName.localeCompare(second.projectName));
  },
});

export const getMonthlyAttendanceByProject = query({
  args: {
    projectId: v.id("Project"),
    month: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("monthlyAttendance")
      .withIndex("by_project_month", (q) =>
        q.eq("projectId", args.projectId).eq("month", args.month),
      )
      .collect();
  },
});

export const setMonthlyTotal = mutation({
  args: {
    employeeId: v.id("employees"),
    projectId: v.id("Project"),
    month: v.string(),
    totalPresent: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("monthlyAttendance")
      .withIndex("by_employee_project_month", (q) =>
        q
          .eq("employeeId", args.employeeId)
          .eq("projectId", args.projectId)
          .eq("month", args.month),
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalPresent: args.totalPresent,
      });
      return { success: true, id: existing._id };
    }

    const id = await ctx.db.insert("monthlyAttendance", args);
    return { success: true, id };
  },
});
