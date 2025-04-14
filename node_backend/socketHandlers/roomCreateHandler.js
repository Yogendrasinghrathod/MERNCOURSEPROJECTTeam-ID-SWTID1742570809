const serverStore = require("../serverStore");
const updateRooms = require("./updates/rooms");

const roomCreateHandler = (socket) => {
  console.log("Handle room create event");
  const socketId = socket.id;
  const userId = socket.user.userId;

  const roomDetails = serverStore.addNewActiveRoom(userId, socketId);

  // Check if roomDetails was created successfully
  if (roomDetails) {
    socket.emit('room-create', {
      roomDetails,
    });
    updateRooms();
  } else {
    // Handle room creation failure
    console.error("Failed to create room for user:", userId);
    socket.emit("error", { message: "Failed to create room. Please try again later." });
  }
};

module.exports = roomCreateHandler;
