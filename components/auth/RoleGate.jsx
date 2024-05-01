"use client";

import useCurrentRole from "@/hooks/useCurrentRole";
import { FormError } from "../FormError";

const RoleGate = ({ children, allowedRole }) => {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return <FormError message="You are not authorized to view this page." />;
  }
  return <>{children}</>;
};

export default RoleGate;
