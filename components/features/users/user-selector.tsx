'use client';

import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Search, User as UserIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  clerkId: string;
  name: string;
  email: string;
  imageUrl?: string;
}

interface UserSelectorProps {
  onSelect: (user: User) => void;
  selectedUserId?: string;
}

export const UserSelector = ({ onSelect, selectedUserId }: UserSelectorProps) => {
  const listUsers = useAction(api.functions.clerk.listUsers);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await listUsers();
        setUsers(result);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [listUsers]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="flex flex-col h-[600px] border-hairline overflow-hidden">
      <div className="p-4 border-b border-hairline bg-surface-bone">
        <h3 className="text-lg font-semibold text-ink mb-4">Select User</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ash" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full border-hairline bg-surface-card"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-ash">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading users...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-ash">No users found</div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user.clerkId}
                onClick={() => onSelect(user)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  selectedUserId === user.clerkId
                    ? "bg-primary/10 border-primary border"
                    : "hover:bg-surface-bone border border-transparent"
                )}
              >
                <div className="h-10 w-10 rounded-full bg-stone overflow-hidden flex items-center justify-center">
                  {user.imageUrl ? (
                    <img src={user.imageUrl} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <UserIcon className="h-6 w-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate">{user.name}</p>
                  <p className="text-sm text-ash truncate">{user.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
