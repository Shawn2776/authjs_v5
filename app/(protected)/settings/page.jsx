"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import { Logout } from "@/lib/actions";

const SettingsPage = () => {
  const user = useCurrentUser();

  const onClick = () => {
    Logout();
  };

  return (
    <div className="p-10 bg-white rounded-xl">
      <button onClick={onClick} type="submit">
        Sign Out
      </button>
    </div>
  );
};

export default SettingsPage;

// import { auth, signOut } from "@/auth";

// const SettingsPage = async () => {
//   const session = await auth();

//   return (
//     <div>
//       {JSON.stringify(session)}
//       <form
//         action={async () => {
//           "use server";

//           await signOut();
//         }}
//       >
//         <button type="submit">Sign Out</button>
//       </form>
//     </div>
//   );
// };

// export default SettingsPage;
