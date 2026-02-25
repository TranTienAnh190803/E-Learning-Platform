import { isInstructor, isStudent } from "../Helper/CheckRole";
import { useAuthStore } from "../Hooks/AuthStore";
import type { CourseData } from "../Types/Course.type";
import { useNavigate } from "react-router-dom";

interface props {
  course: CourseData;
  isProfilePage?: boolean;
}

const coreService = import.meta.env.VITE_CORE_SERVICE;

export default function Card({ course, isProfilePage }: props) {
  const navigate = useNavigate();

  const courses = useAuthStore((s) => s.course);
  const auth = useAuthStore((s) => s.auth);

  const handleClick = () => {
    if (isProfilePage) {
      if (auth.status === "authenticated" && isInstructor(auth.user.role)) {
        // navigate(`/lesson/${course.id}`);
        // window.location.reload();
      }
      if (auth.status === "authenticated" && isStudent(auth.user.role)) {
        navigate(`/student-course/${course.id}`);
        window.location.reload();
      }
    } else {
      if (courses.includes(course.id)) {
        navigate(`/student-course/${course.id}`);
        window.location.reload();
      } else {
        navigate(`/course-preview/${course.id}`);
        window.location.reload();
      }
    }
  };

  return (
    <div
      className="w-[30%] mb-20 rounded-3xl overflow-hidden cursor-pointer duration-300 ease-in-out hover:scale-110 bg-white flex flex-col"
      onClick={handleClick}
    >
      <div className="h-[200px] w-full">
        <img
          src={
            course.imageUrl
              ? `${coreService}/${course.imageUrl}`
              : "/assets/DefaultCourse.jpg"
          }
          className="block w-full h-full"
        />
      </div>

      <div
        className={`p-5 ${isProfilePage ? "bg-gray-100" : "bg-white"} flex-1`}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-2xl mr-3">{course.title}</h3>
          {course.status !== "Update" && (
            <p
              className={`${course.status === "Complete" ? "bg-green-600 text-white" : "bg-blue-300 text-black"} px-5 py-1 font-bold rounded-tl-2xl rounded-br-2xl`}
            >
              {course.status}
            </p>
          )}
        </div>
        <div className="flex items-center mt-5 mb-3">
          <div className="rounded-full overflow-hidden w-[10%] border border-gray-500">
            <img
              src={
                course.instructorAvatar
                  ? `${coreService}/${course.instructorAvatar}`
                  : "/assets/User.jpg"
              }
              className="w-full aspect-square"
            />
          </div>
          <h3 className="text-lg font-light ml-3">{course.instructor}</h3>
        </div>
        <div className="flex justify-end mt-2">
          <p
            className={`font-bold ${course.publicCourse ? "text-green-500" : "text-red-600"}`}
          >
            {course.publicCourse ? "Public course" : "Private course"}
          </p>
        </div>
      </div>
    </div>
  );
}
