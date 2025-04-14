import React, { useState } from "react";
import { 
  IconButton, 
  Tooltip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button 
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import * as roomHandler from "../../../realtimeCommunication/roomHandler";

const CloseRoomButton = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLeaveRoom = () => {
    roomHandler.leaveRoom();
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Tooltip title="Leave room" arrow>
        <IconButton 
          onClick={handleOpenDialog}
          sx={{
            color: theme.palette.error.main,
            backgroundColor: theme.palette.grey[800],
            '&:hover': {
              backgroundColor: theme.palette.error.dark,
              color: theme.palette.error.contrastText,
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s ease',
            margin: theme.spacing(0.5),
          }}
          size="medium"
        >
          <Close fontSize="medium" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Leave Room?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave the current room? This will end the call for everyone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleLeaveRoom} 
            color="error"
            variant="contained"
            autoFocus
          >
            Leave Room
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CloseRoomButton;