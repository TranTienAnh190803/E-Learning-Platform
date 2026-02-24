import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CourseData, CourseStatus } from "../Types/Course.type";
import type { LessonListData } from "../Types/Lesson.type";
import { getOneCourse } from "../Services/CoreService/CourseApi";
import { getAllLesson } from "../Services/CoreService/LessonApi";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useAuthStore } from "../Hooks/AuthStore";
import { isInstructor } from "../Helper/CheckRole";
import { enrollCourse } from "../Services/CoreService/EnrollmentApi";
import PasswordPopup from "../Components/PasswordPopup";

export default function CoursePreviewPage() {
  const { courseId } = useParams();

  // Global state
  const courses = useAuthStore((s) => s.course);
  const auth = useAuthStore((s) => s.auth);

  // Local State
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData>({
    id: -1,
    title: "",
    description: "",
    status: "New",
    results: [],
    imageUrl: null,
    instructor: "",
    instructorAvatar: null,
    publicCourse: false,
  });
  const [lessons, setLessons] = useState<LessonListData[]>([]);
  const [password, setPassword] = useState<string>("");
  const [popup, setPopup] = useState<boolean>(false);

  const fetchCourse = async () => {
    const response = await getOneCourse(Number(courseId));
    if (response.success) {
      const coreService = import.meta.env.VITE_CORE_SERVICE;
      const data = response.data!;
      setCourse({
        id: data.id,
        title: data.title,
        description: data.description,
        status: data.status,
        results: data.results,
        imageUrl: data.imageUrl ? `${coreService}/${data.imageUrl}` : null,
        instructor: data.instructor,
        instructorAvatar: data.instructorAvatar
          ? `${coreService}/${data.instructorAvatar}`
          : null,
        publicCourse: data.publicCourse,
      });
    } else alert(response.message);
  };

  const fetchLessons = async () => {
    const response = await getAllLesson(Number(courseId));
    if (response.success) setLessons(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    fetchCourse();
    fetchLessons();
  }, []);

  const handleEnroll = async () => {
    if (!course.publicCourse) {
      setPopup(true);
    } else {
      const response = await enrollCourse(Number(courseId), password);
      alert(response.message);
      if (response.success) {
        // navigate("");
        window.location.reload();
      }
    }
  };

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Update":
        return "bg-yellow-100 text-yellow-700";
      case "Complete":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center bg-gray-100 min-h-screen py-10 mt-25">
        <div className="w-[80%] grid grid-cols-3 gap-10">
          {/* LEFT CONTENT */}
          <div className="col-span-2 space-y-8">
            {/* HERO */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src={
                  course.imageUrl
                    ? course.imageUrl
                    : "/assets/DefaultCourse.jpg"
                }
                alt={course.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-6 space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {course.title}
                </h1>

                <div className="flex items-center gap-4">
                  <img
                    src={
                      course.instructorAvatar
                        ? course.instructorAvatar
                        : "/assets/User.jpg"
                    }
                    alt="instructor"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-gray-700 font-medium">
                    {course.instructor}
                  </span>

                  <span
                    className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(
                      course.status,
                    )}`}
                  >
                    {course.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-gray-600">{course.description}</p>
              </div>
            </div>

            {/* LESSON LIST */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Course Content ({lessons.length} lessons)
              </h2>

              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex justify-between items-center border-b pb-2 text-sm"
                  >
                    <span>
                      {index + 1}. {lesson.title}
                    </span>
                    <span className="text-gray-400">
                      {new Date(lesson.addedDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}

                {lessons.length === 0 && (
                  <div className="text-gray-400 text-sm">
                    No lessons available yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-30 space-y-6">
              {/* Visibility */}
              <div>
                <p className="text-gray-500 text-sm">Visibility</p>
                <p className="font-medium">
                  {course.publicCourse ? "Public Course" : "Private Course"}
                </p>
              </div>

              {/* Learning Outcomes */}
              <div>
                <h2 className="text-lg font-semibold mb-3">
                  What you will learn
                </h2>

                <ul className="space-y-2 text-sm text-gray-700">
                  {course.results.map((result, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500">✔</span>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enroll Button */}
              {(auth.status === "authenticated" &&
                isInstructor(auth.user.role)) || (
                <button
                  onClick={() => handleEnroll()}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
                >
                  Enroll Now
                </button>
              )}

              <div className="text-xs text-gray-400 text-center">
                Full lifetime access
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {!course.publicCourse && popup && (
        <PasswordPopup
          setPassword={setPassword}
          setPopup={setPopup}
          courseId={Number(courseId)}
          password={password}
        />
      )}
    </>
  );
}
