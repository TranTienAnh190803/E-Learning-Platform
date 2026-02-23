import { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import type { ProcessTracking } from "../Types/Enrollment.type";
import { getEnrolledCourse } from "../Services/CoreService/EnrollmentApi";
import { dateTimeFormat } from "../Helper/Converter";

export default function ProcessTrackingPage() {
  const [enrollments, setEnrollments] = useState<ProcessTracking[]>([]);

  const fetchProcess = async () => {
    const response = await getEnrolledCourse();
    if (response.success) {
      const data: ProcessTracking[] = response.data!.map((value) => {
        let image: string | null = null;
        if (value.imageUrl) {
          const coreService = import.meta.env.VITE_CORE_SERVICE;
          image = `${coreService}/${value.imageUrl}`;
        }

        return {
          id: value.id,
          title: value.title,
          imageUrl: image,
          completedStatus: value.completedStatus,
          enrollAt: value.enrollAt,
        };
      });
      setEnrollments(data);
    } else {
      alert(response.message);
    }
  };

  useEffect(() => {
    fetchProcess();
  }, []);

  const getStatusLabel = (percent: number) => {
    if (percent === 0) return "Not Started";
    if (percent === 100) return "Completed";
    return "In Progress";
  };

  const getStatusColor = (percent: number) => {
    if (percent === 0) return "bg-gray-400";
    if (percent === 100) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen py-10 mt-30">
        <div className="w-[85%] space-y-8 ">
          <h1 className="text-5xl font-bold text-gray-800 mb-20">
            My Learning Progress
          </h1>

          {enrollments.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              You haven't enrolled in any courses yet.
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              >
                {/* Image */}
                <img
                  src={
                    course.imageUrl
                      ? course.imageUrl
                      : "/assets/DefaultCourse.jpg"
                  }
                  alt={course.title}
                  className="h-40 w-full object-cover"
                />

                <div className="p-5 space-y-4">
                  {/* Title */}
                  <h2 className="text-lg font-semibold text-gray-800">
                    {course.title}
                  </h2>

                  {/* Enroll Date */}
                  <p className="text-sm text-gray-500">
                    Enrolled at: {dateTimeFormat(course.enrollAt!)}
                  </p>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{getStatusLabel(course.completedStatus)}</span>
                      <span>{course.completedStatus}%</span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${getStatusColor(
                          course.completedStatus,
                        )}`}
                        style={{ width: `${course.completedStatus}%` }}
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
