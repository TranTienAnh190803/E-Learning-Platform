import { useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { CourseAddingContext } from "../Pages/CourseAddingPage";

type Props = {
  video: string | null;
  setVideo: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function VideoInput({ video, setVideo }: Props) {
  const context = useContext(CourseAddingContext);

  if (!context) {
    throw new Error("Must be used within Context");
  }

  const { courseForm, setCourseForm, handleBackButton, handleNextButton } =
    context;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Tạo Object URL trực tiếp từ File - KHÔNG cần gọi server
        const videoURL = URL.createObjectURL(file);
        setVideo(videoURL);

        setCourseForm({
          ...courseForm,
          videoFile: file,
        });
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

  return (
    <form className="min-h-[455px]" onSubmit={handleNextButton}>
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
          Next
        </button>
      </div>
    </form>
  );
}
