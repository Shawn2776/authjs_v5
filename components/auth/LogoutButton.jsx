"use client";

import { Logout } from "@/lib/actions";

const LogoutButton = ({ children }) => {
  const onClick = () => {
    Logout();
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LogoutButton;
