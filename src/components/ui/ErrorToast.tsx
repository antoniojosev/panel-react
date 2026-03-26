import { Snackbar, Alert } from '@mui/material';
import React from 'react';

interface ErrorToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ open, message, onClose }: ErrorToastProps) {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={onClose} severity="error" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
