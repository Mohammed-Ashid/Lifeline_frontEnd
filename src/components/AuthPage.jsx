import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Divider, 
  InputAdornment, 
  IconButton,
  Tabs,
  Tab,
  FormHelperText,
  styled,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Person, 
  Lock, 
  Visibility, 
  VisibilityOff, 
  Upload, 
  FavoriteBorder,
  Favorite,
  MedicalServices
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';  // Added for navigation

// Styled components (unchanged)
const AuthContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(4, 2)
}));

const AuthPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: 800,
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
  }
}));

const ImageSection = styled(Box)(({ theme }) => ({
  flex: '1',
  background: 'linear-gradient(135deg, #3f51b5 30%, #2196f3 90%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  color: 'white',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
  }
}));

const FormSection = styled(Box)(({ theme }) => ({
  flex: '1.2',
  padding: theme.spacing(4),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius * 1.5,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
    }
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  padding: theme.spacing(1.2, 3),
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
  '&:hover': {
    boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
    background: 'linear-gradient(45deg, #303f9f 30%, #1976d2 90%)',
  }
}));

const FileUploadButton = styled(Button)(({ theme }) => ({
  borderRadius: 30,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  fontWeight: 500,
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: 'rgba(63, 81, 181, 0.08)',
  }
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(4)
}));

// Auth Component
const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
    idProof: null
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();  // For redirecting after successful login/signup

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
    setFormData({
      userName: '',
      password: '',
      confirmPassword: '',
      idProof: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, idProof: e.target.files[0] });
      if (errors.idProof) {
        setErrors({ ...errors, idProof: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 4) {
      newErrors.userName = 'Username must be at least 4 characters';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (activeTab === 1) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.idProof) {
        newErrors.idProof = 'ID proof is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
              // Check for admin credentials
              if (formData.userName == 'admin' && formData.password == 'admin@123') {
               
                  window.location.href = 'http://127.0.0.1:8000/admin'; // Redirect to Django admin
               
              } 
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (activeTab === 0) {
        // Login
        const response = await axios.post('http://localhost:8000/app1/login/', {
          userName: formData.userName,
          password: formData.password
        });

        if (response.data.status === 'success') {
          localStorage.setItem('userId', response.data.userId);  // Store userId
          localStorage.setItem('userName', formData.userName);   // Store username
          setAlert({
            open: true,
            message: response.data.message,
            severity: 'success'
          });
          setTimeout(() => navigate('/dashboard'), 2000);  // Redirect to dashboard
        } else {
          throw new Error(response.data.message);
        }
      } else {
        // Signup
        const formDataToSend = new FormData();
        formDataToSend.append('userName', formData.userName);
        formDataToSend.append('password', formData.password);
        if (formData.idProof) {
          formDataToSend.append('idProof', formData.idProof);
        }

        const response = await axios.post('http://localhost:8000/app1/signup/', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.status === 'success') {
          setAlert({
            open: true,
            message: response.data.message,
            severity: 'success'
          });
          setTimeout(() => setActiveTab(0), 2000);  // Switch to login tab
        } else {
          throw new Error(response.data.message);
        }
      }
    } catch (error) {
      setAlert({
        open: true,
        message: error.response?.data?.message || 'An error occurred. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <AuthContainer maxWidth={false}>
      <AuthPaper elevation={10}>
        <ImageSection>
          <LogoBox>
            <MedicalServices sx={{ fontSize: 40, mr: 1 }} />
            <Typography variant="h4" component="div" fontWeight="bold">
              MyLife Line
            </Typography>
          </LogoBox>
          
          <Typography variant="h5" fontWeight="500" textAlign="center" mb={3}>
            Health Care Donation
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Favorite color="error" sx={{ mr: 1, fontSize: 30 }} />
            <Typography variant="body1" fontWeight="500">
              Donate to save lives
            </Typography>
          </Box>
          
          <Typography variant="body2" textAlign="center" sx={{ opacity: 0.9 }}>
            Your contribution can make a significant difference in someone's life. Join our community of donors today.
          </Typography>
        </ImageSection>
        
        <FormSection>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            sx={{ mb: 4 }}
          >
            <Tab label="Login" sx={{ fontWeight: 600 }} />
            <Tab label="Sign Up" sx={{ fontWeight: 600 }} />
          </Tabs>
          
          <Typography variant="h5" fontWeight="bold" mb={3}>
            {activeTab === 0 ? 'Welcome Back' : 'Create Account'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              error={!!errors.userName}
              helperText={errors.userName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            
            <StyledTextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {activeTab === 1 && (
              <>
                <StyledTextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <input
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                  id="id-proof-button"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="id-proof-button">
                  <FileUploadButton
                    component="span"
                    variant="outlined"
                    startIcon={<Upload />}
                    fullWidth
                  >
                    {formData.idProof ? formData.idProof.name : 'Upload ID Proof'}
                  </FileUploadButton>
                </label>
                {errors.idProof && (
                  <FormHelperText error>{errors.idProof}</FormHelperText>
                )}
              </>
            )}
            
            <SubmitButton
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeTab === 0 ? (
                'Login'
              ) : (
                'Sign Up'
              )}
            </SubmitButton>
          </form>
          
          {activeTab === 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="primary"
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Forgot password?
              </Typography>
            </Box>
          )}
        </FormSection>
      </AuthPaper>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} elevation={6}>
          {alert.message}
        </Alert>
      </Snackbar>
    </AuthContainer>
  );
};

export default AuthPage;