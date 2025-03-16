import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaIdCard, FaClock, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../Styles/CurrentUser.css';

const CurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = 'http://localhost:8000';
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userId = localStorage.getItem('userId');
      
      if (!userId) {
        setError('No user ID found. Please log in again.');
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:8000/app1/users/${userId}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        setUser(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.error || 
                            err.response?.status === 404 ? 'User not found' :
                            err.response?.status === 401 ? 'Session expired. Please log in again.' :
                            'Failed to load profile data. Please try again later.';
        
        setError(errorMessage);
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color class
  const getStatusClass = (status) => {
    if (!status) return 'status-unknown';
    
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') return 'status-active';
    if (statusLower === 'pending') return 'status-pending';
    if (statusLower === 'suspended') return 'status-suspended';
    return 'status-unknown';
  };

  return (
    <motion.div 
      className="current-user-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="profile-header">
        <h2 className="section-title">My Profile</h2>
        <div className="header-line"></div>
      </header>

      {loading ? (
        <motion.div 
          className="loading-container"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="loading-content">
            <div className="spinner-container">
              <FaUserCircle className="user-icon-spinner" />
              <div className="spinner-ring"></div>
            </div>
            <p>Loading your profile data...</p>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div 
          className="error-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h3>Unable to Load Profile</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Retry
          </button>
        </motion.div>
      ) : user ? (
        <motion.div 
          className="user-profile-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="profile-header-section">
            <div className="profile-avatar-container">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="user-avatar" />
              ) : (
                <FaUserCircle className="user-avatar-icon" />
              )}
              <div className={`status-indicator ${getStatusClass(user.status)}`}></div>
            </div>
            
            <div className="profile-info">
              <h3 className="user-name">{user.userName || 'Anonymous User'}</h3>
              <div className="user-role">{user.role || 'User'}</div>
              <div className={`user-status ${getStatusClass(user.status)}`}>
                {user.status || 'Unknown Status'}
              </div>
            </div>
          </div>
          
          <div className="profile-details-section">
            <div className="detail-item">
              <div className="detail-icon">
                <FaIdCard />
              </div>
              <div className="detail-content">
                <div className="detail-label">User ID</div>
                <div className="detail-value">{user.userId || 'N/A'}</div>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <FaCalendarAlt />
              </div>
              <div className="detail-content">
                <div className="detail-label">Created</div>
                <div className="detail-value">{user.createdDate ? formatDate(user.createdDate) : 'N/A'}</div>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon">
                <FaClock />
              </div>
              <div className="detail-content">
                <div className="detail-label">Last Updated</div>
                <div className="detail-value">{user.updatedDate ? formatDate(user.updatedDate) : 'N/A'}</div>
              </div>
            </div>
            
            {user.idProof && (
              <div className="detail-item id-proof-container">
                <div className="detail-content id-proof-content">
                  <div className="detail-label">ID Verification</div>
                  <a
                   href={user.idProof.startsWith('http') ? user.idProof : `${BASE_URL}${user.idProof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="id-proof-button"
                  >
                    <FaIdCard className="id-proof-icon" />
                    <span>View ID Document</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="no-user-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaUserCircle className="no-user-icon" />
          <h3>No Profile Data Available</h3>
          <p>Please log in to view your profile information</p>
          <button className="login-redirect-button" onClick={() => window.location.href = '/login'}>
            Log In Now
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CurrentUser;