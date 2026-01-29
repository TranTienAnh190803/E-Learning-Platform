import React, { useRef, useState } from "react";
import {
  FaAngleDown,
  FaAt,
  FaCalendar,
  FaLock,
  FaMapPin,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import type { RegistrationStage } from "../Pages/RegistrationPage";
import type { RegistrationForm, VerifyEmailForm } from "../Types/User.type";
import type { ApiResponse } from "../Types/Common.type";
import {
  registerInstructor,
  registerStudent,
} from "../Services/CoreService/UserApi";

interface props {
  setRegistrationStage: React.Dispatch<React.SetStateAction<RegistrationStage>>;
  setVerifyEmailForm: React.Dispatch<React.SetStateAction<VerifyEmailForm>>;
}

export default function ResgistrationBox({
  setRegistrationStage,
  setVerifyEmailForm,
}: props) {
  const dateRef = useRef<HTMLInputElement>(null);
  type RegistrationObject = "instructor" | "student";
  const [registrationObject, setRegistrationObject] =
    useState<RegistrationObject>("instructor");
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    fullName: "",
    dateOfBirth: undefined,
    gender: undefined,
    address: "",
    email: "",
    password: "",
    reEnteredPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegistrationObject = (e: React.MouseEvent<HTMLButtonElement>) => {
    const name = (e.target as HTMLButtonElement).name;
    setRegistrationObject(name as RegistrationObject);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setRegistrationForm({ ...registrationForm, [name]: value });
  };

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let genderValue: boolean | undefined;
    if (value === "male") genderValue = true;
    else if (value === "female") genderValue = false;
    else genderValue = undefined;

    setRegistrationForm({ ...registrationForm, gender: genderValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    let response: ApiResponse<void>;
    if (registrationObject === "instructor")
      response = await registerInstructor(registrationForm);
    else response = await registerStudent(registrationForm);

    if (response.success) {
      setVerifyEmailForm({
        otpCode: "",
        email: registrationForm.email,
      });
      setRegistrationStage("otp");
    } else {
      alert(response.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex justify-between gap-2">
        <button
          type="button"
          name={"instructor" as RegistrationObject}
          className={`border ${registrationObject === "instructor" ? "text-white bg-sky-600 font-bold" : "text-sky-600"} border-sky-600 w-full py-2 cursor-pointer hover:text-white hover:bg-sky-800`}
          onClick={handleRegistrationObject}
        >
          Instructor
        </button>
        <button
          type="button"
          name={"student" as RegistrationObject}
          className={`border ${registrationObject === "student" ? "text-white bg-green-600 font-bold" : "text-green-600"} border-green-600 text-green-600 w-full py-2 cursor-pointer hover:text-white hover:bg-green-800`}
          onClick={handleRegistrationObject}
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
              name="fullName"
              value={registrationForm.fullName}
              onChange={handleInputChange}
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
              value={registrationForm.address}
              onChange={handleInputChange}
              required
            />
            <FaMapPin className="input-icon" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="input-box my-3!">
            <input
              type="date"
              className="input-value font-bold"
              ref={dateRef}
              name="dateOfBirth"
              value={
                registrationForm.dateOfBirth instanceof Date
                  ? registrationForm.dateOfBirth.toISOString().split("T")[0]
                  : registrationForm.dateOfBirth || ""
              }
              onChange={handleInputChange}
              required
            />
            <FaCalendar
              className="input-icon cursor-pointer"
              onClick={() => dateRef.current?.showPicker()}
            />
          </div>
          <div className="input-box my-3!">
            <select
              name="gender"
              className="input-value p-0! pl-[20px]! pr-[45px]! font-bold"
              value={
                registrationForm.gender === true
                  ? "male"
                  : registrationForm.gender === false
                    ? "female"
                    : ""
              }
              onChange={handleGenderChange}
              required
            >
              <option value="" hidden disabled selected>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
              value={registrationForm.email}
              onChange={handleInputChange}
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
              name="password"
              value={registrationForm.password}
              onChange={handleInputChange}
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
              value={registrationForm.reEnteredPassword}
              onChange={handleInputChange}
              required
            />
            <FaLock className="input-icon" />
          </div>
        </div>

        <button
          className="font-bold w-full p-3 bg-gray-800 text-white hover:bg-gray-500 hover:text-gray-50 cursor-pointer"
          disabled={loading}
        >
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
  );
}
