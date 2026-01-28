import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import {
  FaAngleDown,
  FaAt,
  FaCalendar,
  FaLock,
  FaMapPin,
  FaUser,
} from "react-icons/fa";
import { FaPerson } from "react-icons/fa6";

export default function RegistrationPage() {
  document.title = "Registration";
  // Global State
  const auth = useAuthStore((s) => s.auth);

  // Local State
  type RegistrationStage = "information" | "otp";

  if (auth.status === "authenticated") {
    return <Navigate to={"/"} />;
  }

  return (
    <div
      className={`h-screen flex items-center bg-cover bg-center bg-[url(/assets/Login.jpg)]`}
    >
      <div className="h-full lg:w-3/7 md:w-3/5 sm:w-4/5 flex items-center justify-center border-r-2 border-white rounded-r-[35%] p-8 bg-white/70 backdrop-blur-md">
        <form className="w-9/10 px-3">
          <h1 className="text-5xl font-bold text-center">Registration</h1>
          <hr className="mt-3 mb-8" />
          <div className="flex justify-between gap-2">
            <button
              type="button"
              className="border border-sky-600 text-sky-600 w-full py-2"
            >
              Instructor
            </button>
            <button
              type="button"
              className="border border-green-600 text-green-600 w-full py-2"
            >
              Student
            </button>
          </div>
          <div>
            <div className="flex gap-2 mt-5">
              <div className="input-box my-3!">
                <input
                  type="text"
                  placeholder="Fullname"
                  className="input-value font-bold"
                  name="fullname"
                  required
                />
                <FaUser className="input-icon" />
              </div>
              <div className="input-box my-3!">
                <input
                  type="text"
                  placeholder="Address"
                  className="input-value font-bold"
                  name="address"
                  required
                />
                <FaMapPin className="input-icon" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="input-box my-3!">
                <input type="date" className="input-value" name="dateOfBirth" />
                <FaCalendar className="input-icon" />
              </div>
              <div className="input-box my-3!">
                <select
                  name="gender"
                  className="input-value p-0! pl-[20px]! pr-[45px]!"
                  required
                >
                  <option value="" hidden disabled selected>
                    Gender
                  </option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <FaAngleDown
                  className="input-icon"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            </div>
            <div>
              <div className="input-box my-3!">
                <input
                  type="text"
                  placeholder="Email"
                  className="input-value font-bold"
                  name="email"
                  required
                />
                <FaAt className="input-icon" />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              <div className="input-box my-3!">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-value font-bold"
                  name="email"
                  required
                />
                <FaLock className="input-icon" />
              </div>
              <div className="input-box my-3!">
                <input
                  type="password"
                  placeholder="Re-enter Password"
                  className="input-value font-bold"
                  name="reEnteredPassword"
                  required
                />
                <FaLock className="input-icon" />
              </div>
            </div>

            <button className="font-bold w-full p-3 bg-gray-800 text-white hover:bg-gray-500 hover:text-gray-50 cursor-pointer">
              Register
            </button>
            <p className="mt-3 text-center">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="font-bold hover:text-blue-600 hover:underline underline-offset-4"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
