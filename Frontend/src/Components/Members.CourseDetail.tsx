import { useEffect, useState } from "react";
import type { CourseMemberData } from "../Types/Course.type";
import {
  getCourseMemeber,
  kickMember,
} from "../Services/CoreService/CourseApi";
import { IoClose } from "react-icons/io5";

interface Props {
  courseId: string;
}

export default function Members({ courseId }: Props) {
  const [members, setMembers] = useState<CourseMemberData[]>([]);

  const fetchCourseMember = async () => {
    const response = await getCourseMemeber(Number(courseId));
    if (response.success) {
      const coreService = import.meta.env.VITE_CORE_SERVICE;
      const data: CourseMemberData[] = response.data!.map((value) => {
        return {
          studentId: value.studentId,
          fullName: value.fullName,
          email: value.email,
          avatarUrl: value.avatarUrl
            ? `${coreService}/${value.avatarUrl}`
            : `/assets/User.jpg`,
        };
      });
      setMembers(data);
    } else alert(response.message);
  };

  useEffect(() => {
    fetchCourseMember();
  }, []);

  const handleRemoveMember = async (studentId: number) => {
    if (confirm("Are you sure you want to REMOVE this member.")) {
      const response = await kickMember(Number(courseId), studentId);
      alert(response.message);
      if (response.success) {
        fetchCourseMember();
      }
    }
  };

  return (
    <div className="space-y-4 px-6">
      <h2 className="text-2xl font-bold mb-10">
        Course Members ({members.length})
      </h2>

      {members.map((member) => (
        <div
          key={member.studentId}
          className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={member.avatarUrl}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{member.fullName}</p>
                <p className="text-sm text-gray-400">{member.email}</p>
              </div>
            </div>
          </div>
          <button
            className="flex items-center justify-center font-bold rounded-full w-10 h-10 bg-red-700 text-white hover:bg-gray-500 hover:text-black cursor-pointer"
            onClick={() => {
              handleRemoveMember(member.studentId);
            }}
          >
            {" "}
            <IoClose />
          </button>
        </div>
      ))}

      {members.length === 0 && (
        <p className="text-gray-400">No students enrolled yet.</p>
      )}
    </div>
  );
}
