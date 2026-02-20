import React, { createContext, useState, type SetStateAction } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Roadbar from "../Components/Roadbar";
import type { CourseAddingForm } from "../Types/Course.type";
import BasicPhase from "../Components/BasicPhase.CourseAdding";

export interface Phase {
  title:
    | "Basic"
    | "Authenticate"
    | "Image (Optional)"
    | "First Lesson"
    | "Lesson Content"
    | "Video (Optional)";
  status: "done" | "in-progress" | "pending";
}
export type CourseAddingContextType = {
  phase: Phase[];
  setPhase: React.Dispatch<SetStateAction<Phase[]>>;
  phaseNumber: number;
  setPhaseNumber: React.Dispatch<SetStateAction<number>>;
  courseForm: CourseAddingForm;
  setCourseForm: React.Dispatch<SetStateAction<CourseAddingForm>>;
};

export const CourseAddingContext = createContext<
  CourseAddingContextType | undefined
>(undefined);

export default function CourseAddingPage() {
  const [phase, setPhase] = useState<Phase[]>([
    {
      title: "Basic",
      status: "in-progress",
    },
    {
      title: "Authenticate",
      status: "pending",
    },
    {
      title: "Image (Optional)",
      status: "pending",
    },
    {
      title: "First Lesson",
      status: "pending",
    },
    {
      title: "Lesson Content",
      status: "pending",
    },
    {
      title: "Video (Optional)",
      status: "pending",
    },
  ]);
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

  return (
    <>
      <Navbar />
      <CourseAddingContext.Provider
        value={{
          phase,
          setPhase,
          phaseNumber,
          setPhaseNumber,
          courseForm,
          setCourseForm,
        }}
      >
        <div className="min-h-screen mt-25 flex">
          <Roadbar />
          <div className="w-3/4 bg-white py-20 px-10">
            <h1 className="text-4xl font-bold">Course Adding</h1>
            {phaseNumber === 0 && <BasicPhase />}
          </div>
        </div>
      </CourseAddingContext.Provider>
      <Footer />
    </>
  );
}
