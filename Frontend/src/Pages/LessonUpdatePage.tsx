import React, { useEffect, useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import type { LessonType } from "../Types/Course.type";
import type { LessonForm } from "../Types/Lesson.type";
import { getLesson, updateLesson } from "../Services/CoreService/LessonApi";
import { useNavigate, useParams } from "react-router-dom";
import { objectToFormData } from "../Helper/Converter";

export function LessonUpdatePage() {
  const navigate = useNavigate();
  const { lessonId, courseId } = useParams();
  const [form, setForm] = useState<LessonForm>({
    title: "",
    content: "",
    lessonType: "STUDY",
    videoFile: null,
  });
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const fetchLesson = async () => {
    const response = await getLesson(Number(lessonId));
    if (response.success) {
      const data = response.data!;
      setForm({
        title: data.title,
        content: data.content,
        lessonType: data.lessonType,
        videoFile: null,
      });

      if (data.lessonType === "STUDY") {
        const coreService = import.meta.env.VITE_CORE_SERVICE;
        setVideoPreview(`${coreService}/${data.contentUrl}`);
      }
    } else {
      alert(response.message);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, []);

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

    if (file) {
      setForm({ ...form, videoFile: file });
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: FormData = objectToFormData(form);
    const response = await updateLesson(formData, Number(lessonId));
    alert(response.message);
    if (response.success) {
      navigate(`/course-detail/${courseId}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center min-h-screen py-12 mt-25">
        <form
          onSubmit={handleSubmit}
          className="w-[75%] bg-white p-10 rounded-2xl shadow-xl space-y-8"
        >
          <h2 className="text-5xl font-bold text-gray-800">Update Lesson</h2>

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">Lesson Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
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

          {/* TEXT CONTENT */}
          <div>
            <label className="block mb-2 font-medium">Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={6}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* VIDEO CONTENT */}
          {form.lessonType === "STUDY" && (
            <div className="space-y-4">
              <label className="block font-medium">Video</label>

              {/* Current / Preview Video */}
              {videoPreview && (
                // <iframe src={videoPreview}></iframe>
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-xl border aspect-video"
                />
              )}

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hover:text-blue-500 cursor-pointer"
              />

              {form.videoFile && (
                <p className="text-sm text-gray-600">
                  New file selected: <strong>{form.videoFile.name}</strong>
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Update Lesson
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
}
