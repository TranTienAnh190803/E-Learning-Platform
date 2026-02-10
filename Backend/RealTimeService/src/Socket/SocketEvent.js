export const socketEventHandler = async (io) => {
  io.on("connection", (socket) => {
    console.log(`✅ Socket Connected`);

    const { userId } = socket.user;

    // Join all connection with same user
    socket.join(`user:${userId}`);

    // Join all connection of 'course' with same user
  });
};
