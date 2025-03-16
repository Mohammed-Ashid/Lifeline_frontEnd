import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Button,
  styled,
  Chip,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Refresh,
  Check,
  Close,
  NotificationsActive,
  LocationOn,
  AccessTime,
  Person,
  Message,
  Info,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

// Styled components
const NotificationContainer = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  background: 'linear-gradient(to bottom, #f5f7fa 0%, #eef2f7 100%)',
  minHeight: '100vh',
}));

const NotificationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: '0 auto',
  maxWidth: 700,
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
  background: '#ffffff',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(to right, #1e3c72, #2a5298)',
  },
}));

const NotificationHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '1px solid #f0f0f0',
}));

const NotificationCard = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const UrgencyChip = styled(Chip)(({ urgency }) => ({
  fontWeight: 600,
  ...(urgency === 'urgent' && {
    backgroundColor: '#fff8e1',
    color: '#f57c00',
    border: '1px solid #ffe0b2',
  }),
  ...(urgency === 'standard' && {
    backgroundColor: '#e8f5e9',
    color: '#388e3c',
    border: '1px solid #c8e6c9',
  }),
  ...(urgency === 'high' && {
    backgroundColor: '#fff8e1',
    color: '#f57c00',
    border: '1px solid #ffe0b2',
  }),
  ...(urgency === 'critical' && {
    backgroundColor: '#fdecea',
    color: '#d32f2f',
    border: '1px solid #ffcdd2',
  }),
}));

const ActionButton = styled(Button)(({ variantType }) => ({
  borderRadius: 8,
  fontWeight: 600,
  boxShadow: 'none',
  textTransform: 'none',
  padding: '6px 16px',
  ...(variantType === 'accept' && {
    backgroundColor: '#388e3c',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#2e7d32',
      boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
    },
  }),
  ...(variantType === 'reject' && {
    backgroundColor: '#d32f2f',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#c62828',
      boxShadow: '0 2px 8px rgba(198, 40, 40, 0.3)',
    },
  }),
}));

const RefreshButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  fontWeight: 600,
  textTransform: 'none',
  padding: theme.spacing(1, 3),
  background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
  boxShadow: '0 4px 10px rgba(42, 82, 152, 0.2)',
  '&:hover': {
    background: 'linear-gradient(45deg, #15294d, #1e3c72)',
    boxShadow: '0 6px 12px rgba(42, 82, 152, 0.3)',
  },
}));

const InfoItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(0.75),
}));

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const userId = localStorage.getItem('userId'); // Changed to match previous usage

  const fetchNotifications = async () => {
    if (!userId) {
      setError('Please log in to view notifications.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/app1/notifications/', {
        userId: userId,
      });

      if (response.data.status === 'success') {
        setNotifications(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    fetchNotifications();
  };

  const handleAcceptClick = (notificationId) => {
    setSelectedRequestId(notificationId);
    setEmail('');
    setPhone('');
    setShareDialogOpen(true);
  };

  const handleAccept = async () => {
    if (!email || !phone) {
      setError('Please provide both email and phone number.');
      return;
    }

    setProcessingIds((prev) => [...prev, selectedRequestId]);
    setShareDialogOpen(false);

    try {
      const response = await axios.post('http://localhost:8000/app1/acceptNotification/', {
        requestId: selectedRequestId,
        email: email,
        phone: phone,
      });

      if (response.data.status === 'success') {
        setNotifications((prev) =>
          prev.filter((notification) => notification.request.id !== selectedRequestId)
        );
      } else {
        throw new Error(response.data.message || 'Failed to accept notification');
      }
    } catch (err) {
      console.error('Failed to accept notification:', err);
      setError(err.response?.data?.message || 'Failed to accept notification');
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== selectedRequestId));
      setSelectedRequestId(null);
      setEmail('');
      setPhone('');
    }
  };

  const handleReject = async (notificationId) => {
    setProcessingIds((prev) => [...prev, notificationId]);
    try {
      const response = await axios.post('http://localhost:8000/app1/rejectNotification/', {
        requestId: notificationId,
      });

      if (response.data.status === 'success') {
        setNotifications((prev) =>
          prev.filter((notification) => notification.request.id !== notificationId)
        );
      } else {
        throw new Error(response.data.message || 'Failed to reject notification');
      }
    } catch (err) {
      console.error('Failed to reject notification:', err);
      setError(err.response?.data?.message || 'Failed to reject notification');
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  const handleCloseDialog = () => {
    setShareDialogOpen(false);
    setSelectedRequestId(null);
    setEmail('');
    setPhone('');
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <NotificationContainer>
      <NotificationPaper elevation={0}>
        <NotificationHeader>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsActive sx={{ fontSize: 28, color: '#1e3c72', mr: 1.5 }} />
            <Typography variant="h5" sx={{ color: '#1e3c72', fontWeight: 700 }}>
              Notifications
            </Typography>
          </Box>
          <RefreshButton
            variant="contained"
            onClick={handleRefresh}
            disabled={loading}
            startIcon={<Refresh />}
            size="small"
          >
            Refresh
          </RefreshButton>
        </NotificationHeader>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} variant="filled">
            {error}
          </Alert>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 6,
              borderRadius: 2,
              backgroundColor: '#f7f9fc',
              border: '1px dashed #cfd8dc',
            }}
          >
            <Info sx={{ fontSize: 48, color: '#90a4ae', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#546e7a', fontWeight: 500 }}>
              No notifications available
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              When you receive new requests, they will appear here.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notification) => {
              const { request, feed, secondPerson } = notification;
              const isProcessing = processingIds.includes(request.id);

              return (
                <Fade in={true} key={request.id} timeout={500}>
                  <NotificationCard>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'flex-start' }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e3c72' }}>
                        {feed.title}
                      </Typography>
                      <UrgencyChip label={feed.urgency} size="small" urgency={feed.urgency.toLowerCase()} />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <InfoItem>
                        <Person sx={{ fontSize: 18, color: '#546e7a', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#37474f' }}>
                          <strong>From:</strong> {secondPerson.userName}
                        </Typography>
                      </InfoItem>

                      <InfoItem>
                        <Message sx={{ fontSize: 18, color: '#546e7a', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#37474f' }}>
                          <strong>Details:</strong> {feed.content}
                        </Typography>
                      </InfoItem>

                      <InfoItem>
                        <AccessTime sx={{ fontSize: 18, color: '#546e7a', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#37474f' }}>
                          <strong>Requested:</strong> {formatDate(request.requestedDate)}
                        </Typography>
                      </InfoItem>

                      <InfoItem>
                        <LocationOn sx={{ fontSize: 18, color: '#546e7a', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: '#37474f' }}>
                          <strong>Location:</strong> {feed.location}
                        </Typography>
                      </InfoItem>

                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1.5,
                          p: 1.5,
                          backgroundColor: '#f5f7fa',
                          borderRadius: 1,
                          color: '#37474f',
                          borderLeft: '4px solid #1e3c72',
                        }}
                      >
                        <strong>Message:</strong> {request.message || 'No message provided'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
                      <ActionButton
                        variant="contained"
                        variantType="reject"
                        startIcon={<Close />}
                        disabled={isProcessing}
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </ActionButton>
                      <ActionButton
                        variant="contained"
                        variantType="accept"
                        startIcon={<Check />}
                        disabled={isProcessing}
                        onClick={() => handleAcceptClick(request.id)}
                      >
                        Accept
                      </ActionButton>
                    </Box>
                  </NotificationCard>
                </Fade>
              );
            })}
          </List>
        )}
      </NotificationPaper>

      {/* Contact Sharing Dialog */}
      <Dialog open={shareDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Share Contact Information
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please provide your contact details to accept this request.
          </Typography>
          <TextField
            fullWidth
            label="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            required
          />
          <TextField
            fullWidth
            label="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
            required
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            Your contact details will be shared with the requester upon acceptance.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Check />}
            onClick={handleAccept}
          >
            Confirm Acceptance
          </Button>
        </DialogActions>
      </Dialog>
    </NotificationContainer>
  );
};

export default Notification;