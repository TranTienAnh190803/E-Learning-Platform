import { Link } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { isAdmin, isInstructor, isStudent } from "../Helper/CheckRole";
import { IoExit } from "react-icons/io5";
import { FaAngleDown, FaAt, FaBell, FaBook, FaUser } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function Navbar() {
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleDocClick = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleDocClick);

    return () => {
      document.removeEventListener("click", handleDocClick);
    };
  }, []);

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
      {auth.status === "authenticated" && !isAdmin(auth.user.role) && (
        <div className="flex justify-between items-center text-white">
          <div className="text-2xl p-3 rounded-full bg-gray-800 mr-3 hover:bg-gray-900 hover:text-gray-300 cursor-pointer">
            <FaBell />
          </div>
          <div className="text-2xl p-3 rounded-full bg-gray-800 mr-3 hover:bg-gray-900 hover:text-gray-300 cursor-pointer">
            <LuMessageCircleMore />
          </div>
          <div className="relative">
            <div
              className="px-3 py-2 flex items-center rounded-4xl bg-gray-800 hover:bg-gray-900 hover:text-gray-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((prev) => !prev);
              }}
            >
              <div className="mr-3 rounded-full h-[45px] text-3xl overflow-hidden">
                <img
                  src={
                    auth.user.avatar === null
                      ? "assets/User.jpg"
                      : auth.user.avatar
                  }
                  className="h-full aspect-square"
                />
              </div>
              <h1 className="font-bold mr-5">{auth.user.fullName}</h1>
              <div>
                <FaAngleDown />
              </div>
            </div>
            {openMenu && (
              <div
                className="absolute right-0 top-15 min-w-[380px] bg-white text-black rounded-2xl overflow-hidden shadow-xl/15"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="flex items-start py-5 px-3 border-b-1 border-gray-300">
                  <div className="h-[80px] rounded-full overflow-hidden border-1 border-gray-300">
                    <img
                      src={
                        auth.user.avatar === null
                          ? "assets/User.jpg"
                          : auth.user.avatar
                      }
                      className="h-full aspect-square"
                    />
                  </div>
                  <div className="ml-3">
                    <h1 className="font-bold text-3xl">{auth.user.fullName}</h1>
                    <h1 className="font-light text-sm">{auth.user.email}</h1>
                  </div>
                </div>
                <div>
                  <Link
                    to={"/profile"}
                    className="flex items-center py-3 px-5 hover:bg-gray-300 cursor-pointer"
                  >
                    <FaUser className="mr-3" /> Profile
                  </Link>
                  {isStudent(auth.user.role) && (
                    <Link
                      to={"/course"}
                      className="flex items-center py-3 px-5 hover:bg-gray-300 cursor-pointer"
                    >
                      <FaBook className="mr-3" /> Courses
                    </Link>
                  )}
                  {isInstructor(auth.user.role) && (
                    <Link
                      to={"/my-course"}
                      className="flex items-center py-3 px-5 hover:bg-gray-300 cursor-pointer"
                    >
                      <FaBook className="mr-3" /> My Courses
                    </Link>
                  )}
                  <Link
                    to={"/account"}
                    className="flex items-center py-3 px-5 border-b-1 border-gray-300 hover:bg-gray-300 cursor-pointer"
                  >
                    <FaAt className="mr-3" /> Account
                  </Link>
                  <div
                    className="flex items-center py-3 px-5 text-red-500 hover:bg-gray-300 cursor-pointer"
                    onClick={() => logout()}
                  >
                    <IoExit className="mr-3" /> Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
