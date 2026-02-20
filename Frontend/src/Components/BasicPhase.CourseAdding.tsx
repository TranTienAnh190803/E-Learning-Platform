import React, { useContext, useState } from "react";
import { CourseAddingContext } from "../Pages/CourseAddingPage";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function BasicPhase() {
  const context = useContext(CourseAddingContext);

  if (!context) {
    throw new Error("Must be used within Context");
  }

  // Context
  const { courseForm, setCourseForm, handleNextButton } = context;

  // State
  const [resultCount, setResultCount] = useState<number>(
    courseForm.results.length,
  );

  // Handler
  const handleIncreaseResult = () => {
    const newResult = courseForm.results;
    newResult.push("");

    setResultCount((prev) => prev + 1);
    setCourseForm({ ...courseForm, results: newResult });
  };

  const handleDecreaseResult = () => {
    const newResult = courseForm.results;
    newResult.pop();

    setResultCount((prev) => prev - 1);
    setCourseForm({ ...courseForm, results: newResult });
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setCourseForm({ ...courseForm, [name]: value });
  };

  const handleInputResult = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newResult = courseForm.results;
    newResult[index] = e.target.value;
    setCourseForm({ ...courseForm, results: newResult });
  };

  return (
    <div className="min-h-[455px]">
      <form className="space-y-7" onSubmit={handleNextButton}>
        {/* Title */}
        <div className="mt-10">
          <label className="block text-sm font-medium mb-3">Course Title</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter course title..."
            name="title"
            value={courseForm.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-3">Description</label>
          <textarea
            rows={5}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter description..."
            name="description"
            value={courseForm.description}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Result count */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Number of Results
          </label>
          <div className="flex">
            <button
              className={`px-3 py-2 rounded-xl ${resultCount === 0 ? "bg-red-200 text-white" : "bg-red-500 text-white font-bold hover:bg-red-200 hover:text-black cursor-pointer"}`}
              disabled={resultCount === 0}
              type="button"
              onClick={handleDecreaseResult}
            >
              <FaMinus />
            </button>
            <input
              type="number"
              min={0}
              max={6}
              value={resultCount}
              className="mx-3 w-32 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly
            />
            <button
              className={`px-3 py-2 font-bold rounded-xl ${resultCount === 6 ? "bg-green-200 text-white" : "bg-green-500 text-white cursor-pointer hover:bg-green-200 hover:text-black"}`}
              disabled={resultCount === 6}
              type="button"
              onClick={handleIncreaseResult}
            >
              <FaPlus />
            </button>
          </div>
        </div>

        {/* Dynamic results */}
        {courseForm.results.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">
              Learning Results
            </label>

            {courseForm.results.map((result, index) => (
              <input
                key={index}
                type="text"
                value={result}
                placeholder={`Result ${index + 1}`}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleInputResult(e, index)}
                required
              />
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="text-end">
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 px-7 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
