import { useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import Overview from "../Components/Overview.CourseDetail";
import { getOneCourse } from "../Services/CoreService/CourseApi";
import type { CourseData } from "../Types/Course.type";
import LessonList from "../Components/LessonList.CourseDetail";
import Members from "../Components/Members.CourseDetail";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<
    "overview" | "lessons" | "members"
  >("overview");
  const [course, setCourse] = useState<CourseData>({
    id: 0,
    title: "",
    description: "",
    status: "New",
    results: [],
    imageUrl: "",
    instructor: "",
    instructorAvatar: null,
    publicCourse: true,
  });

  const fetchCourse = async () => {
    const response = await getOneCourse(Number(courseId));
    if (response.success) {
      const coreService = import.meta.env.VITE_CORE_SERVICE;
      let data = response.data!;
      if (response.data?.imageUrl) {
        data.imageUrl = `${coreService}/${response.data.imageUrl}`;
      }
      setCourse(data);
    } else alert(response.message);
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen py-10 mt-25">
        <div className="w-[80%] bg-white rounded-2xl shadow-xl p-8">
          {/* NAVBAR TABS */}
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === "overview"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setActiveTab("lessons")}
              className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === "lessons"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Lessons
            </button>

            <button
              onClick={() => setActiveTab("members")}
              className={`px-6 py-3 text-sm font-medium transition cursor-pointer ${
                activeTab === "members"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Members
            </button>
          </div>

          {/* CONTENT */}
          <div>
            {activeTab === "overview" && <Overview course={course} />}
            {activeTab === "lessons" && <LessonList courseId={courseId!} />}
            {activeTab === "members" && <Members courseId={courseId!} />}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
