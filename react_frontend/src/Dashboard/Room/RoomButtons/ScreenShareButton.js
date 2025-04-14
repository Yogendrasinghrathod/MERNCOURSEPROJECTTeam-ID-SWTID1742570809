import React, { useState } from "react";
import { 
  IconButton, 
  Tooltip,
  CircularProgress,
  Badge,
  Snackbar,
  Alert
} from "@mui/material";
import { ScreenShare, StopScreenShare } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { getActions } from "../../../store/actions/roomActions";
import * as webRTCHandler from "../../../realtimeCommunication/webRTCHandler";
import { useTheme } from "@mui/material/styles";

const ScreenShareButton = ({ 
  localStream,
  screenSharingStream,
  isScreenSharingActive,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const actions = getActions(dispatch);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleToggleScreenShare = async () => {
    if (!isScreenSharingActive) {
      setIsLoading(true);
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: 'monitor',
            frameRate: { ideal: 30, max: 60 }
          },
          audio: false,
          selfBrowserSurface: 'exclude',
          systemAudio: 'exclude'
        });

        // Handle when user clicks stop in the browser's native dialog
        stream.getVideoTracks()[0].onended = () => {
          handleStopScreenShare(stream);
        };

        actions.setScreenSharingStream(stream);
        webRTCHandler.switchOutgoingTracks(stream);
      } catch (err) {
        console.error('Error sharing screen:', err);
        setErrorMessage(err.message || 'Screen sharing permission denied');
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      handleStopScreenShare(screenSharingStream);
    }
  };

  const handleStopScreenShare = (stream) => {
    webRTCHandler.switchOutgoingTracks(localStream);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    actions.setScreenSharingStream(null);
  };

  return (
    <>
      <Tooltip 
        title={isScreenSharingActive ? "Stop screen sharing" : "Start screen sharing"} 
        arrow
        placement="top"
      >
        <Badge
          color="error"
          variant="dot"
          overlap="circular"
          invisible={!isScreenSharingActive}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <IconButton 
            onClick={handleToggleScreenShare}
            disabled={isLoading}
            sx={{
              color: isScreenSharingActive ? theme.palette.error.main : 'white',
              backgroundColor: isScreenSharingActive ? theme.palette.error.dark : theme.palette.grey[700],
              '&:hover': {
                backgroundColor: isScreenSharingActive ? theme.palette.error.main : theme.palette.grey[600],
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease',
              margin: theme.spacing(0.5),
            }}
            size="medium"
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isScreenSharingActive ? (
              <StopScreenShare fontSize="medium" />
            ) : (
              <ScreenShare fontSize="medium" />
            )}
          </IconButton>
        </Badge>
      </Tooltip>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ScreenShareButton;