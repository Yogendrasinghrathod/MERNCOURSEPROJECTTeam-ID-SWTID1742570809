const serverStore = require("../serverStore");
const updateRooms = require("./updates/rooms");

const roomJoinHandler = (socket, data) => {
  const { roomId } = data;

  const participantDetails = {
    userId: socket.user.userId,
    socketId: socket.id,
  };

  const roomDetails = serverStore.getActiveRoom(roomId);

  // Check if the room exists
  if (roomDetails) {
    // Add the participant to the room
    serverStore.joinActiveRoom(roomId, participantDetails);

    // Send information to users in the room that they should prepare for incoming connection
    roomDetails.participants.forEach((participant) => {
      if (participant.socketId !== participantDetails.socketId) {
        socket.to(participant.socketId).emit("conn-prepare", {
          connUserSocketId: participantDetails.socketId,
        });
      }
    });

    updateRooms();
  } else {
    // Handle the case where the room doesn't exist (optional)
    console.warn(`Room with ID ${roomId} does not exist`);
    // You can also emit an error back to the socket if needed:
    socket.emit("error", { message: `Room with ID ${roomId} does not exist` });
  }
};

module.exports = roomJoinHandler;
