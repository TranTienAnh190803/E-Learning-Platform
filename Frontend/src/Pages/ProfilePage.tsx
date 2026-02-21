import CourseList from "../Components/CourseList.Profile";
import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import SimpleProfile from "../Components/SimpleProfile";

export default function ProfilePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-25 flex">
        <SimpleProfile />
        <CourseList />
      </div>
      <Footer />
    </>
  );
}
