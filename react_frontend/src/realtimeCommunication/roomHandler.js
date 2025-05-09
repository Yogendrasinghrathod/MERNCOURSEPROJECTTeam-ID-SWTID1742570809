import { setOpenRoom, setRoomDetails, setActiveRooms, setLocalStream, setRemoteStreams, setScreenSharingStream, setIsUserJoinedWithOnlyAudio } from "../store/actions/roomActions";
import store from "../store/store";
import * as socketConnection from "./socketConnection";
import * as webRTCHandler from "./webRTCHandler";

export const createNewRoom = () => {
    const successCallbackFunc = () => {
        store.dispatch(setOpenRoom(true, true));

        const audioOnly = store.getState().room.audioOnly;
        store.dispatch(setIsUserJoinedWithOnlyAudio(audioOnly));

        socketConnection.createNewRoom();
    };
    const audioOnly = store.getState().room.audioOnly;
    webRTCHandler.getLocalStreamPreview(audioOnly, successCallbackFunc);
};

export const newRoomCreated = (data) => {
    const { roomDetails } = data;
    store.dispatch(setRoomDetails(roomDetails));
};

export const updateActiveRooms = (data) => {
    const { activeRooms } = data;
  
    const friends = store.getState().friends.friends;
    const rooms = [];
  
    const userId = store.getState().auth.userDetails?._id;
  
    activeRooms.forEach((room) => {
      const isRoomCreatedByMe = room.roomCreator.userId === userId;
  
      if (isRoomCreatedByMe) {
        rooms.push({ ...room, creatorUsername: "Me" });
      } else {
        friends.forEach((f) => {
          if (f.id === room.roomCreator.userId) {
            rooms.push({ ...room, creatorUsername: f.username });
          }
        });
      }
    });
  
    store.dispatch(setActiveRooms(rooms));
  };

export const joinRoom = (roomId) => {

    const successCallbackFunc = () => {
        store.dispatch(setRoomDetails({roomId}));
        store.dispatch(setOpenRoom(false, true));
        const audioOnly = store.getState().room.audioOnly;
        store.dispatch(setIsUserJoinedWithOnlyAudio(audioOnly));
        socketConnection.joinRoom({roomId});
    };
    const audioOnly = store.getState().room.audioOnly;
    webRTCHandler.getLocalStreamPreview(audioOnly, successCallbackFunc);
};

export const leaveRoom = () => {
  const roomDetails = store.getState().room.roomDetails;
  
  // If we're not in a room, just clean up the state
  if (!roomDetails) {
    store.dispatch(setRoomDetails(null));
    store.dispatch(setOpenRoom(false, false));
    return;
  }

  const { roomId } = roomDetails;

  // Clean up local stream
  const localStream = store.getState().room.localStream;
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setLocalStream(null));
  }

  // Clean up screen sharing stream
  const screenSharingStream = store.getState().room.screenSharingStream;
  if (screenSharingStream) {
    screenSharingStream.getTracks().forEach((track) => track.stop());
    store.dispatch(setScreenSharingStream(null));
  }

  // Clean up remote streams and connections
  store.dispatch(setRemoteStreams([]));
  webRTCHandler.closeAllConnections();

  // Only emit leave room if we have a roomId
  if (roomId) {
    socketConnection.leaveRoom({ roomId });
  }

  // Reset room state
  store.dispatch(setRoomDetails(null));
  store.dispatch(setOpenRoom(false, false));
};