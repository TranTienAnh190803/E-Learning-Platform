import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useEffect, useState } from "react";
import type { LessonListData } from "../Types/Lesson.type";
import { getAllLesson } from "../Services/CoreService/LessonApi";
import { getCompletedLesson, leaveCourse } from "../Services/CoreService/EnrollmentApi";

export default function StudentCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonListData[]>([]);
  const [completedLesson, setCompletedLesson] = useState<number[]>([]);

  const fetchLessons = async () => {
    const response = await getAllLesson(Number(courseId));
    if (response.success) setLessons(response.data!);
    else {
      alert(response.message);
      navigate("/");
    }
  };

  const fetchCompletedLesson = async () => {
    const response = await getCompletedLesson(Number(courseId));
    if (response.success) setCompletedLesson(response.data!);
    else {
      alert(response.message);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchCompletedLesson();
  }, []);

  const handleClick = (lessonId: number) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
    window.location.reload();
  };

  const handleLeaveCourse = async () => {
    if (confirm("Are you sure you want to leave this course?")) {
      const response = await leaveCourse(Number(courseId));
      alert(response.message);
      if (response.success)
        navigate("/")
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen py-10 mt-25">
        <div className="w-[70%] bg-white rounded-2xl shadow-md p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Course Lessons</h1>
            <button
              className="px-3 py-1 rounded-2xl border border-red-500 text-red-500 hover:border-white hover:bg-red-500 hover:text-white cursor-pointer"
              onClick={handleLeaveCourse}
            >
              Leave Course
            </button>
          </div>


          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLesson.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleClick(lesson.id)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition border
                  ${isCompleted
                      ? "bg-green-50 border-green-200 hover:bg-green-100"
                      : "bg-gray-50 hover:bg-gray-100"
                    }`}
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full border
                      ${isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-400 text-gray-400"
                        }`}
                    >
                      {isCompleted ? "✔" : ""}
                    </div>

                    {/* Title */}
                    <div>
                      <p
                        className={`font-medium ${isCompleted ? "text-green-700" : "text-gray-800"
                          }`}
                      >
                        {index + 1}. {lesson.title}
                      </p>

                      <p className="text-xs text-gray-400">
                        Added:{" "}
                        {new Date(lesson.addedDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Right Arrow */}
                  <span className="text-gray-400">→</span>
                </div>
              );
            })}

            {lessons.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No lessons available.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
