import React, { useContext } from "react";
import type { LessonType } from "../Types/Course.type";
import { CourseAddingContext } from "../Pages/CourseAddingPage";

export default function FirstLesson() {
  const context = useContext(CourseAddingContext);
  if (!context) {
    throw new Error("Must be used within Context");
  }

  const { courseForm, setCourseForm, handleBackButton, handleNextButton } =
    context;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setCourseForm({ ...courseForm, [name]: value });
  };

  return (
    <form
      className="min-h-[455px] flex flex-col justify-between"
      onSubmit={handleNextButton}
    >
      <div className="mt-10">
        <div className="flex gap-[5%]">
          <div className="w-[65%]">
            <label className="block text-sm font-medium mb-1">
              Lesson Title
            </label>
            <input
              type="text"
              placeholder="Enter lesson title..."
              name="lessonTitle"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={courseForm.lessonTitle}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="w-[30%]">
            <label className="block text-sm font-medium mb-1">
              Lesson Type
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="lessonType"
              value={courseForm.lessonType}
              onChange={handleInputChange}
            >
              <option value={"STUDY" as LessonType}>Study</option>
              <option value={"WORK" as LessonType}>Work</option>
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Choose whether this lesson is theoretical (Study) or practical
              (Work).
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="my-5">
          <label className="block text-sm font-medium mb-1">
            Lesson Content
          </label>
          <textarea
            rows={10}
            placeholder="Enter lesson content..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="content"
            value={courseForm.content}
            onChange={handleInputChange}
            required
          />
        </div>
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
