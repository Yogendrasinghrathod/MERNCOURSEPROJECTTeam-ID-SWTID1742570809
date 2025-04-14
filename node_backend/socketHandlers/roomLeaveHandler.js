const serverStore = require("../serverStore");
const updateRooms = require("./updates/rooms");

const roomLeaveHandler = (socket, data) => {
  const { roomId } = data;

  const activeRoom = serverStore.getActiveRoom(roomId);

  // Ensure the room exists before continuing
  if (activeRoom) {
    serverStore.leaveActiveRoom(roomId, socket.id);

    // Re-fetch the room after removing the participant
    const updatedActiveRoom = serverStore.getActiveRoom(roomId);

    if (updatedActiveRoom) {
      // Check if there are participants before trying to access them
      if (updatedActiveRoom.participants && updatedActiveRoom.participants.length > 0) {
        updatedActiveRoom.participants.forEach((participant) => {
          socket.to(participant.socketId).emit("room-participant-left", {
            connUserSocketId: socket.id,
          });
        });
      }
    }

    updateRooms();
  } else {
    // Optionally handle the case where the room doesn't exist
    console.warn(`Room with ID ${roomId} does not exist`);
  }
};

module.exports = roomLeaveHandler;
