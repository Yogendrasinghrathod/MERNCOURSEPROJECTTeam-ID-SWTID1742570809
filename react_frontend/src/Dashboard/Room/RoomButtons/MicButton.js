import React, { useState, useEffect } from "react";
import { 
  IconButton, 
  Tooltip, 
  Badge,
  CircularProgress
} from "@mui/material";
import { Mic, MicOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    }
  }
}));

const MicButton = ({ localStream }) => {
  const theme = useTheme();
  const [micEnabled, setMicEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        setMicEnabled(audioTracks[0].enabled);
      }
    }
  }, [localStream]);

  const handleToggleMic = () => {
    if (localStream) {
      setLoading(true);
      const audioTracks = localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        const newState = !audioTracks[0].enabled;
        audioTracks[0].enabled = newState;
        
        // Simulate async operation with timeout
        setTimeout(() => {
          setMicEnabled(newState);
          setLoading(false);
        }, 200);
      }
    }
  };

  return (
    <Tooltip 
      title={micEnabled ? "Mute microphone" : "Unmute microphone"} 
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      arrow
    >
      <StyledBadge
        color="error"
        variant="dot"
        invisible={micEnabled}
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <IconButton 
          onClick={handleToggleMic}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          disabled={loading}
          sx={{
            color: micEnabled ? theme.palette.success.main : theme.palette.error.main,
            backgroundColor: theme.palette.grey[800],
            '&:hover': {
              backgroundColor: micEnabled ? theme.palette.success.dark : theme.palette.error.dark,
              transform: 'scale(1.1)',
              color: theme.palette.common.white,
            },
            transition: 'all 0.2s ease',
            margin: theme.spacing(0.5),
            position: 'relative',
          }}
          size="medium"
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : micEnabled ? (
            <Mic fontSize="medium" />
          ) : (
            <MicOff fontSize="medium" />
          )}
        </IconButton>
      </StyledBadge>
    </Tooltip>
  );
};

export default MicButton;