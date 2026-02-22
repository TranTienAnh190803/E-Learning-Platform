import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { CourseForm } from "../Types/Course.type";
import { getOneCourse, updateCourse } from "../Services/CoreService/CourseApi";
import { objectToFormData } from "../Helper/Converter";

export default function CourseUpdatePage() {
  const { courseId } = useParams();
  const imgRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [courseForm, setCourseForm] = useState<CourseForm>({
    title: "",
    description: "",
    results: [""],
    image: null,
    publicCourse: true,
    password: "",
  });
  const [preview, setPreview] = useState<string>("/assets/DefaultCourse.jpg");

  const fetchCourse = async () => {
    const response = await getOneCourse(Number(courseId));
    if (response.success) {
      const data = response.data!;
      setCourseForm({
        ...courseForm,
        title: data.title,
        description: data.description,
        results: data.results,
        publicCourse: data.publicCourse,
      });
      if (data.imageUrl) {
        const coreService = import.meta.env.VITE_CORE_SERVICE;
        setPreview(`${coreService}/${data.imageUrl}`);
      }
    } else {
      alert(response.message);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setCourseForm({ ...courseForm, [name]: checked });
    } else {
      setCourseForm({ ...courseForm, [name]: value });
    }
  };

  const handleResultChange = (index: number, value: string) => {
    const updated = [...courseForm.results];
    updated[index] = value;
    setCourseForm({ ...courseForm, results: updated });
  };

  const addResult = () => {
    setCourseForm({ ...courseForm, results: [...courseForm.results, ""] });
  };

  const removeResult = (index: number) => {
    const updated = courseForm.results.filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, results: updated });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCourseForm({ ...courseForm, image: file });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = objectToFormData(courseForm);
    const response = await updateCourse(Number(courseId), formData);
    alert(response.message);
    if (response.success) {
      navigate("/my-course");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center py-10 mt-25 min-h-screen">
        <form
          className="w-[75%] bg-white shadow-xl rounded-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-5xl font-bold mb-10">Update Course</h2>

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={courseForm.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              rows={4}
              value={courseForm.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Results */}
          <div>
            <label className="block mb-2 font-medium">Learning Results</label>
            {courseForm.results.map((result, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={result}
                  onChange={(e) => handleResultChange(index, e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeResult(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addResult}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              + Add Result
            </button>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Course Image</label>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={imgRef}
              onChange={handleImageChange}
            />
            <img
              src={preview}
              alt="preview"
              className="mt-3 h-40 rounded-lg object-cover border cursor-pointer"
              onClick={() => {
                imgRef.current!.click();
              }}
            />
          </div>

          {/* Public Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="publicCourse"
              checked={courseForm.publicCourse}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label className="font-medium">Public Course</label>
          </div>

          {/* Password (conditional) */}
          {!courseForm.publicCourse && (
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={courseForm.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition cursor-pointer"
            >
              Update Course
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
