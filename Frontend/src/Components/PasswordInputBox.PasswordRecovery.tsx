import { useState } from "react";
import type React from "react";
import { FaLock, FaUserLock } from "react-icons/fa";
import type {
  PasswordChangingForm,
  PasswordRecoveryNote,
} from "../Types/User.type";
import { recoverPassword } from "../Services/CoreService/UserApi";
import { useNavigate } from "react-router-dom";

interface Props {
  note: PasswordRecoveryNote;
}

export default function PasswordInputBox({ note }: Props) {
  const navigate = useNavigate();
  const [passwordChangingForm, setPasswordChangingForm] =
    useState<PasswordChangingForm>({
      newPassword: "",
      reEnteredPassword: "",
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setPasswordChangingForm({ ...passwordChangingForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await recoverPassword(
      note.email,
      note.otpCode,
      passwordChangingForm,
    );
    alert(response.message);
    if (response.success) {
      navigate("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="my-6">
          <div className="input-box ">
            <input
              type="password"
              placeholder="New Password"
              className="input-value font-bold"
              name="newPassword"
              value={passwordChangingForm.newPassword}
              onChange={handleInputChange}
              required
            />
            <FaUserLock className="input-icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Re-enter Password"
              className="input-value font-bold"
              name="reEnteredPassword"
              value={passwordChangingForm.reEnteredPassword}
              onChange={handleInputChange}
              required
            />
            <FaLock className="input-icon" />
          </div>
        </div>

        <button className="font-bold w-full p-3 bg-gray-800 text-white hover:bg-gray-500 hover:text-gray-50 cursor-pointer">
          Change Password
        </button>
      </div>
    </form>
  );
}
