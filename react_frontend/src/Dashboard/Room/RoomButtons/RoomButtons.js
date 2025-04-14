import { styled } from "@mui/system";
import React from "react";
import ScreenShareButton from "./ScreenShareButton";
import MicButton from "./MicButton";
import CloseRoomButton from "./CloseRoomButton";
import CameraButton from "./CameraButton";
import { useSelector } from "react-redux";
import RecordingButton from "./RecordingButton";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

const MainContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  height: '80px',
  minWidth: '300px',
  maxWidth: '700px',
  width: 'auto',
  backgroundColor: theme.palette.grey[900],
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 2),
  gap: theme.spacing(2),
  boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.3)',
  zIndex: 1000,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10px',
    left: 0,
    right: 0,
    height: '10px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: '100%',
    borderRadius: 0,
    gap: theme.spacing(1),
  }
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:not(:last-child)::after': {
    content: '""',
    height: '40px',
    width: '1px',
    backgroundColor: theme.palette.divider,
    margin: theme.spacing(0, 1),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  }
}));

const RoomButtons = () => {
  const theme = useTheme();
  const room = useSelector(state => state.room);
  const { localStream, isUserJoinedWithOnlyAudio } = room;

  return (
    <MainContainer theme={theme}>
      <ButtonGroup>
        {!isUserJoinedWithOnlyAudio && <ScreenShareButton room={room} />}
        <MicButton localStream={localStream} />
        {!isUserJoinedWithOnlyAudio && <CameraButton localStream={localStream} />}
      </ButtonGroup>
      
      <ButtonGroup>
        <RecordingButton />
      </ButtonGroup>
      
      <ButtonGroup>
        <CloseRoomButton />
      </ButtonGroup>
    </MainContainer>

  );
};

export default RoomButtons;