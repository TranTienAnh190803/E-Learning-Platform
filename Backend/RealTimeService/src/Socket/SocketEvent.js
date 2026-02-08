export const socketEventHandler = async (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Socket Connected`);
  });
};
