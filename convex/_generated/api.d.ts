/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as functions_attendance from "../functions/attendance.js";
import type * as functions_buses from "../functions/buses.js";
import type * as functions_clerk from "../functions/clerk.js";
import type * as functions_employees from "../functions/employees.js";
import type * as functions_present from "../functions/present.js";
import type * as functions_project from "../functions/project.js";
import type * as functions_security from "../functions/security.js";
import type * as functions_subcontractors from "../functions/subcontractors.js";
import type * as functions_users from "../functions/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "functions/attendance": typeof functions_attendance;
  "functions/buses": typeof functions_buses;
  "functions/clerk": typeof functions_clerk;
  "functions/employees": typeof functions_employees;
  "functions/present": typeof functions_present;
  "functions/project": typeof functions_project;
  "functions/security": typeof functions_security;
  "functions/subcontractors": typeof functions_subcontractors;
  "functions/users": typeof functions_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
