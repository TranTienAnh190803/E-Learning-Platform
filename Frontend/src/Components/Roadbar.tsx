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

  const { phase, setPhase } = context;

  return (
    <div className="min-h-screen bg-gray-100 p-20">
      <h1 className="text-3xl font-bold text-center mb-8">Course Adding</h1>
      <div className="relative max-w-md mx-auto">
        {/* vertical line */}
        <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-300"></div>

        {phase.map((item, index) => (
          <div key={index} className="relative pl-10 mb-6 flex items-center">
            {/* dot */}
            <div
              className={`absolute left-0 w-6 h-6 rounded-full border-4 border-white ${statusColor[item.status]}`}
            />

            {/* title only */}
            <span className="text-sm font-medium text-gray-800">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
