import type { CourseData } from "../Types/Course.type";

interface props {
  course: CourseData;
  fixedBackground?: boolean;
}

const coreService = import.meta.env.VITE_CORE_SERVICE;

export default function Card({ course, fixedBackground }: props) {
  return (
    <div className="w-[30%] mb-20 rounded-3xl overflow-hidden cursor-pointer duration-300 ease-in-out hover:scale-110 ">
      <img
        src={
          course.imageUrl
            ? `${coreService}/${course.imageUrl}`
            : "assets/DefaultCourse.jpg"
        }
      />
      <div className={`p-5 ${fixedBackground ? "bg-gray-100" : "bg-white"}`}>
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
                  : "assets/User.jpg"
              }
              className="w-full aspect-square"
            />
          </div>
          <h3 className="text-lg font-light ml-3">{course.instructor}</h3>
        </div>
        <div className="flex justify-end mt-2">
          <p
            className={`font-bold ${course.public ? "text-green-500" : "text-red-600"}`}
          >
            {course.public ? "Public course" : "Private course"}
          </p>
        </div>
      </div>
    </div>
  );
}
