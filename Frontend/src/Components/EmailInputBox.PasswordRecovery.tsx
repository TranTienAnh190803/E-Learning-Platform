import { useState, type SetStateAction } from "react";
import type React from "react";
import { FaAt } from "react-icons/fa";
import type { Phase } from "../Pages/PasswordRecoveryPage";
import type { PasswordRecoveryNote } from "../Types/User.type";
import { enterEmailToRecoverPassword } from "../Services/CoreService/UserApi";

interface Props {
  setPhase: React.Dispatch<SetStateAction<Phase>>;
  note: PasswordRecoveryNote;
  setNote: React.Dispatch<SetStateAction<PasswordRecoveryNote>>;
}

export default function EmailInputBox({ setPhase, note, setNote }: Props) {
  const [email, setEmail] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await enterEmailToRecoverPassword(email);
    if (response.success) {
      setNote({ ...note, email: email });
      setPhase("enterOtp");
    } else {
      alert(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center font-bold text-green-700">
        Please enter your email address to proceed with password recovery.
      </div>
      <div>
        <div className="input-box my-6!">
          <input
            type="text"
            placeholder="Email"
            className="input-value font-bold"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
          <FaAt className="input-icon" />
        </div>

        <button className="font-bold w-full p-3 bg-gray-800 text-white hover:bg-gray-500 hover:text-gray-50 cursor-pointer">
          Send OTP
        </button>
      </div>
    </form>
  );
}
