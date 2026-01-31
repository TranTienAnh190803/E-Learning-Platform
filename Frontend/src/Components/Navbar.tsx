import { Link } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { isAdmin } from "../Helper/CheckRole";
import { IoExit } from "react-icons/io5";

export default function Navbar() {
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="h-25 px-25 fixed top-0 left-0 right-0 flex justify-between items-center bg-black shadow-xl/20 z-1000">
      <Link to={"/"} className="flex items-center select-none">
        <img src="assets/Logo.jpg" className="h-15 rounded-2xl" />
        <p className="pl-3 font-bold text-white text-3xl">
          {auth.status === "authenticated" && isAdmin(auth.user.role)
            ? "Admin"
            : "E-Learning"}
        </p>
      </Link>
      {/* Haven't Login yet */}
      {auth.status !== "authenticated" && (
        <div className="flex">
          <Link
            to={"/login"}
            className="font-bold px-5 py-2 mr-3 text-white rounded-xl border border-white hover:bg-blue-700 hover:border-blue-700"
          >
            Sign In
          </Link>
          <Link
            to={"/register"}
            className="font-bold px-5 py-2 text-black rounded-xl bg-white hover:bg-gray-800 hover:text-white"
          >
            Register
          </Link>
        </div>
      )}
      {/* Admin Navbar */}
      {auth.status === "authenticated" && isAdmin(auth.user.role) && (
        <button
          className="flex items-center font-bold px-5 py-2 text-white rounded-xl bg-red-700 hover:bg-red-800 cursor-pointer"
          onClick={() => logout()}
        >
          <IoExit className="mr-2" />
          Logout
        </button>
      )}
      {/* Instructor & Student Navbar */}
    </div>
  );
}
