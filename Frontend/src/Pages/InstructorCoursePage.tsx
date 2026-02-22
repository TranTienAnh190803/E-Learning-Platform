import { Link, useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import type { CourseData } from "../Types/Course.type";
import {
  deleteCourse,
  getOwnedCourse,
} from "../Services/CoreService/CourseApi";
import { useAuthStore } from "../Hooks/AuthStore";
import { isInstructor } from "../Helper/CheckRole";
import { FaCircle, FaSearch } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";

const coreService = import.meta.env.VITE_CORE_SERVICE;

export default function InstructorCoursePage() {
  // Global State
  const auth = useAuthStore((s) => s.auth);

  // Local State
  const navigate = useNavigate();
  const [courses, setCourse] = useState<CourseData[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | string | null>(null);

  useEffect(() => {
    const handleDocClick = () => setOpenMenuId(null);
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const fetchOwnedCourse = async () => {
    const response = await getOwnedCourse();
    if (response.success) setCourse(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    if (auth.status === "authenticated" && isInstructor(auth.user.role))
      fetchOwnedCourse();
  }, []);

  const handleDeleteCourse = async (courseId: number) => {
    if (confirm("Are you sure you want to DELETE this course?")) {
      const response = await deleteCourse(courseId);
      alert(response.message);
      if (response.success) window.location.reload();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-25 px-20 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 pb-30">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-5xl font-bold">My Course</h1>
            <Link
              to={"/add-course"}
              className="bg-green-700 text-white px-5 py-3 rounded-3xl font-bold hover:bg-green-200 hover:text-black"
            >
              + Add Courses
            </Link>
          </div>
          <div className="flex mt-3 mb-5 items-center justify-end">
            <input
              type="text"
              className="rounded-3xl px-5 py-2 border border-gray-300"
              placeholder="Search"
            />
            <button className="bg-green-700 text-white rounded-full p-3 ml-3 cursor-pointer hover:bg-green-300 hover:text-black">
              <FaSearch />
            </button>
          </div>
          {courses?.length > 0 ? (
            <table className="lg:w-full md:size-fit table-auto w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                  <td className="px-4 py-2">#</td>
                  <td className="px-4 py-2">Title</td>
                  <td className="px-4 py-2">Public</td>
                  <td className="px-4 py-2">Status</td>
                  <td className="px-4 py-2"></td>
                </tr>
              </thead>
              <tbody>
                {courses?.map((value, index) => {
                  return (
                    <tr
                      key={value.id}
                      className="hover:bg-gray-100 cursor-pointer border-b border-gray-300"
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2 flex items-center">
                        <img
                          src={
                            value.imageUrl
                              ? `${coreService}/${value.imageUrl}`
                              : "assets/DefaultCourse.jpg"
                          }
                          className="block w-[15%]"
                        />
                        <p className="ml-5">{value.title}</p>
                      </td>
                      <td className="px-4 py-2 place-items-center">
                        {
                          <FaCircle
                            className={`${value.publicCourse ? "text-green-500" : "text-red-500"}`}
                          />
                        }
                      </td>
                      <td className="px-4 py-2">{value.status}</td>
                      <td>
                        <div className="relative">
                          <div
                            className="hover:bg-gray-300 aspect-square w-10 rounded-full flex justify-center items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId((prev) =>
                                prev === value.id ? null : value.id,
                              );
                            }}
                            data-menu-button
                          >
                            <IoIosMore />
                          </div>

                          {openMenuId === value.id && (
                            <div
                              className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded text-sm z-10 border-1 border-gray-300"
                              data-menu
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  navigate(`/course-detail/${value.id}`);
                                }}
                              >
                                Details
                              </button>
                              <button
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  navigate(`/update-course/${value.id}`);
                                }}
                              >
                                Update
                              </button>
                              <button
                                className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  handleDeleteCourse(value.id);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="select-none flex flex-col items-center">
              <img
                src="/assets/NoData.jpg"
                alt="NoUser"
                draggable={false}
                className="w-1/4"
              />
              <div className="text-gray-500 text-center">
                <h1 className="font-bold text-3xl my-2">
                  There Is No Registered User.
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
