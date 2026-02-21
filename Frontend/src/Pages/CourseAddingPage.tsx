import React, { createContext, useState, type SetStateAction } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Roadbar from "../Components/Roadbar";
import type { CourseAddingForm } from "../Types/Course.type";
import BasicPhase from "../Components/BasicPhase.CourseAdding";
import CourseAuthentication from "../Components/Authenticate.CourseAdding";
import ImageInput from "../Components/ImageInput.CourseAdding";
import FirstLesson from "../Components/FirstLesson.CourseAdding";
import VideoInput from "../Components/VideoInput.CourseAdding";

export type CourseAddingContextType = {
  phaseNumber: number;
  setPhaseNumber: React.Dispatch<SetStateAction<number>>;
  courseForm: CourseAddingForm;
  setCourseForm: React.Dispatch<SetStateAction<CourseAddingForm>>;
  handleBackButton(): void;
  handleNextButton(e: React.FormEvent): void;
};

export const CourseAddingContext = createContext<
  CourseAddingContextType | undefined
>(undefined);

export default function CourseAddingPage() {
  const [phaseNumber, setPhaseNumber] = useState<number>(0);

  const [courseForm, setCourseForm] = useState<CourseAddingForm>({
    title: "",
    description: "",
    publicCourse: false,
    password: "",
    image: null,
    results: [],
    lessonTitle: "",
    lessonType: "STUDY",
    content: "",
    videoFile: null,
  });

  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);

  const handleBackButton = () => {
    setPhaseNumber((prev) => prev - 1);
  };

  const handleNextButton = (e: React.FormEvent) => {
    e.preventDefault();
    setPhaseNumber((prev) => prev + 1);
  };

  return (
    <>
      <Navbar />
      <CourseAddingContext.Provider
        value={{
          phaseNumber,
          setPhaseNumber,
          courseForm,
          setCourseForm,
          handleBackButton,
          handleNextButton,
        }}
      >
        <div className="min-h-screen mt-25 flex">
          <Roadbar />
          <div className="w-3/4 bg-white py-20 px-10">
            <h1 className="text-4xl font-bold">Course Adding</h1>
            {phaseNumber === 0 && <BasicPhase />}
            {phaseNumber === 1 && <CourseAuthentication />}
            {phaseNumber === 2 && (
              <ImageInput image={image} setImage={setImage} />
            )}
            {phaseNumber === 3 && <FirstLesson />}
            {phaseNumber === 4 && (
              <VideoInput video={video} setVideo={setVideo} />
            )}
          </div>
        </div>
      </CourseAddingContext.Provider>
      <Footer />
    </>
  );
}
