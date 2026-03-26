import React from 'react';
import { Box, Modal as MuiModal, Paper } from '@mui/material';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  minWidth?: number | string;
  maxWidth?: number | string;
}

export default function Modal({ open, onClose, children, minWidth = 500, maxWidth = '95vw' }: ModalProps) {
  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
        }}
        onClick={onClose}
      >
        <Paper 
          sx={{ p: 4, minWidth, maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </Paper>
      </Box>
    </MuiModal>
  );
}
