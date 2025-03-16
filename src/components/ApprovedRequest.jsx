import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  List, 
  Paper, 
  CircularProgress, 
  Alert, 
  Button, 
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  TextField,
  styled,
  alpha
} from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  Share as ShareIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Message as MessageIcon,
  Warning as WarningIcon,
  ContentPaste as ContentIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';

// Styled components
const ApprovedRequestsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: 'linear-gradient(120deg, #f5f7fa 0%, #e4e8f0 100%)',
  minHeight: '100vh',
}));

const ApprovedRequestsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: '0 auto',
  maxWidth: 800,
  borderRadius: 16,
  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const RequestCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
}));

const NoDataBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(5),
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: theme.shape.borderRadius * 2,
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: '10px 20px',
  textTransform: 'none',
  fontWeight: 600,
}));

// Helper function to format dates nicely
const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get urgency color
const getUrgencyColor = (urgency) => {
  switch(urgency?.toLowerCase()) {
    case 'urgent': return 'warning';
    case 'standard': return 'success';
    case 'high': return 'warning';
    case 'critical': return 'error';
    default: return 'primary';
  }
};

const ApprovedRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const userId = localStorage.getItem('userId'); // Changed to match previous usage

  const fetchApprovedRequests = async () => {
    if (!userId) {
      setError('Please log in to view approved requests.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/app1/approvedRequests/', {
        userId: userId,
      });
      
      if (response.data.status === 'success') {
        setApprovedRequests(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Failed to fetch approved requests');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching approved requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareContact = (user) => {
    setSelectedUser(user);
    setEmail(''); // Reset fields when opening dialog
    setPhone('');
    setShareDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setShareDialogOpen(false);
    setSelectedUser(null);
    setEmail('');
    setPhone('');
  };

  const handleShareSubmit = () => {
    if (!email || !phone) {
      alert('Please provide both email and phone number.');
      return;
    }
    // Simulate sharing contact details (replace with actual API call later)
    console.log('Sharing contact details:', {
      toUserId: selectedUser.userId,
      email: email,
      phone: phone,
      fromUserId: userId,
    });
    handleCloseDialog();
  };

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  return (
    <ApprovedRequestsContainer>
      <ApprovedRequestsPaper>
        <HeaderSection>
          <Typography variant="h4" sx={{ color: '#1e3c72', fontWeight: 700 }}>
            Approved Requests
          </Typography>
          <StyledButton 
            variant="contained" 
            onClick={fetchApprovedRequests} 
            disabled={loading} 
            startIcon={<RefreshIcon />}
            color="primary"
          >
            Refresh
          </StyledButton>
        </HeaderSection>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {error}
          </Alert>
        ) : approvedRequests.length === 0 ? (
          <NoDataBox>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No approved requests found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              When requests are approved, they will appear here.
            </Typography>
          </NoDataBox>
        ) : (
          <List sx={{ p: 0 }}>
            {approvedRequests.map((item) => (
              <RequestCard key={item.request.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e3c72' }}>
                    {item.feed.title}
                  </Typography>
                  <Chip 
                    label={item.feed.type} 
                    color="primary" 
                    size="small" 
                    sx={{ fontWeight: 500 }}
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                                
                <InfoRow>
                  <ContentIcon fontSize="small" />
                  <Typography variant="body1">
                    {item.feed.content}
                  </Typography>
                </InfoRow>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                  <InfoRow>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {item.feed.location}
                    </Typography>
                  </InfoRow>
                  
                  <InfoRow>
                    <WarningIcon fontSize="small" />
                    <Chip 
                      label={item.feed.urgency || 'Normal'} 
                      size="small" 
                      color={getUrgencyColor(item.feed.urgency)}
                      sx={{ fontWeight: 500 }}
                    />
                  </InfoRow>
                </Box>

                <Box sx={{ mt: 2, p: 2, bgcolor: alpha('#f5f7fa', 0.6), borderRadius: 1 }}>
                  <InfoRow>
                    <PersonIcon fontSize="small" />
                    <Typography variant="body2">
                      <strong>Posted by:</strong> {item.postedUser.userName}
                    </Typography>
                    <Tooltip title="Share contact information">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1 }}
                        onClick={() => handleShareContact(item.postedUser)}
                      >
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InfoRow>

                  <InfoRow>
                    <MessageIcon fontSize="small" />
                    <Typography variant="body2">
                      <strong>Message:</strong> {item.request.message}
                    </Typography>
                  </InfoRow>
                  
                  <InfoRow>
                    <TimeIcon fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Requested: {formatDate(item.request.requestedDate)}
                    </Typography>
                  </InfoRow>
                </Box>
              </RequestCard>
            ))}
          </List>
        )}
      </ApprovedRequestsPaper>

      {/* Contact Sharing Dialog */}
      <Dialog open={shareDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Share Contact Information
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <>
              <InfoRow>
                <PersonIcon />
                <Typography variant="body1">
                  <strong>To:</strong> {selectedUser.userName} (ID: {selectedUser.userId})
                </Typography>
              </InfoRow>
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
                By sharing contact details, you agree to our privacy policy and terms of service.
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ShareIcon />}
            onClick={handleShareSubmit}
          >
            Share My Details
          </Button>
        </DialogActions>
      </Dialog>
    </ApprovedRequestsContainer>
  );
};

export default ApprovedRequests;