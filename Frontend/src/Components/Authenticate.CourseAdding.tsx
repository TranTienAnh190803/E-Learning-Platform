import React, { useContext } from "react";
import { CourseAddingContext } from "../Pages/CourseAddingPage";

export default function CourseAuthentication() {
  const context = useContext(CourseAddingContext);

  if (!context) {
    throw new Error("Must be used within Context");
  }

  // Context
  const { courseForm, setCourseForm, handleBackButton, handleNextButton } =
    context;

  // Handler
  const handleInputCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setCourseForm((prev) => ({
      ...prev,
      publicCourse: checked,
      password: checked ? "" : prev.password,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCourseForm({ ...courseForm, password: value });
  };

  return (
    <form
      className="min-h-[455px] flex flex-col justify-between"
      onSubmit={handleNextButton}
    >
      {/* Checkbox */}
      <div className="mt-10">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={courseForm.publicCourse}
            onChange={handleInputCheck}
            className="w-5 h-5"
          />
          <span className="text-sm font-medium">Public Course</span>
        </label>
        <p className="text-sm text-gray-500 mt-2 mb-10">
          ( By unchecked, this course will be private and require a password to
          access. )
        </p>

        {/* Password (ẩn khi public) */}
        {!courseForm.publicCourse && (
          <div>
            <label className="block text-sm font-medium mb-3">
              Course Password
            </label>
            <input
              type="text"
              value={courseForm.password}
              onChange={handleInputChange}
              placeholder="Enter course password..."
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          className="border border-blue-600 text-blue-600 py-3 px-7 rounded-xl font-medium hover:bg-blue-100 transition cursor-pointer"
          onClick={handleBackButton}
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-7 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </form>
  );
}
