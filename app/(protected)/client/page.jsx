"use client";

import UserInfo from "@/components/UserInfo";
import useCurrentUser from "@/hooks/useCurrentUser";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <div>
      <UserInfo user={user} label="🧑‍💻 Client Component" />
    </div>
  );
};

export default ClientPage;
