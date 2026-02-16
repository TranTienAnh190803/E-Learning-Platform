import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import type { CourseData } from "../Types/Course.type";
import { getAllCourse } from "../Services/CoreService/CourseApi";
import { useAuthStore } from "../Hooks/AuthStore";
import { isAdmin } from "../Helper/CheckRole";
import Card from "./Card";

export default function DefaultHome() {
  // Global State
  const auth = useAuthStore((s) => s.auth);

  // Local State
  const [courses, setCourses] = useState<CourseData[]>([]);

  const fetchAllCourse = async () => {
    const response = await getAllCourse();
    if (response.success) setCourses(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    if (
      auth.status !== "authenticated" ||
      (auth.status === "authenticated" && !isAdmin(auth.user.role))
    )
      fetchAllCourse();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center mx-[30%] mt-10">
        <div className="input-box bg-white border border-gray-500">
          <input
            type="text"
            placeholder="Search course"
            className="input-value font-bold pr-[20px]!"
            name="title"
            required
          />
        </div>
        <button className="h-[50px] w-[50px] bg-blue-500 flex items-center justify-center border-y border-r border-gray-500 hover:bg-blue-300 hover:text-white cursor-pointer">
          <FaSearch />
        </button>
      </div>
      <div className="my-10 py-10 px-30">
        <h1 className="text-5xl font-bold">Courses</h1>
        <hr className="my-8" />
        <div className="flex gap-[5%] flex-wrap mt-10">
          {courses.map((value) => {
            return <Card course={value} key={value.id} />;
          })}
        </div>
      </div>
    </>
  );
}
