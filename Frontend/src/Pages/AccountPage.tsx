import { useState } from "react";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import PersonalInfo from "../Components/PersonalInfo.Account";
import PasswordChanging from "../Components/PasswordChanging.Account";

export type Selection = "personal" | "email" | "password" | "delete";

export default function AccountPage() {
  const [selection, setSelection] = useState<Selection>("personal");

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-25 flex">
        <Sidebar selection={selection} setSelection={setSelection} />
        {selection === "personal" && <PersonalInfo />}
        {selection === "password" && <PasswordChanging />}
      </div>
      <Footer />
    </>
  );
}
