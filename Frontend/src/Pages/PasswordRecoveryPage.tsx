import { useState } from "react";
import EmailInputBox from "../Components/EmailInputBox.PasswordRecovery";

export default function PasswordRecoveryPage() {
  document.title = "Forgot Password";

  type Phase = "enterEmail" | "enterOtp" | "enterNewPassword";
  const [phase, setPhase] = useState<Phase>("enterEmail");

  return (
    <div
      className={`h-screen flex items-center bg-cover bg-center bg-[url(/assets/Login.jpg)]`}
    >
      <div className="h-full lg:w-3/7 md:w-3/5 sm:w-4/5 flex items-center justify-center rounded-r-[5%] border-r-2 border-white p-8 bg-white/70 backdrop-blur-md">
        <div className="w-9/10 px-3 h-[80%] relative">
          <div className="absolute top-0 left-0 right-0">
            <h1 className="text-5xl font-bold text-center">
              Password Recovery
            </h1>
            <hr className="mt-3 mb-8" />
          </div>
          <div className="mt-25">
            {phase === "enterEmail" && <EmailInputBox />}
          </div>
        </div>
      </div>
    </div>
  );
}
