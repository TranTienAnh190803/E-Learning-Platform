import axios from "../Config/axios.js";

export const getAllCourseId = async (token) => {
  const response = axios.get("/enrollment-api/get-courses-for-socket", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
