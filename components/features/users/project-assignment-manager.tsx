'use client';

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, Shield, FolderKanban } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProjectAssignmentManagerProps {
  clerkId: string;
  userName: string;
}

export const ProjectAssignmentManager = ({ clerkId, userName }: ProjectAssignmentManagerProps) => {
  const allProjects = useQuery(api.functions.project.getProjects);
  const getUserDetails = useAction(api.functions.clerk.getUserDetails);
  const updateMetadata = useAction(api.functions.clerk.updateMetadata);

  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"Project"> | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const result = await getUserDetails({ clerkId });
      setUserDetails(result);
    } catch (err) {
      console.error("Failed to fetch user details", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [clerkId]);

  if (loading || !allProjects) {
    return (
      <Card className="flex items-center justify-center h-[600px] border-hairline">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (allProjects && !Array.isArray(allProjects) && 'error' in allProjects) {
    return (
      <Card className="flex flex-col items-center justify-center h-[600px] p-6 border-hairline bg-red-50">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-700">Error Loading Projects</h3>
        <p className="text-red-600 text-center mt-2">
          {String(allProjects.error)}
        </p>
      </Card>
    );
  }

  if (userDetails?.error) {
    return (
      <Card className="flex flex-col items-center justify-center h-[600px] p-6 border-hairline bg-red-50">
        <Shield className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-700">Access Restricted</h3>
        <p className="text-red-600 text-center mt-2">
          {userDetails.error as string}
        </p>
      </Card>
    );
  }

  const assignedProjectIds = userDetails?.projects || [];
  const assignedProjects = Array.isArray(allProjects) 
    ? allProjects.filter(p => assignedProjectIds.includes(p._id))
    : [];

  const handleAssign = async () => {
    if (!selectedProjectId) return;
    try {
      const newProjects = [...assignedProjectIds, selectedProjectId];
      const result = await updateMetadata({ clerkId, projects: newProjects });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Project assigned successfully");
        setIsAssigning(false);
        setSelectedProjectId(null);
        fetchUserDetails();
      }
    } catch (err) {
      toast.error("Failed to assign project");
    }
  };

  const handleRemove = async (projectId: string) => {
    try {
      const newProjects = assignedProjectIds.filter((id: string) => id !== projectId);
      const result = await updateMetadata({ clerkId, projects: newProjects });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Assignment removed");
        fetchUserDetails();
      }
    } catch (err) {
      toast.error("Failed to remove assignment");
    }
  };

  const setAccessLevel = async (level: 'admin' | 'all' | 'none') => {
    let newPermissions: string[] = [];
    if (level === 'admin') newPermissions = ["user:access:admin"];
    else if (level === 'all') newPermissions = ["user:access:all"];
    
    try {
      const result = await updateMetadata({ clerkId, permissions: newPermissions });
      if (result.error) {
        toast.error(`Clerk update failed: ${result.error}`);
        return;
      }
      
      toast.success(`Access level updated to ${level}`);
      fetchUserDetails();
    } catch (err) {
      toast.error("Failed to update access level");
    }
  };

  const unassignedProjects = Array.isArray(allProjects) 
    ? allProjects.filter(p => !assignedProjectIds.includes(p._id))
    : [];

  const permissions = userDetails?.permissions || [];
  const isAdmin = permissions.includes("user:access:admin");
  const isManager = permissions.includes("user:access:all");

  return (
    <div className="space-y-6">
      <Card className="p-6 border-hairline bg-surface-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-ink">{userName}</h2>
            <div className="flex gap-2 mt-2">
              {permissions.length === 0 ? (
                <Badge variant="outline" className="rounded-full border-hairline text-ash">No Special Access</Badge>
              ) : (
                permissions.map((p: string) => (
                  <Badge key={p} className="rounded-full bg-primary/10 text-primary border-primary/20">
                    {p.replace('user:access:', '')}
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 p-1 bg-surface-bone rounded-full border border-hairline">
            <Button
              variant={!isAdmin && !isManager ? "default" : "ghost"}
              size="sm"
              onClick={() => setAccessLevel('none')}
              className={cn("rounded-full h-8 px-4", !isAdmin && !isManager && "bg-primary text-white hover:bg-primary-deep")}
            >
              Standard
            </Button>
            <Button
              variant={isManager ? "default" : "ghost"}
              size="sm"
              onClick={() => setAccessLevel('all')}
              className={cn("rounded-full h-8 px-4", isManager && "bg-primary text-white hover:bg-primary-deep")}
            >
              Manager
            </Button>
            <Button
              variant={isAdmin ? "default" : "ghost"}
              size="sm"
              onClick={() => setAccessLevel('admin')}
              className={cn("rounded-full h-8 px-4", isAdmin && "bg-primary text-white hover:bg-primary-deep")}
            >
              Admin
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-surface-bone/50 rounded-xl border border-hairline">
            <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Access Validation
            </h3>
            <p className="text-sm text-ash mb-4">
              {isAdmin 
                ? "This user has full administrative control over the entire system." 
                : isManager 
                ? "This user can manage projects and employees but cannot change system settings." 
                : "This user has restricted access based on assigned projects."}
            </p>
            
            <div className="pt-4 border-t border-hairline space-y-2">
              <div className="flex justify-between text-[10px] font-mono uppercase text-ash">
                <span>Clerk ID</span>
                <span className="text-ink lowercase">{clerkId}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              Assigned Projects
            </h3>
            <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-primary hover:bg-primary-deep text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-canvas border-hairline">
                <DialogHeader>
                  <DialogTitle>Assign Project</DialogTitle>
                  <DialogDescription>
                    Select a project to assign to {userName}.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {unassignedProjects.length === 0 ? (
                    <p className="text-center text-ash">All projects are already assigned.</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {unassignedProjects.map((project) => (
                        <button
                          key={project._id}
                          onClick={() => setSelectedProjectId(project._id)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-colors",
                            selectedProjectId === project._id
                              ? "bg-primary/10 border-primary"
                              : "bg-surface-card border-hairline hover:bg-surface-bone"
                          )}
                        >
                          <p className="font-medium text-ink">{project.name}</p>
                          <p className="text-xs text-ash uppercase">{project.type}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setIsAssigning(false)} className="rounded-full">Cancel</Button>
                  <Button onClick={handleAssign} disabled={!selectedProjectId} className="rounded-full bg-primary">Assign</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Table className="border border-hairline rounded-lg overflow-hidden">
            <TableHeader className="bg-surface-bone">
              <TableRow className="border-b border-hairline">
                <TableHead className="text-ash">Project Name</TableHead>
                <TableHead className="text-ash">Type</TableHead>
                <TableHead className="text-ash">Status</TableHead>
                <TableHead className="text-right text-ash">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-ash">
                    No projects assigned.
                  </TableCell>
                </TableRow>
              ) : (
                assignedProjects.map((project: any) => (
                  <TableRow key={project._id} className="border-b border-hairline bg-surface-card hover:bg-surface-bone/50">
                    <TableCell className="font-medium text-ink">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full border-hairline text-charcoal bg-surface-bone">
                        {project.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="rounded-full bg-badge-success text-white">
                        {project.status || 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(project._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

