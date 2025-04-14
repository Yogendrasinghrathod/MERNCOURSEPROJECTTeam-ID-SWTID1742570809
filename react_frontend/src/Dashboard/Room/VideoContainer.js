import React from "react";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import Video from "./Video";
import { Box, alpha, IconButton, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

const MainContainer = styled('div')(({ theme }) => ({
  height: "85%",
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: "1fr",
    height: "auto",
  }
}));

const VideoWrapper = styled('div')(({ theme, isMain, isScreenShare }) => ({
  position: 'relative',
  width: '100%',
  height: isMain ? '100%' : 'auto',
  aspectRatio: isMain ? '16/9' : '4/3',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.grey[900],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'scale(1.02)',
  },
  [theme.breakpoints.down('sm')]: {
    aspectRatio: '16/9',
  }
}));

const CameraOverlay = styled('div')(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  width: '200px',
  height: '150px',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  zIndex: 10,
  border: `2px solid ${theme.palette.primary.main}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  }
}));

const ParticipantCount = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  color: theme.palette.text.primary,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.875rem',
  fontWeight: 500,
  zIndex: 1,
}));

const ShareButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: theme.spacing(2),
  color: 'white',
  backgroundColor: alpha('#000', 0.5),
  '&:hover': {
    backgroundColor: alpha('#000', 0.7),
  },
  zIndex: 10,
}));

const VideoContainer = () => {
  const room = useSelector(state => state.room);
  const { localStream, remoteStreams, screenSharingStream, isUserSharingScreen, isUserRoomCreator } = room;

  // Determine the main stream (screen sharing takes priority)
  const mainStream = screenSharingStream || localStream;
  const secondaryStreams = screenSharingStream 
    ? [localStream, ...remoteStreams] 
    : remoteStreams;

  const totalParticipants = 1 + remoteStreams.length; // Local + remote participants

  const handleShareClick = () => {
    if (isUserRoomCreator) {
      const roomLink = `${window.location.origin}/room/${room.roomId}`;
      navigator.clipboard.writeText(roomLink);
    }
  };

  return (
    <MainContainer>
      {mainStream && (
        <VideoWrapper isMain={true} isScreenShare={!!screenSharingStream}>
          <Video
            stream={mainStream}
            isLocalStream={!screenSharingStream && mainStream === localStream}
            isMainVideo
            isUserSharingScreen={isUserSharingScreen}
          />
          <ParticipantCount>
            {totalParticipants} {totalParticipants === 1 ? 'Participant' : 'Participants'}
          </ParticipantCount>
        </VideoWrapper>
      )}
      
      {screenSharingStream && localStream && (
        <CameraOverlay>
          <Video 
            stream={localStream} 
            isLocalStream={true}
          />
        </CameraOverlay>
      )}
      
      {!screenSharingStream && secondaryStreams.filter(Boolean).map((stream, index) => (
        <VideoWrapper key={stream.id} isMain={false}>
          <Video 
            stream={stream} 
            isLocalStream={stream === localStream}
          />
        </VideoWrapper>
      ))}

      {/* Share Button - Only visible to room creator */}
      {isUserRoomCreator && (
        <Tooltip title="Share room link">
          <ShareButton onClick={handleShareClick}>
            <ShareIcon />
          </ShareButton>
        </Tooltip>
      )}
    </MainContainer>
  );
};

export default VideoContainer;