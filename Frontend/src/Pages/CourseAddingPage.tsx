import React, { createContext, useState, type SetStateAction } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Roadbar from "../Components/Roadbar";

export interface Phase {
  title: "basic" | "authenticate" | "image";
  status: "done" | "in-progress" | "pending";
}
export type CourseAddingContextType = {
  phase: Phase[];
  setPhase: React.Dispatch<SetStateAction<Phase[]>>;
};

export const CourseAddingContext = createContext<
  CourseAddingContextType | undefined
>(undefined);

export default function CourseAddingPage() {
  const [phase, setPhase] = useState<Phase[]>([
    {
      title: "basic",
      status: "in-progress",
    },
    {
      title: "authenticate",
      status: "pending",
    },
    {
      title: "image",
      status: "pending",
    },
  ]);

  return (
    <>
      <Navbar />
      <CourseAddingContext.Provider value={{ phase, setPhase }}>
        <div className="min-h-screen mt-25 flex">
          <Roadbar />
        </div>
      </CourseAddingContext.Provider>
      <Footer />
    </>
  );
}
