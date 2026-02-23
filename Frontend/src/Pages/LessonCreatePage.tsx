import React, { useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import type { LessonType } from "../Types/Course.type";
import type { LessonForm } from "../Types/Lesson.type";
import { useNavigate, useParams } from "react-router-dom";
import { addLesson } from "../Services/CoreService/LessonApi";
import { objectToFormData } from "../Helper/Converter";

export default function LessonCreatePage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [form, setForm] = useState<LessonForm>({
    title: "",
    lessonType: "STUDY",
    content: "",
    videoFile: null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, videoFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: FormData = objectToFormData(form);
    const response = await addLesson(formData, Number(courseId));
    alert(response.message);
    if (response.success) {
      navigate(`/course-detail/${courseId}`);
    }
  };

  return (
    <>
      <Navbar />{" "}
      <div className="flex justify-center min-h-screen py-12 mt-25">
        <form
          onSubmit={handleSubmit}
          className="w-[75%] bg-white p-10 rounded-2xl shadow-xl space-y-8"
        >
          <h2 className="text-5xl font-bold text-gray-800">
            Create New Lesson
          </h2>

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">Lesson Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Enter lesson title..."
            />
          </div>

          {/* Lesson Type */}
          <div>
            <label className="block mb-2 font-medium">Lesson Type</label>
            <select
              name="lessonType"
              value={form.lessonType}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value={"STUDY" as LessonType}>Video Lesson</option>
              <option value={"WORK" as LessonType}>Text Lesson</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={6}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Write lesson content..."
            />
          </div>

          {/* Video Upload */}
          {form.lessonType === "STUDY" && (
            <div>
              <label className="block mb-2 font-medium">Upload Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="block cursor-pointer hover:text-blue-500"
                required={
                  form.lessonType === "STUDY" && form.videoFile === null
                }
              />

              {form.videoFile && (
                <div className="mt-3 text-sm text-gray-600">
                  Selected file: <strong>{form.videoFile.name}</strong>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition cursor-pointer"
            >
              Create Lesson
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
