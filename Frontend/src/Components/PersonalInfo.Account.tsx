import React, { useRef, useState } from "react";
import { useAuthStore } from "../Hooks/AuthStore";
import type { ProfileChangingForm } from "../Types/User.type";
import {
  changeAvatar,
  changePersonalInfo,
} from "../Services/CoreService/UserApi";

export default function PersonalInfo() {
  // Global State
  const auth = useAuthStore((s) => s.auth);
  const logout = useAuthStore((s) => s.logout);
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  if (auth.status !== "authenticated") {
    logout();
    return;
  }

  // Local State
  const imageRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<ProfileChangingForm>({
    fullName: auth.user.fullName,
    address: auth.user.address,
    dateOfBirth: auth.user.dateOfBirth,
    gender: auth.user.gender,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === "male";
    setUser({ ...user, gender: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await changePersonalInfo(user);
    alert(response.message);
    if (response.success) {
      initializeAuth();
    }
  };

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files![0];

    const formData = new FormData();
    formData.set("file", file);

    const response = await changeAvatar(formData);
    if (response.success) {
      initializeAuth();
    } else {
      alert(response.message);
    }
  };

  return (
    <form className="w-3/4 bg-white py-5 px-15" onSubmit={handleSubmit}>
      <div className="flex justify-start items-center border-b-2 border-gray-100">
        <h1 className="text-4xl font-bold py-10">Personal Information</h1>
      </div>
      <div className="py-5 border-b-2 border-gray-100 flex justify-between">
        <div
          className="group rounded-full overflow-hidden w-1/4 relative cursor-pointer border-5 border-black"
          onClick={() => {
            imageRef.current!.click();
          }}
        >
          <img
            src={
              auth.user.avatar !== null ? auth.user.avatar : "assets/User.jpg"
            }
            className="aspect-square w-full"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageRef}
            onChange={handleChangeAvatar}
          />
          <div className="hidden opacity-25 bg-gray-900 absolute bottom-0 top-0 left-0 right-0 flex justiy-center items-center group-hover:block"></div>
        </div>
        <p className="self-start font-bold">UserID: 1</p>
      </div>
      <div className="py-5">
        <div className="flex justify-between">
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Fullname</p>
            <input
              type="text"
              name="fullName"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
              value={user.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Address</p>
            <input
              type="text"
              name="address"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
              value={user.address}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="flex justify-between mt-10">
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Gender</p>
            <select
              name="gender"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
              value={user.gender === true ? "male" : "female"}
              onChange={handleSelection}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="w-[49%]">
            <p className="mb-3 font-bold">Date Of Birth</p>
            <input
              type="date"
              name="dateOfBirth"
              className="w-full py-3 px-4 border border-gray-300 rounded-3xl"
              value={
                user.dateOfBirth instanceof Date
                  ? user.dateOfBirth.toISOString().split("T")[0]
                  : user.dateOfBirth || ""
              }
              onChange={handleInputChange}
              required
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
