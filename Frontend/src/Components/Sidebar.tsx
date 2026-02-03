import type { SetStateAction } from "react";
import type React from "react";
import { FaAt, FaMailBulk, FaUser } from "react-icons/fa";
import { FaShield } from "react-icons/fa6";
import { IoWarning } from "react-icons/io5";
import type { Selection } from "../Pages/AccountPage";

interface Props {
  selection: Selection;
  setSelection: React.Dispatch<SetStateAction<Selection>>;
}

export default function Sidebar({ selection, setSelection }: Props) {
  return (
    <div className="w-1/4 bg-white p-9">
      <h1 className="font-bold text-3xl">Account management</h1>
      <div className="mt-10">
        <div
          className={`group flex items-center font-light p-3 rounded-xl hover:bg-gray-200 hover:font-normal cursor-pointer ${selection === "personal" && "bg-gray-300! font-bold!"}`}
          onClick={() => setSelection("personal")}
        >
          <FaUser
            className={`mr-3 text-gray-500 group-hover:text-gray-900 ${selection === "personal" && "text-black!"}`}
          />{" "}
          <p>Peronal Info</p>
        </div>
        <div
          className={`group flex items-center font-light p-3 rounded-xl hover:bg-gray-200 hover:font-normal cursor-pointer ${selection === "email" && "bg-gray-300! font-bold!"}`}
          onClick={() => setSelection("email")}
        >
          <FaAt
            className={`mr-3 text-gray-500 group-hover:text-gray-900 ${selection === "email" && "text-black!"}`}
          />
          <p>Change Email</p>
        </div>
        <div
          className={`group flex items-center font-light p-3 rounded-xl hover:bg-gray-200 hover:font-normal cursor-pointer ${selection === "password" && "bg-gray-300! font-bold!"}`}
          onClick={() => setSelection("password")}
        >
          <FaShield
            className={`mr-3 text-gray-500 group-hover:text-gray-900 ${selection === "password" && "text-black!"}`}
          />
          <p>Change Password</p>
        </div>
        <div
          className={`group flex items-center font-light p-3 rounded-xl hover:bg-gray-200 hover:font-normal cursor-pointer ${selection === "delete" && "bg-gray-300! font-bold!"}`}
          onClick={() => setSelection("delete")}
        >
          <IoWarning
            className={`mr-3 text-gray-500 group-hover:text-gray-900 ${selection === "delete" && "text-black!"}`}
          />
          <p>Delete Account</p>
        </div>
      </div>
    </div>
  );
}
