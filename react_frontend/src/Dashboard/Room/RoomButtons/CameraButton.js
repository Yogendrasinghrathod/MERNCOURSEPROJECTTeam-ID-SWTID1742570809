import React, { useState, useEffect } from "react";
import { IconButton, Tooltip, Badge } from "@mui/material";
import { Videocam, VideocamOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }
}));

const CameraButton = ({ localStream }) => {
  const theme = useTheme();
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        setCameraEnabled(videoTracks[0].enabled);
      }
    }
  }, [localStream]);

  const handleToggleCamera = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        const newState = !videoTracks[0].enabled;
        videoTracks[0].enabled = newState;
        setCameraEnabled(newState);
      }
    }
  };

  return (
    <Tooltip 
      title={cameraEnabled ? "Turn off camera" : "Turn on camera"} 
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      arrow
    >
      <StyledBadge
        color="error"
        variant="dot"
        invisible={cameraEnabled}
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <IconButton 
          onClick={handleToggleCamera}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          sx={{
            color: theme.palette.common.white,
            backgroundColor: theme.palette.grey[700],
            '&:hover': {
              backgroundColor: theme.palette.grey[600],
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
            margin: theme.spacing(0.5),
          }}
          size="large"
        >
          {cameraEnabled ? (
            <Videocam fontSize="medium" />
          ) : (
            <VideocamOff fontSize="medium" color="error" />
          )}
        </IconButton>
      </StyledBadge>
    </Tooltip>
  );
};

export default CameraButton;