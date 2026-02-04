import React, { useState } from "react";
import type { PasswordChangingForm } from "../Types/User.type";
import { changeUserPassword } from "../Services/CoreService/UserApi";

export default function PasswordChanging() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [passwordForm, setPasswordForm] = useState<PasswordChangingForm>({
    newPassword: "",
    reEnteredPassword: "",
  });

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await changeUserPassword(passwordForm, oldPassword);
    alert(response.message);
    if (response.success) window.location.reload();
  };

  return (
    <form className="w-3/4 bg-white py-5 px-15" onSubmit={handleSubmit}>
      <div className="flex justify-start items-center border-b-2 border-gray-100">
        <h1 className="text-4xl font-bold py-10">Password Changing</h1>
      </div>
      <div className="py-5 w-full">
        <div className="lg:w-1/2 mb-10 md:w-full">
          <p className="mb-3 font-bold">Old Password</p>
          <input
            type="password"
            name="oldPassword"
            className="w-full py-3 px-4 border border-gray-500 rounded-3xl"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            required
          />
        </div>
        <div className="lg:w-1/2 my-10 md:w-full">
          <p className="mb-3 font-bold">New Password</p>
          <input
            type="password"
            name="newPassword"
            className="w-full py-3 px-4 border border-gray-500 rounded-3xl"
            value={passwordForm.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="lg:w-1/2 mt-10 mb-20 md:w-full">
          <p className="mb-3 font-bold">Re-enter Password</p>
          <input
            type="password"
            name="reEnteredPassword"
            className="w-full py-3 px-4 border border-gray-500 rounded-3xl"
            value={passwordForm.reEnteredPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="lg:w-1/2 px-5 py-3 bg-black text-white font-bold hover:bg-gray-500 hover:text-black cursor-pointer md:w-full">
          Change Password
        </button>
      </div>
    </form>
  );
}
