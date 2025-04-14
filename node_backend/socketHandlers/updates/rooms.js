const serverStore = require("../../serverStore");

const updateRooms = (toSpecifiedTargetId = null) => {
  try {
    const io = serverStore.getSocketServerInstance();
    if (!io) {
      console.error("Socket server instance not found.");
      return;
    }

    const activeRooms = serverStore.getActiveRooms();
    
    if (!activeRooms || activeRooms.length === 0) {
      console.log("No active rooms available.");
    }

    const eventPayload = { activeRooms: activeRooms || [] };

    if (toSpecifiedTargetId) {
      // Emit to a specific target socketId
      io.to(toSpecifiedTargetId).emit("active-rooms", eventPayload);
    } else {
      // Emit to all connected clients
      io.emit("active-rooms", eventPayload);
    }
  } catch (err) {
    console.error("Error updating active rooms:", err);
  }
};

module.exports = updateRooms;
