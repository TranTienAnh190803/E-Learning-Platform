import React, { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { CourseAddingContext } from "../Pages/CourseAddingPage";
import { addCourse } from "../Services/CoreService/CourseApi";
import { useNavigate } from "react-router-dom";
import { objectToFormData } from "../Helper/Converter";
import { readFile } from "../Services/CoreService/FileApi";

type Props = {
  video: string | null;
  setVideo: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function VideoInput({ video, setVideo }: Props) {
  const navigate = useNavigate();
  const context = useContext(CourseAddingContext);

  if (!context) {
    throw new Error("Must be used within Context");
  }

  const { courseForm, setCourseForm, handleBackButton } = context;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        const formData = new FormData();
        formData.set("file", file);
        const response = await readFile(formData);

        try {
          if (response instanceof Blob) {
            const videoURL = URL.createObjectURL(response);
            setVideo(videoURL);

            setCourseForm({
              ...courseForm,
              videoFile: file,
            });
          } else {
            alert(response.message);
          }
        } catch (error) {
          alert(error);
        }
      }
    },
    [courseForm, setCourseForm, setVideo],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
    multiple: false,
  });

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = objectToFormData(courseForm);
    const response = await addCourse(formData);
    alert(response.message);
    if (response.success) {
      navigate("/my-course");
    }
  };

  return (
    <form className="min-h-[455px]" onSubmit={handleFinish}>
      <div
        {...getRootProps()}
        className={`my-8 h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-blue-500 hover:text-blue-500 ${
          isDragActive ? "bg-blue-100 border-blue-500" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />

        {video ? (
          <div className="h-full w-full flex justify-center">
            <video
              controls
              className="block h-full max-w-full rounded-lg"
              onError={(e) => {
                console.log("Video error:", e);
                console.log("Video element:", e.currentTarget);
              }}
            >
              <source src={video} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ video
            </video>
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop Video Here</p>
        ) : (
          <p>Choose A Video</p>
        )}
      </div>

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
          Finish
        </button>
      </div>
    </form>
  );
}
