import {
  FaFacebookSquare,
  FaGithub,
  FaPhone,
  FaStackOverflow,
  FaYoutube,
} from "react-icons/fa";
import { LuMapPin } from "react-icons/lu";
import { MdEmail, MdLanguage } from "react-icons/md";
import { SiW3Schools } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="py-20 px-30 w-full bg-black text-white flex justify-between">
      <div className="w-[45%]">
        <Link to={"/"} className="flex items-center select-none w-full mb-10">
          <img src="assets/Logo.jpg" className="rounded-2xl w-1/5" />
          <p className="pl-3 font-bold text-white text-[50px]">E-Learning</p>
        </Link>
        <div className="mb-5">
          <h1 className="text-2xl font-bold">
            TienAnh's E-Learning Platform - A Microservice Fullstack project,
            using multiple framework and database:{" "}
          </h1>
          <p className="ml-10 my-2">
            <span className="font-bold">- Backend: </span>Spring Boot and
            NodeJS/ExpressJS.
          </p>
          <p className="ml-10 my-2">
            <span className="font-bold">- Frontend:</span> React TypeScript.
          </p>
          <p className="ml-10 my-2">
            <span className="font-bold">- Database:</span> PostgreSQL and
            MongoDB.
          </p>
        </div>
        <div className="flex justify-center">
          <a
            href="https://www.facebook.com"
            className="mr-5 text-white w-[5%] hover:scale-115"
            title="Facebook"
          >
            <FaFacebookSquare className="w-full h-10 text-blue-700" />
          </a>
          <a
            href="https://www.youtube.com"
            className="mr-5 text-white w-[5%] hover:scale-115"
            title="Youtube"
          >
            <FaYoutube className="w-full h-10 text-red-600" />
          </a>
          <a
            href="https://www.github.com"
            className="mr-5 text-white w-[5%] hover:scale-115"
            title="Github"
          >
            <FaGithub className="w-full h-10" />
          </a>
          <a
            href="https://www.w3schools.com/"
            className="mr-5 text-white w-[5%] hover:scale-115"
            title="W3Schools"
          >
            <SiW3Schools className="w-full h-10 text-green-700" />
          </a>
          <a
            href="https://stackoverflow.com/questions"
            className="mr-5 text-white w-[5%] hover:scale-115"
            title="StackOverflow"
          >
            <FaStackOverflow className="w-full h-10 text-orange-400" />
          </a>
        </div>
      </div>
      <div className="mt-15">
        <h1 className="text-3xl font-bold mb-20">Get In Touch</h1>
        <div className="flex my-5">
          <MdEmail className="h-7 w-7 mr-3" />
          <p>anhtin44@gmail.com</p>
        </div>
        <div className="flex my-5">
          <FaPhone className="h-7 w-7 mr-3" />
          <p>(+84) 979716865</p>
        </div>
        <div className="flex my-5">
          <LuMapPin className="h-7 w-7 mr-3" />
          <p>Hoàng Mai - Hà Nội</p>
        </div>
        <div className="flex my-5">
          <MdLanguage className="h-7 w-7 mr-3" />
          <p>www.linkedin.com/in/tiến-anh-trần-a96608369</p>
        </div>
      </div>
    </footer>
  );
}
