import { useState, type SetStateAction } from "react";
import type React from "react";
import { FaBarcode } from "react-icons/fa";
import type { Phase } from "../Pages/PasswordRecoveryPage";
import type { PasswordRecoveryNote } from "../Types/User.type";
import { verifyOtpToRecoverPassword } from "../Services/CoreService/UserApi";

interface Props {
  setPhase: React.Dispatch<SetStateAction<Phase>>;
  note: PasswordRecoveryNote;
  setNote: React.Dispatch<SetStateAction<PasswordRecoveryNote>>;
}

export default function OtpInputBox({ setPhase, note, setNote }: Props) {
  const [otpCode, setOtpCode] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtpCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await verifyOtpToRecoverPassword(note.email, otpCode);
    if (response.success) {
      setNote({ ...note, otpCode: otpCode });
      setPhase("enterNewPassword");
    } else {
      alert(response.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-center font-bold text-green-700">
        We have sent you an OTP code to your inbox. Please enter that OTP code
        below to confirm your email.
      </div>
      <div>
        <div className="input-box my-6!">
          <input
            type="text"
            placeholder="OTP"
            className="input-value font-bold"
            name="otpCode"
            value={otpCode}
            onChange={handleInputChange}
            required
          />
          <FaBarcode className="input-icon" />
        </div>

        <button className="font-bold w-full p-3 bg-gray-800 text-white hover:bg-gray-500 hover:text-gray-50 cursor-pointer">
          Verify
        </button>
      </div>
    </form>
  );
}
