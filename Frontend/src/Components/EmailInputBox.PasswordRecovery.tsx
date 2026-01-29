import { FaAt } from "react-icons/fa";

export default function EmailInputBox() {
  return (
    <form>
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
