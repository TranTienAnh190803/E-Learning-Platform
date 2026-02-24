import { useNavigate, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import type { LessonData, LessonListData } from "../Types/Lesson.type";
import { getAllLesson, getLesson } from "../Services/CoreService/LessonApi";
import {
  getCompletedLesson,
  updateProcess,
} from "../Services/CoreService/EnrollmentApi";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [currentLesson, setCurrentLesson] = useState<LessonData>({
    id: -1,
    title: "",
    addedDate: null,
    lessonType: "STUDY",
    content: "",
    contentUrl: null,
  });
  const [lessonList, setLessonList] = useState<LessonListData[]>([]);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const fetchCurrentLesson = async () => {
    const response = await getLesson(Number(lessonId));
    if (response.success) {
      const coreService = import.meta.env.VITE_CORE_SERVICE;
      const data = response.data!;
      setCurrentLesson({
        id: data.id,
        title: data.title,
        addedDate: data.addedDate,
        lessonType: data.lessonType,
        content: data.content,
        contentUrl: data.contentUrl
          ? `${coreService}/${data.contentUrl}`
          : null,
      });
    } else {
      alert(response.message);
    }
  };

  const fetchLessons = async () => {
    const response = await getAllLesson(Number(courseId));
    if (response.success) setLessonList(response.data!);
    else alert(response.message);
  };

  const fetchCompletedLessons = async () => {
    const response = await getCompletedLesson(Number(courseId));
    if (response.success) setCompletedLessons(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    fetchCurrentLesson();
    fetchLessons();
    fetchCompletedLessons();
  }, []);

  const handleLessonClick = (lessonId: number) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
    window.location.reload();
  };

  const handleUpdateProcess = async () => {
    const response = await updateProcess(Number(courseId), Number(lessonId));
    alert(response.message);
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen mt-25">
        {/* LEFT CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">
                {currentLesson.title}
              </h1>
              <button
                className="px-3 py-1 rounded-xl bg-green-700 text-white hover:bg-green-300 hover:text-black cursor-pointer"
                onClick={() => {
                  handleUpdateProcess();
                }}
              >
                Completed
              </button>
            </div>

            {/* VIDEO */}
            {currentLesson.contentUrl && (
              <div className="space-y-4">
                <video
                  src={currentLesson.contentUrl}
                  controls
                  className="w-full rounded-xl aspect-video"
                />

                {currentLesson.content && (
                  <div className="text-gray-700 whitespace-pre-line">
                    {currentLesson.content}
                  </div>
                )}
              </div>
            )}

            {/* TEXT */}
            {!currentLesson.contentUrl && (
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {currentLesson.content}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Course Content</h2>
          </div>

          <div className="p-4 space-y-2">
            {lessonList.map((lesson, index) => {
              const isActive = lesson.id === currentLesson.id;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition text-sm
            ${
              isActive
                ? "bg-blue-100 text-blue-700 font-medium"
                : isCompleted
                  ? "bg-green-50 text-green-700"
                  : "hover:bg-gray-100 text-gray-700"
            }`}
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">
                    {/* Status Icon */}
                    <div
                      className={`w-5 h-5 flex items-center justify-center rounded-full border text-xs
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-400 text-gray-400"
                }`}
                    >
                      {isCompleted ? "✔" : ""}
                    </div>

                    {/* Title */}
                    <span>
                      {index + 1}. {lesson.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
