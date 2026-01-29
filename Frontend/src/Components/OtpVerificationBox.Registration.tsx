import { FaBarcode } from "react-icons/fa";
import type { VerifyEmailForm } from "../Types/User.type";
import type { SetStateAction } from "react";
import { verifyRegisteredEmail } from "../Services/CoreService/UserApi";
import { useNavigate } from "react-router-dom";

interface props {
  verifyEmailForm: VerifyEmailForm;
  setVerifyEmailForm: React.Dispatch<SetStateAction<VerifyEmailForm>>;
}

export default function EmailVerificationBox({
  verifyEmailForm,
  setVerifyEmailForm,
}: props) {
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setVerifyEmailForm({ ...verifyEmailForm, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await verifyRegisteredEmail(
      verifyEmailForm.email,
      verifyEmailForm.otpCode,
    );
    alert(response.message);
    if (response.success) {
      navigate("/login");
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
            value={verifyEmailForm.otpCode}
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
