import { useEffect } from "react";
import { useAuthStore } from "../Hooks/AuthStore";

export default function HomePage() {
  // Global State
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    console.log(auth);
  });

  return (
    <div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
