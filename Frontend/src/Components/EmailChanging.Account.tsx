import React, { useState } from "react";
import {
  otpChangeEmail,
  verifyChangeEmail,
} from "../Services/CoreService/UserApi";
import { useAuthStore } from "../Hooks/AuthStore";

export default function EmailChanging() {
  // Global State
  const logout = useAuthStore((s) => s.logout);

  // Local State
  const [verifyPhase, setVerifyPhase] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>("");
  const [changingForm, setChangingForm] = useState({
    newEmail: "",
    otpCode: "",
  });

  const handleChangeBtn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await otpChangeEmail();
    if (response.success) {
      setVerifyPhase(true);
    } else {
      alert(response.message);
    }
  };

  const handleVerifyBtn = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await verifyChangeEmail(
      changingForm.newEmail,
      changingForm.otpCode,
    );
    alert(response.message);
    if (response.success) logout();
  };

  return (
    <div className="w-3/4 bg-white py-5 px-15">
      <div className="flex justify-start items-center border-b-2 border-gray-100">
        <h1 className="text-4xl font-bold py-10">Email Changing</h1>
      </div>
      <div className="py-5 w-full">
        <form className="flex items-center" onSubmit={handleChangeBtn}>
          <div className="lg:w-1/2 mb-10 md:w-full">
            <p className="mb-3 font-bold">New Email</p>
            <input
              type="email"
              name="newEmail"
              className={`w-full py-3 px-4 border border-gray-500 rounded-3xl ${verifyPhase && "bg-gray-300"}`}
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
              disabled={verifyPhase}
              required
            />
          </div>
          <button
            className={`px-8 py-3 rounded-3xl ml-10 bg-green-700 text-white font-bold ${verifyPhase ? "opacity-75" : "hover:bg-gray-500 hover:text-black cursor-pointer"}`}
            disabled={verifyPhase}
          >
            Change
          </button>
        </form>
        {verifyPhase && (
          <div>
            <p className="text-green-700 font-bold mb-10">
              We have sent the OTP to your new email, if it's you please verify
              it.
            </p>
            <form className="flex items-center" onSubmit={handleVerifyBtn}>
              <div className="lg:w-1/2 mb-10 md:w-full">
                <p className="mb-3 font-bold">OTP</p>
                <input
                  type="text"
                  name="otpCode"
                  className="w-full py-3 px-4 border border-gray-500 rounded-3xl"
                  value={changingForm.otpCode}
                  onChange={(e) => {
                    setChangingForm({
                      ...changingForm,
                      otpCode: e.target.value,
                    });
                  }}
                  required
                />
              </div>
              <button className="px-8 py-3 rounded-3xl ml-10 bg-green-700 text-white font-bold hover:bg-gray-500 hover:text-black cursor-pointer">
                Verify
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
