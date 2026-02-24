import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import type { CourseData } from "../Types/Course.type";
import type { LessonListData } from "../Types/Lesson.type";
import {
  completeUpdateCourse,
  getOneCourse,
} from "../Services/CoreService/CourseApi";
import { deleteLesson, getAllLesson } from "../Services/CoreService/LessonApi";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
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
  const [lessons, setLessons] = useState<LessonListData[]>([]);

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

  const fetchLessons = async () => {
    const response = await getAllLesson(Number(courseId));
    if (response.success) setLessons(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    fetchCourse();
    fetchLessons();
  }, []);

  const handleDeleteCourse = async (lessonId: number) => {
    if (confirm("Are you sure you want to DELETE this lesson.")) {
      const response = await deleteLesson(lessonId);
      alert(response.message);
      if (response.success) window.location.reload();
    }
  };

  const handleCompleteCourse = async () => {
    const response = await completeUpdateCourse(Number(courseId));
    alert(response.message);
    if (response.success) {
      window.location.reload();
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen py-10 mt-25">
        <div className="w-[80%] space-y-8">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {course.title}
              </h1>
              <span
                className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                  course.status === "Complete"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {course.status}
              </span>
            </div>

            <span
              className={`px-4 py-2 rounded-xl text-sm font-medium ${
                course.publicCourse
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {course.publicCourse ? "Public" : "Private"}
            </span>
          </div>

          {/* Content */}
          <div className="grid grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="col-span-1 bg-white p-6 rounded-2xl shadow-md space-y-5">
              <img
                src={
                  course.imageUrl
                    ? course.imageUrl
                    : "/assets/DefaultCourse.jpg"
                }
                alt="course"
                className="rounded-xl h-48 w-full object-cover"
              />

              <div>
                <h2 className="font-semibold text-lg mb-2">Description</h2>
                <p className="text-gray-600 text-sm">{course.description}</p>
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-2">Learning Results</h2>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {course.results.map((result, index) => (
                    <li key={index}>{result}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Lesson List */}
            <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold">
                    Lessons ({lessons.length})
                  </h2>
                  <button
                    onClick={() => {
                      navigate(`add-lesson`);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                  >
                    + Create Lesson
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-2">Title</th>
                        <th className="text-left py-3 px-2">Added Date</th>
                        <th className="text-center py-3 px-2">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {lessons.map((lesson, index) => (
                        <tr
                          key={lesson.id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-3! px-2! font-medium">
                            {index + 1}. {lesson.title}
                          </td>
                          <td className="py-3! px-2! text-gray-500">
                            {new Date(lesson.addedDate!).toLocaleString()}
                          </td>
                          <td className="py-3! px-2! text-center space-x-2">
                            <button
                              onClick={() => {
                                navigate(`update-lesson/${lesson.id}`);
                              }}
                              className="px-3 py-1 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 cursor-pointer"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                handleDeleteCourse(lesson.id);
                              }}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}

                      {lessons.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center py-6 text-gray-400"
                          >
                            No lessons yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {lessons.length > 0 && (
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                    onClick={() => {
                      handleCompleteCourse();
                    }}
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
