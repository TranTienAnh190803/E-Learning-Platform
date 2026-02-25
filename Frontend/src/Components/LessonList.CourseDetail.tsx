import { useEffect, useState } from "react";
import type { LessonListData } from "../Types/Lesson.type";
import { deleteLesson, getAllLesson } from "../Services/CoreService/LessonApi";
import { completeUpdateCourse } from "../Services/CoreService/CourseApi";
import { useNavigate } from "react-router-dom";

interface Props {
  courseId: string;
}

export default function LessonList({ courseId }: Props) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<LessonListData[]>([]);

  const fetchLessons = async () => {
    const response = await getAllLesson(Number(courseId));
    if (response.success) setLessons(response.data!);
    else alert(response.message);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleDeleteLesson = async (lessonId: number) => {
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
    <div className="space-y-4">
      <div className="col-span-2 bg-white px-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Lessons ({lessons.length})</h2>
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
                          handleDeleteLesson(lesson.id);
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
                    <td colSpan={3} className="text-center py-6 text-gray-400">
                      No lessons yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {lessons.length > 0 && (
          <div className="flex justify-end mt-10">
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
  );
}
