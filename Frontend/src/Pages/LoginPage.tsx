import { FaLock, FaUser } from "react-icons/fa";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginForm } from "../Types/User.type";

export default function LoginPage() {
  document.title = "Login";
  // Global State
  const auth = useAuthStore((s) => s.auth);
  const login = useAuthStore((s) => s.login);

  // Local State
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(loginForm);
  };

  if (auth.status === "authenticated") {
    return <Navigate to={"/"} />;
  }

  return (
    <div
      className={`h-screen flex items-center bg-cover bg-center bg-[url(/assets/Login.jpg)]`}
    >
      <div className="h-full lg:w-2/5 md:w-3/5 sm:w-4/5 flex items-center justify-center border-r-2 border-white rounded-r-[35%] p-8 bg-white/70 backdrop-blur-md">
        <form className="w-4/5" onSubmit={handleSubmit}>
          <h1 className="text-5xl font-bold text-center">Login</h1>
          <hr className="mt-3 mb-8" />
          <div>
            <div>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Email"
                  className="input-value font-bold"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  required
                />
                <FaUser className="input-icon" />
              </div>
              <div className="input-box">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-value font-bold"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  required
                />
                <FaLock className="input-icon" />
              </div>
            </div>
            <div className="flex justify-between mb-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  className="mr-2 scale-125"
                />
                <span>Remember Me</span>
              </label>
              <Link
                to={"/forgot-password"}
                className="font-bold hover:text-blue-600 hover:underline underline-offset-4"
              >
                Forgot Password?
              </Link>
            </div>
            <button className="font-bold w-full p-3 bg-gray-800 text-white hover:bg-gray-500 hover:text-gray-50 cursor-pointer">
              Login
            </button>
            <p className="mt-3 text-center">
              Don't have an account?{" "}
              <Link
                to={"/register"}
                className="font-bold hover:text-blue-600 hover:underline underline-offset-4"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
