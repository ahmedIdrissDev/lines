import React from 'react';
import { Card } from "@/components/ui/card";
import { UserManagementTable } from "@/components/features/users/user-management-table";
import { Badge } from '@/components/ui/badge';

const Page = () => {
  return (
    <main className="flex flex-col gap-4 bg-canvas p-4 md:p-8">
      <Card className="gap-0 overflow-hidden border-0 bg-transparent p-0">
        <div className="bg-primary px-5 py-4 text-on-primary">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="caption-tight text-on-dark-mute">ADM</p>
              <h1 className="heading-md text-on-primary">Administration</h1>
            </div>
            <Badge variant="secondary" className="w-fit">
              Module
            </Badge>
          </div>
        </div>
      </Card>

      <div className="rounded-md bg-surface-card">
        <Card className="border-0 bg-transparent overflow-hidden">
          <UserManagementTable />
        </Card>
      </div>
    </main>
  );
};

export default Page;
