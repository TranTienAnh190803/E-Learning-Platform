import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Hooks/AuthStore";
import { isInstructor } from "../Helper/CheckRole";

export default function SimpleProfile() {
  const navigate = useNavigate();
  const auth = useAuthStore((s) => s.auth);

  if (auth.status !== "authenticated") {
    navigate("/login");
    return;
  }

  return (
    <div className="w-1/4 bg-white border-r-2 border-gray-200 py-20 px-10 flex flex-col">
      <div className="w-5/6 self-center aspect-square rounded-full overflow-hidden border-5 border-black">
        <img
          src={auth.user.avatar ? auth.user.avatar : "assets/User.jpg"}
          className="w-full aspect-square"
        />
      </div>
      <div className="my-5 text-center">
        <h1 className="text-3xl font-bold mb-1">{auth.user.fullName}</h1>
        <h3 className="text-2xl font-light">{auth.user.email}</h3>
      </div>
      <div>
        <p>
          {isInstructor(auth.user.role)
            ? "- Number of courses: "
            : "- Enrolled courses: "}
        </p>
      </div>
    </div>
  );
}
