'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ClerkUser {
  id: string;
  fullName: string | null;
  username?: string | null;
  imageUrl: string;
  email?: string;
  emailAddresses?: { emailAddress: string }[];
  publicMetadata: {
    permissions?: string[];
    projects?: string[];
  };
}

interface UserManagementTableProps {
  initialUsers?: ClerkUser[];
}

const UserManagementSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="border-b border-hairline">
          <TableCell>
            <Skeleton className="h-10 w-10 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <Skeleton className="h-6 w-20" />
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-8 w-8 rounded-md ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export const UserManagementTable = ({ initialUsers }: UserManagementTableProps) => {
  const [users, setUsers] = useState<ClerkUser[]>(initialUsers || []);
  const [loading, setLoading] = useState(!initialUsers);
  const [editingUser, setEditingUser] = useState<ClerkUser | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const projects = useQuery(api.functions.project.getProjects);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users', {
        headers: { 'X-App-Source': process.env.NEXT_PUBLIC_APP_SOURCE_KEY || '' },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialUsers) {
      fetchUsers();
    }
  }, [initialUsers]);

  const availablePermissions = [
    { id: "user:access:admin", label: "Admin (Full Control)" },
    { id: "user:access:all", label: "Manager (Projects & Employees)" },
    { id: "user:access:view", label: "Administration Access" },

  ];

  const handleEditClick = (user: ClerkUser) => {
    setEditingUser(user);
    setSelectedPermissions(user.publicMetadata?.permissions || []);
    setSelectedProjects(user.publicMetadata?.projects || []);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Source': process.env.NEXT_PUBLIC_APP_SOURCE_KEY || '',
        },
        body: JSON.stringify({
          userId: editingUser.id,
          permissions: selectedPermissions,
          projects: selectedProjects,
        }),
      });

      if (!response.ok){
              toast.error("No update");
        return false;
      };

      toast.success("User metadata updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) ? prev.filter(p => p !== projectId) : [...prev, projectId]
    );
  };

  return (
    <>
      
      <Table>
        <TableBody>
          {loading ? (
            <UserManagementSkeleton />
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-ash italic">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="border-b border-hairline transition-colors">
                <TableCell>
                  <div className="h-10 w-10 rounded-full bg-stone overflow-hidden flex items-center justify-center">
                    {user.imageUrl ? (
                      <img src={user.imageUrl} alt={user.fullName || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <UserIcon className="h-6 w-6 text-white" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-ink">
                  {user.fullName || user.username || "Unknown"}
                </TableCell>
                <TableCell className="text-ash">
                  {user.email || (user.emailAddresses && user.emailAddresses[0]?.emailAddress)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(user.publicMetadata?.permissions || []).length > 0 ? (
                      (user.publicMetadata.permissions as string[]).map((p) => (
                        <Badge key={p} variant="outline" className="rounded-full border-none">
                          {p.replace('user:access:', '')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-ash italic">No permissions</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(user.publicMetadata?.projects || []).length > 0 ? (
                      (user.publicMetadata.projects as string[]).map((projectId) => {
                        const project = Array.isArray(projects) ? projects.find((p: any) => p._id === projectId) : null;
                        return (
                          <Badge key={projectId} variant="outline" className="border-none">
                            {project ? project.name : "..."}
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-xs text-ash italic">No projects</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleEditClick(user as any)}
                    className=""
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent   className="!max-w-1/2 bg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal text-ink">Manage Access</DialogTitle>
            <DialogDescription className="text-ash">
              {editingUser?.fullName || editingUser?.username}
              <br />
              Update permissions and project assignments for this user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-ink font-semibold">System Permissions</Label>
              <div className="grid gap-2">
                {availablePermissions.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2 p-2 rounded-lg border border-hairline bg-surface-bone/30">
                    <Checkbox 
                      id={perm.id} 
                      checked={selectedPermissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                    />
                    <Label htmlFor={perm.id} className="text-sm font-medium text-black cursor-pointer flex-1">
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-ink font-semibold">Project Assignments</Label>
              <div className="max-h-[200px] overflow-y-auto text-black pr-2 space-y-2">
                {!projects ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-ash" />
                  </div>
                ) : projects && !Array.isArray(projects) && 'error' in projects ? (
                  <p className="text-sm text-red-500 italic">Error: {String(projects.error)}</p>
                ) : !Array.isArray(projects) || projects.length === 0 ? (
                  <p className="text-sm text-ash italic">No projects available.</p>
                ) : (
                  projects.map((project: any) => (
                    <div key={project._id} className="flex items-center space-x-2 p-2 rounded-lg border border-hairline bg-surface-bone/30">
                      <Checkbox 
                        id={project._id} 
                        checked={selectedProjects.includes(project._id)}
                        onCheckedChange={() => toggleProject(project._id)}
                      />
                      <Label htmlFor={project._id} className="text-sm cursor-pointer flex-1 truncate">
                        {project.name}
                        <span className="ml-2 text-[10px] uppercase text-ash opacity-70">{project.type}</span>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingUser(null)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUpdating} className="bg-primary text-white">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
