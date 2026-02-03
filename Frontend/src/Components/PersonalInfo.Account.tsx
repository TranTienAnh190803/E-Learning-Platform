import { useState } from "react";
import { useAuthStore } from "../Hooks/AuthStore";
import type { User } from "../Types/Common.type";

export default function PersonalInfo() {
  // Global State
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);

  if (auth.status !== "authenticated") {
    logout();
    return;
  }

  // Local State
  const [user, setUser] = useState<User>(auth.user);

  return (
    <form className="w-3/4 bg-white border-l-2 border-gray-200 py-5 px-15">
      <div className="flex justify-start items-center border-b-2 border-gray-100">
        <h1 className="text-4xl font-bold py-10">Personal Information</h1>
      </div>
      <div className="py-5 border-b-2 border-gray-100 flex justify-between">
        <div className="rounded-full overflow-hidden w-1/4">
          <img
            src={
              auth.user.avatar !== null ? auth.user.avatar : "assets/User.jpg"
            }
          />
        </div>
        <p className="self-start font-bold">UserID: 1</p>
      </div>
      <div className="py-5">
        <div className="flex justify-between">
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Fullname</p>
            <input
              type="text"
              name="fullname"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
            />
          </div>
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Address</p>
            <input
              type="text"
              name="address"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
            />
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Gender</p>
            <select
              name="gender"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
            >
              <option value="">Male</option>
              <option value="">Female</option>
            </select>
          </div>
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Date Of Birth</p>
            <input
              type="date"
              name="address"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
            />
          </div>
        </div>
        <div className="text-end my-10">
          <button className="px-8 py-3 bg-green-700 text-white text-lg font-bold rounded-2xl hover:bg-green-900 cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
