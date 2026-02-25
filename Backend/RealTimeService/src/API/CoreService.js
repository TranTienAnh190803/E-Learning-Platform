import axios from "../Config/axios.js";

export const getAllEnrolledCourseId = async (token) => {
  const response = await axios.get("/enrollment-api/get-courses-for-socket", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAllOwnedCourseId = async (token) => {
  const response = await axios.get("/course-api/get-owned-courses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};
