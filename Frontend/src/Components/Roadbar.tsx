import React, { useContext } from "react";
import { CourseAddingContext } from "../Pages/CourseAddingPage";

const statusColor = {
  done: "bg-green-500",
  "in-progress": "bg-yellow-500",
  pending: "bg-gray-400",
};

export default function Roadbar() {
  const context = useContext(CourseAddingContext);

  if (!context) {
    throw new Error("Roadmap must be used within Context");
  }

  const { phase } = context;

  return (
    <div className="min-h-screen w-1/4 bg-white p-20 border-r-2 border-gray-200">
      <div className="relative max-w-md mx-auto">
        {/* vertical line */}
        <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-300"></div>

        {phase.map((item, index) => (
          <div key={index} className="relative pl-10 mb-15 flex items-center">
            {/* dot */}
            <div
              className={`absolute left-0 w-7 h-7 rounded-full border-4 border-gray-200 ${statusColor[item.status]}`}
            />

            {/* title only */}
            <span className="text-lg ml-3 font-medium text-gray-800">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
