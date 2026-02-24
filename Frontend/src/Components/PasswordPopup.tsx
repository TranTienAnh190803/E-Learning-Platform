import type { FormEvent, SetStateAction } from "react";
import type React from "react";
import { IoClose } from "react-icons/io5";
import { enrollCourse } from "../Services/CoreService/EnrollmentApi";
import { useNavigate } from "react-router-dom";

interface Props {
  setPopup: React.Dispatch<SetStateAction<boolean>>;
  setPassword: React.Dispatch<SetStateAction<string>>;
  courseId: number;
  password: string;
}

export default function PasswordPopup({
  setPopup,
  setPassword,
  courseId,
  password,
}: Props) {
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await enrollCourse(courseId, password);
    alert(response.message);
    if (response.success) {
      navigate("");
      window.location.reload();
    }
  };

  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-0 bg-black/50 flex justify-center items-center"
      onClick={() => {
        setPopup(false);
        setPassword("");
      }}
    >
      <form
        className="w-1/2 bg-white relative overflow-hidden rounded-2xl p-5"
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={handleEnroll}
      >
        <div
          className="bg-red-700 text-white hover:bg-gray-500 hover:text-black absolute right-0 top-0 p-1 cursor-pointer"
          onClick={() => {
            setPopup(false);
            setPassword("");
          }}
        >
          <IoClose className="text-3xl" />
        </div>
        <h1 className="text-3xl py-3 font-bold">Password</h1>
        <hr className="my-3" />
        <input
          type="password"
          onChange={handleInputChange}
          className="w-full py-3 px-4 border border-gray-300 rounded-3xl mt-5"
          placeholder="Enter course password"
        />
        <p className="text-xs text-gray-700 mt-3 mb-8">
          The course you about to enter is a private course, please enter the
          course's password in order to enroll.
        </p>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer">
          Enroll
        </button>
      </form>
    </div>
  );
}
