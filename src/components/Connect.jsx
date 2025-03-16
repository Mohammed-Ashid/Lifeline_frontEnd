import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/system';

// Styled components
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#fff',
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  outline: 'none',
  [theme.breakpoints.down('sm')]: {
    width: '90%',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
  },
}));

const SendButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  fontWeight: 600,
  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
  color: '#fff',
  '&:hover': {
    background: 'linear-gradient(45deg, #303f9f 30%, #1976d2 90%)',
  },
  '&:disabled': {
    background: '#ccc',
  },
}));

const Connect = ({ open, onClose, id }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
console.log(id)
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const handleSendRequest = async () => {
    if (!message.trim()) {
      setSnackbar({ open: true, message: 'Message cannot be empty', severity: 'error' });
      return;
    }

    if (!userId) {
      setSnackbar({ open: true, message: 'User not authenticated. Please log in.', severity: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/app1/makerequest/', {
        feedId: id,        // ID from parent component
        userId: userId,    // User ID from localStorage
        message: message,  // Message typed by user
      });

      if (response.data.status === 'success') {
        setSnackbar({ open: true, message: response.data.message || 'Request sent successfully!', severity: 'success' });
        setMessage(''); // Clear the message field
        setTimeout(() => onClose(), 2000); // Close modal after 2 seconds
      } else {
        throw new Error(response.data.message || 'Failed to send request');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'An error occurred. Please try again.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="connect-modal-title">
        <ModalBox>
          <Typography id="connect-modal-title" variant="h6" component="h2" gutterBottom sx={{ color: '#1e3c72', fontWeight: 'bold' }}>
            Connect Request
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Feed ID: {id}
          </Typography>

          <StyledTextField
            label="Message"
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Type your message here..."
            disabled={loading}
          />

          <SendButton
            onClick={handleSendRequest}
            disabled={loading || !message.trim()}
            fullWidth
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Request'}
          </SendButton>
        </ModalBox>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Connect;