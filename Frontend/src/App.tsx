import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { useEffect } from "react";
import { useAuthStore } from "./Hooks/AuthStore";
import RegistrationPage from "./Pages/RegistrationPage";
import PasswordRecoveryPage from "./Pages/PasswordRecoveryPage";
import { isInstructor, isStudent } from "./Helper/CheckRole";
import AccountPage from "./Pages/AccountPage";
import InstructorCoursePage from "./Pages/InstructorCoursePage";
import CourseAddingPage from "./Pages/CourseAddingPage";
import ProfilePage from "./Pages/ProfilePage";
import CourseUpdatePage from "./Pages/CourseUpdatePage";
import CourseDetailPage from "./Pages/CourseDetailPage";
import LessonCreatePage from "./Pages/LessonCreatePage";
import { LessonUpdatePage } from "./Pages/LessonUpdatePage";
import ProcessTrackingPage from "./Pages/ProcessTrackingPage";
import CoursePreviewPage from "./Pages/CoursePreviewPage";
import StudentCoursePage from "./Pages/StudentCoursePage";
import LessonPage from "./Pages/LessonPage";

function App() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const auth = useAuthStore((s) => s.auth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<PasswordRecoveryPage />} />

          {/* INSTRUCTOR PAGE */}
          {auth.status === "authenticated" && isInstructor(auth.user.role) && (
            <>
              <Route path="/my-course" element={<InstructorCoursePage />} />
              <Route
                path="/update-course/:courseId"
                element={<CourseUpdatePage />}
              />
              <Route
                path="/course-detail/:courseId"
                element={<CourseDetailPage />}
              />
              <Route
                path="/course-detail/:courseId/update-lesson/:lessonId"
                element={<LessonUpdatePage />}
              />
              <Route
                path="/course-detail/:courseId/add-lesson"
                element={<LessonCreatePage />}
              />
              <Route path="/add-course" element={<CourseAddingPage />} />
            </>
          )}

          {/* STUDENT PAGE */}
          {auth.status === "authenticated" && isStudent(auth.user.role) && (
            <>
              <Route
                path="/process-tracking"
                element={<ProcessTrackingPage />}
              />
              <Route
                path="/student-course/:courseId"
                element={<StudentCoursePage />}
              />
            </>
          )}

          {/* INSTRUCTOR & STUDENT PAGE*/}
          {auth.status === "authenticated" &&
            (isStudent(auth.user.role) || isInstructor(auth.user.role)) && (
              <>
                <Route path="/account" element={<AccountPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="/course-preview/:courseId"
                  element={<CoursePreviewPage />}
                />
                <Route
                  path="/course/:courseId/lesson/:lessonId"
                  element={<LessonPage />}
                />
              </>
            )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
