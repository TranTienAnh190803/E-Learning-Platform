import { useEffect, useState } from "react";
import { useAuthStore } from "../Hooks/AuthStore";
import type { User } from "../Types/Common.type";
import Navbar from "../Components/Navbar";

export default function HomePage() {
  // Global State
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  // Local State
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (auth.status === "authenticated") {
      setUser(auth.user);
      console.log(user);
    }
  });

  return (
    <div>
      {/* <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button> */}
      <Navbar />
      <div></div>
    </div>
  );
}
