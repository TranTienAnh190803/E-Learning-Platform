import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { isInstructor } from "../Helper/CheckRole";
import { useEffect, useState } from "react";
import type { CourseData } from "../Types/Course.type";
import type { EnrollmentData } from "../Types/Enrollment.type";
import { getOwnedCourse } from "../Services/CoreService/CourseApi";
import { getEnrolledCourse } from "../Services/CoreService/EnrollmentApi";
import Card from "./Card";

export default function CourseList() {
  const navigate = useNavigate();
  // Global State
  const auth = useAuthStore((s) => s.auth);

  if (auth.status !== "authenticated") {
    navigate("/login");
    return;
  }

  // Local State
  const [courseList, setCourseList] = useState<CourseData[] | EnrollmentData[]>(
    [],
  );

  const fetchCourseList = async () => {
    if (isInstructor(auth.user.role)) {
      const response = await getOwnedCourse();
      if (response.success) setCourseList(response.data!);
      else alert(response.message);
    } else {
      const response = await getEnrolledCourse();
      if (response.success) setCourseList(response.data!);
      else alert(response.message);
    }
  };

  useEffect(() => {
    fetchCourseList();
  }, []);

  return (
    <div className="w-3/4 bg-white py-20 px-10">
      <h1 className="text-5xl font-bold">
        {isInstructor(auth.user.role) ? "My courses" : "Enrolled courses"}
      </h1>
      <hr className="my-8" />
      <div className="flex gap-[5%] flex-wrap mt-10">
        {courseList.map((value) => {
          return <Card course={value} key={value.id} isProfilePage={true} />;
        })}
      </div>
    </div>
  );
}
