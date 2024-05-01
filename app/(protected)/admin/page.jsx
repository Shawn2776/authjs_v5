"use client";

import { FormSuccess } from "@/components/FormSuccess";
import RoleGate from "@/components/auth/RoleGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const onApiRouteClick = async () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Admin-Only Api Route Success");
      } else {
        toast.error("Admin-Only Api Route Failed");
      }
    });
  };

  const onServerActionClick = async () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        toast.success("Admin-Only Server Action Success");
      } else {
        toast.error("Admin-Only Server Action Failed");
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-md">
          <p className="text-sm font-medium">Admin-Only Api Route</p>
          <Button onClick={onApiRouteClick}>Test Route</Button>
        </div>

        <div className="flex flex-row items-center justify-between p-3 border rounded-lg shadow-md">
          <p className="text-sm font-medium">Admin-Only Server Action</p>
          <Button onClick={onServerActionClick}>Test Action</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
