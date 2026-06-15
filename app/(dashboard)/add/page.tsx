import React from 'react';
import { Card } from "@/components/ui/card";
import { UserManagementTable } from "@/components/features/users/user-management-table";

const Page = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl ">User Management</h1>
      </div>

      <Card className="border-hairline  bg overflow-hidden">
        <UserManagementTable />
      </Card>
    </div>
  );
};

export default Page;
