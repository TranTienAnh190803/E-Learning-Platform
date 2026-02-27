import { Link } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { isAdmin, isInstructor, isStudent } from "../Helper/CheckRole";
import { IoExit } from "react-icons/io5";
import { FaAngleDown, FaAt, FaBell, FaBook, FaUser } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
import { useEffect, useState } from "react";
import type { NotificationData } from "../Types/Notification.type";
import {
  getAllNotification,
  readAllNotification,
  readNotification,
} from "../Services/RealTimeService/NotificationApi";
import { getSocket } from "../Configurations/Socket";

export default function Navbar() {
  // Global State
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  // Local State
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationData[]>([]);

  // Side Event
  const handleDocClick = () => {
    setOpenMenu(false);
    setOpenNotification(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleDocClick);

    return () => {
      document.removeEventListener("click", handleDocClick);
    };
  }, []);

  // API
  const fetchAllNotification = async () => {
    const response = await getAllNotification();
    if (response.success) setNotification(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    if (auth.status === "authenticated") fetchAllNotification();
  }, [auth.status]);

  const handleReadMessage = async (notificationId: string) => {
    const response = await readNotification(notificationId);
    if (!response.success) alert(response.message);
  };

  const handleReadAll = async () => {
    const response = await readAllNotification();
    if (response.success) fetchAllNotification();
    else alert(response.message);
  };

  // Socket
  const handleNotification = (data: NotificationData) => {
    setNotification((prev) => {
      const oldData = prev;
      oldData.unshift(data);
      return oldData;
    });
  };

  useEffect(() => {
    const socket = getSocket();

    socket?.on("push-notification", handleNotification);

    return () => {
      socket?.off("push-notification", handleNotification);
    };
  }, []);

  return (
    <div className="h-25 px-25 fixed top-0 left-0 right-0 flex justify-between items-center bg-black shadow-xl/20 z-1000">
      <Link to={"/"} className="flex items-center select-none">
        <img src="/assets/Logo.jpg" className="h-15 rounded-2xl" />
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
          <div className="relative">
            <div
              className="text-2xl p-3 rounded-full bg-gray-800 mr-3 hover:bg-gray-900 hover:text-gray-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenNotification((prev) => !prev);
              }}
            >
              <FaBell />
            </div>
            {notification.length > 0 &&
              notification.some((value) => !value.isRead) && (
                <div className="absolute top-2 right-6 w-[10px] aspect-square bg-red-500 rounded-full"></div>
              )}
            {openNotification && (
              <div
                className="absolute right-0 top-15 min-w-[450px] min-h-[70vh] bg-white text-black rounded-2xl overflow-y-scroll scrollbar-hide shadow-xl/15"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-3 px-5 flex justify-between items-center border-b border-gray-200">
                  <p className="font-bold text-3xl">Notification</p>
                  <p
                    className="text-blue-500 text-sm hover:underline cursor-pointer"
                    onClick={() => {
                      handleReadAll();
                    }}
                  >
                    Mark as readed
                  </p>
                </div>
                {notification.map((value) => {
                  return (
                    <div
                      className={`p-5 cursor-pointer hover:bg-gray-100 ${!value.isRead && "bg-blue-50"}`}
                      onClick={() => {
                        handleReadMessage(value._id);
                      }}
                      key={value._id}
                    >
                      <p className="text-lg font-bold">{value.title}</p>
                      <p className="text-sm">{value.content}</p>
                      <div className="text-end"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Link
            to={"/chat-room"}
            target="_blank"
            className="text-2xl p-3 rounded-full bg-gray-800 mr-3 hover:bg-gray-900 hover:text-gray-300 cursor-pointer"
          >
            <LuMessageCircleMore />
          </Link>
          <div className="relative">
            <div
              className="px-3 py-2 flex items-center rounded-4xl bg-gray-800 hover:bg-gray-900 hover:text-gray-300 cursor-pointer select-none"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((prev) => !prev);
              }}
            >
              <div className="mr-3 rounded-full h-[45px] text-3xl overflow-hidden">
                <img
                  src={
                    auth.user.avatar === null
                      ? "/assets/User.jpg"
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
                          ? "/assets/User.jpg"
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
                      to={"/process-tracking"}
                      className="flex items-center py-3 px-5 hover:bg-gray-300 cursor-pointer"
                    >
                      <FaBook className="mr-3" /> Process Tracking
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
