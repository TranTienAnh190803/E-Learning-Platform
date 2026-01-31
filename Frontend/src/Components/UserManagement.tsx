import { useEffect, useState } from "react";
import { FaAngleDown, FaCircle, FaSearch } from "react-icons/fa";
import type { User } from "../Types/Common.type";
import { getAllUser } from "../Services/CoreService/UserApi";
import { dateFormat } from "../Helper/Converter";
import { IoIosMore } from "react-icons/io";

export default function UserManagement() {
  type Role = "ALL" | "INSTRUCTOR" | "STUDENT";
  const [role, setRole] = useState<Role>("ALL");
  const [userList, setUserList] = useState<User[]>([]);
  // id of the row whose menu is open; null when none are open
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);

  // Close the open menu when clicking anywhere outside
  useEffect(() => {
    const handleDocClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const fetchAllUser = async () => {
    const response = await getAllUser();
    if (response.success) setUserList(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    fetchAllUser();
  }, []);

  return (
    <div className="min-h-screen handle-navbar bg-white">
      <div className="px-25 py-10 flex justify-between items-center gap-[10%] border-b-3 border-gray-200">
        <h1 className="text-5xl font-bold w-2/3">User Management</h1>
        <form className="input-box w-[50%]!">
          <input
            type="email"
            placeholder="Search"
            className="input-value-reverse font-bold"
            name="reEnteredPassword"
            required
          />
          <FaSearch className="input-icon-reverse" />
        </form>
        <div className="input-box w-[20%]!">
          <select
            name="role"
            className="input-value p-0! pl-[20px]! pr-[45px]! font-bold"
            value={role}
            required
          >
            <option value={"ALL" as Role} selected>
              All
            </option>
            <option value={"INSTRUCTOR" as Role}>Instructor</option>
            <option value={"STUDENT" as Role}>Student</option>
          </select>
          <FaAngleDown
            className="input-icon"
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>
      <div className="px-[10%] py-10 overflow-x-auto">
        {userList.length > 0 ? (
          <table className="lg:w-full md:size-fit table-auto">
            <thead>
              <tr className="border-b-1! font-bold">
                <td>#</td>
                <td>Fullname</td>
                <td>Email</td>
                <td>Address</td>
                <td>Date Of Birth</td>
                <td>Gender</td>
                <td>Permission</td>
                <td>Status</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {userList.map((value, index) => {
                return (
                  <tr
                    key={value.id}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td>{index + 1}</td>
                    <td>{value.fullName}</td>
                    <td>{value.email}</td>
                    <td>{value.address}</td>
                    <td>{dateFormat(value.dateOfBirth)}</td>
                    <td>{value.gender ? "Male" : "Female"}</td>
                    <td>{value.role}</td>
                    <td className="place-items-center">
                      {
                        <FaCircle
                          className={
                            value.statusNumber === 0
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        />
                      }
                    </td>
                    <td>
                      <div className="relative">
                        <div
                          className="hover:bg-gray-300 aspect-square w-10 rounded-full flex justify-center items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((prev) =>
                              prev === value.id ? null : value.id,
                            );
                          }}
                          data-menu-button
                        >
                          <IoIosMore />
                        </div>

                        {openMenuId === value.id && (
                          <div
                            className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded text-sm z-10 border-1 border-gray-300"
                            data-menu
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => console.log("View", value.id)}
                            >
                              {value.statusNumber === 0 ? "Disable" : "Enable"}
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                              onClick={() => console.log("Delete", value.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="select-none flex flex-col items-center">
            <img
              src="/assets/NoData.jpg"
              alt="NoUser"
              draggable={false}
              className="w-1/4"
            />
            <div className="text-gray-500 text-center">
              <h1 className="font-bold text-3xl my-2">
                There Is No Registered User.
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
