const coreService = process.env.CORESERVICE_URL;
const client = process.env.FRONTEND_URL;

export const corsConfig = {
  origin: [coreService, client],
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
