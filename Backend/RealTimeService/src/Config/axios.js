import axios from "axios";

const coreServiceUrl = process.env.CORESERVICE_URL;

const axiosCoreService = axios.create({
  baseURL: coreServiceUrl,
});

axiosCoreService.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

axiosCoreService.interceptors.response.use(
  (response) => response.data,
  (error) => error.response.data,
);

export default axiosCoreService;
