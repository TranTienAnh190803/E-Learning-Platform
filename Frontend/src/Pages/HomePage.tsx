import { useEffect, useState } from "react";
import { useAuthStore } from "../Hooks/AuthStore";
import type { User } from "../Types/Common.type";
import Navbar from "../Components/Navbar";
import { isAdmin } from "../Helper/CheckRole";
import UserManagement from "../Components/UserManagement";
import Footer from "../Components/Footer";
import Slider from "../Components/Slider";

export default function HomePage() {
  document.title = "E-Learning";
  // Global State
  const auth = useAuthStore((s) => s.auth);

  // Local State

  return (
    <div>
      <Navbar />
      <div className="min-h-screen">
        {/* Admin Home */}
        {auth.status === "authenticated" && isAdmin(auth.user.role) && (
          <UserManagement />
        )}
        {/* Unauthenticate, Student, Instructor Home */}
        {(auth.status !== "authenticated" ||
          (auth.status === "authenticated" && !isAdmin(auth.user.role))) && (
          <div className="mt-25">
            <Slider />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
