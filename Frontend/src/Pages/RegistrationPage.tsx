import { Navigate } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { useState } from "react";
import ResgistrationBox from "../Components/RegistrationBox";
import EmailVerificationBox from "../Components/EmailOtpVerificationBox";
import type { VerifyEmailForm } from "../Types/User.type";

export type RegistrationStage = "information" | "otp";

export default function RegistrationPage() {
  document.title = "Registration";
  // Global State
  const auth = useAuthStore((s) => s.auth);

  // Local State
  const [registrationStage, setRegistrationStage] =
    useState<RegistrationStage>("information");
  const [verifyEmailForm, setVerifyEmailForm] = useState<VerifyEmailForm>({
    email: "",
    otpCode: "",
  });

  if (auth.status === "authenticated") {
    return <Navigate to={"/"} />;
  }

  return (
    <div
      className={`h-screen flex items-center bg-cover bg-center bg-[url(/assets/Login.jpg)]`}
    >
      <div className="h-full lg:w-3/7 md:w-3/5 sm:w-4/5 flex items-center justify-center rounded-r-[5%] border-r-2 border-white p-8 bg-white/70 backdrop-blur-md">
        <div className="w-9/10 px-3 h-[80%] relative">
          <div className="absolute top-0 left-0 right-0">
            <h1 className="text-5xl font-bold text-center">Registration</h1>
            <hr className="mt-3 mb-8" />
          </div>
          <div className="mt-25">
            {registrationStage === "information" && (
              <ResgistrationBox
                setRegistrationStage={setRegistrationStage}
                setVerifyEmailForm={setVerifyEmailForm}
              />
            )}
            {registrationStage === "otp" && (
              <EmailVerificationBox
                verifyEmailForm={verifyEmailForm}
                setVerifyEmailForm={setVerifyEmailForm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
