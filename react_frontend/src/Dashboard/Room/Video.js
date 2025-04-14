import { styled } from "@mui/system";
import React, { useEffect, useRef } from "react";
import { Box, Typography, alpha, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import { useSelector } from "react-redux";

const VideoContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.grey[900],
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[8],
  },
}));

const VideoElement = styled('video')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const UserLabel = styled(Box)(({ theme, isLocal }) => ({
  position: 'absolute',
  bottom: '8px',
  left: '8px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  color: theme.palette.text.primary,
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 500,
  zIndex: 1,
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const StatusIndicator = styled(Box)(({ theme, isActive }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: isActive ? theme.palette.success.main : theme.palette.error.main,
  marginRight: '4px',
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  left: '8px',
  display: 'flex',
  gap: '4px',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  padding: '4px',
  borderRadius: '4px',
  backdropFilter: 'blur(4px)',
  zIndex: 1,
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  zIndex: 10,
}));

const Video = ({ stream, isLocalStream, isMainVideo, isUserSharingScreen }) => {
  const theme = useTheme();
  const videoRef = useRef();
  const socket = useSelector(state => state.socket);

  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play().catch(error => {
          console.error("Error attempting to play video:", error);
        });
      };
    }
  }, [stream]);

  const hasAudio = stream?.getAudioTracks().some(track => track.enabled);
  const hasVideo = stream?.getVideoTracks().some(track => track.enabled);

  const handleStopScreenShare = () => {
    if (isUserSharingScreen) {
      socket.emit('stop-screen-share');
    }
  };

  return (
    <VideoContainer style={{
      border: isLocalStream ? `2px solid ${theme.palette.primary.main}` : 'none',
      aspectRatio: isMainVideo ? '16/9' : '4/3'
    }}>
      <VideoElement 
        ref={videoRef} 
        autoPlay 
        muted={isLocalStream} 
        playsInline
      />
      <ControlsContainer>
        {hasAudio ? (
          <MicIcon fontSize="small" color="success" />
        ) : (
          <MicOffIcon fontSize="small" color="error" />
        )}
        {hasVideo ? (
          <VideocamIcon fontSize="small" color="success" />
        ) : (
          <VideocamOffIcon fontSize="small" color="error" />
        )}
      </ControlsContainer>
      <UserLabel isLocal={isLocalStream}>
        <StatusIndicator isActive={stream?.active} />
        {isLocalStream ? 'You' : 'Participant'}
      </UserLabel>
      {!stream && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(0,0,0,0.7)"
        >
          <Typography variant="body1" color="white">
            {isLocalStream ? 'Camera Off' : 'Participant Camera Off'}
          </Typography>
        </Box>
      )}
      {isMainVideo && stream && (
        <VideoControls>
          {isUserSharingScreen && (
            <Tooltip title="Stop sharing screen">
              <IconButton
                onClick={handleStopScreenShare}
                sx={{ 
                  backgroundColor: 'rgba(255, 0, 0, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.9)',
                  }
                }}
              >
                <StopScreenShareIcon />
              </IconButton>
            </Tooltip>
          )}
        </VideoControls>
      )}
    </VideoContainer>
  );
};

export default Video;