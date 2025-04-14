import React from "react";
import { styled } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { useTheme } from "@mui/material/styles";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  '&:hover': {
    backgroundColor: theme.palette.grey[700],
  },
  transition: 'all 0.2s ease-in-out',
  boxShadow: theme.shadows[2],
}));

const ResizeRoomButton = ({ isRoomMinimized, handleRoomResize }) => {
  const theme = useTheme();

  return (
    <Tooltip 
      title={isRoomMinimized ? "Maximize" : "Minimize"} 
      placement="left"
      arrow
    >
      <StyledIconButton 
        onClick={handleRoomResize}
        size="small"
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: 1200,
          color: theme.palette.common.white,
          '&:hover': {
            transform: 'scale(1.1)',
          }
        }}
      >
        {isRoomMinimized ? (
          <OpenInFullIcon fontSize="small" />
        ) : (
          <CloseFullscreenIcon fontSize="small" />
        )}
      </StyledIconButton>
    </Tooltip>
  );
};

export default ResizeRoomButton;