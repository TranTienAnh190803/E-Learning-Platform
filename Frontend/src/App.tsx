import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import { useEffect } from "react";
import { useAuthStore } from "./Hooks/AuthStore";
import RegistrationPage from "./Pages/RegistrationPage";
import PasswordRecoveryPage from "./Pages/PasswordRecoveryPage";
import { isInstructor } from "./Helper/CheckRole";
import AccountPage from "./Pages/AccountPage";

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

          {auth.status === "authenticated" && isInstructor(auth.user.role) && (
            <>
              <Route path="/account" element={<AccountPage />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
