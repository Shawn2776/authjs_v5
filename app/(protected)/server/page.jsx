import UserInfo from "@/components/UserInfo";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();

  return (
    <div>
      <UserInfo user={user} label="💻 Server Component" />
    </div>
  );
};

export default ServerPage;
