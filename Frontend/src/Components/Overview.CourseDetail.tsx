import type { CourseData } from "../Types/Course.type";

interface Props {
  course: CourseData;
}

export default function Overview({ course }: Props) {
  return (
    <div className="space-y-6">
      <img
        src={course.imageUrl ? course.imageUrl : "/assets/DefaultCourse.jpg"}
        alt={course.title}
        className="w-full h-64 object-cover rounded-2xl"
      />

      <div>
        <h2 className="text-2xl font-bold">{course.title}</h2>

        <div className="flex items-center gap-3 mt-3">
          <img
            src={
              course.instructorAvatar
                ? course.instructorAvatar
                : "/assets/User.jpg"
            }
            className="w-8 h-8 rounded-full"
          />
          <span>{course.instructor}</span>

          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            {course.status.toUpperCase()}
          </span>
        </div>

        <p className="mt-4 text-gray-600">{course.description}</p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Learning Outcomes</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {course.results.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
