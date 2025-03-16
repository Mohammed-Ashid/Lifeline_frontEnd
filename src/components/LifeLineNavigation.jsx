import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import '../Styles/LifeLineNavigation.css';
import { FaHome, FaHandHoldingHeart, FaBell, FaClipboardList, FaHandshake, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Add FaSignOutAlt
import LifeLineFeed from './LifeLineFeed';
import LifeLineDonate from './LifeLineDonate';
import LifeLineRequest from './LifeLineRequest';
import Notification from './Notification';
import ApprovedRequests from './ApprovedRequest';
import CurrentUser from './CurrentUser';

// Mock components for each section
const FeedComponent = () => <div className="content-section"><LifeLineFeed /></div>;
const DonateComponent = () => <div className="content-section"><LifeLineDonate /></div>;
const NotificationComponent = () => <div className="content-section"><Notification /></div>;
const RequestComponent = () => <div className="content-section"><LifeLineRequest /></div>;
const MatchesComponent = () => <div className="content-section"><ApprovedRequests /></div>;
const ProfileComponent = () => (
  <div className="content-section">
  <CurrentUser/>
  </div>
);

const LifeLineNavigation = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const navigate = useNavigate(); // Add navigation hook

  const navItems = [
    { id: 'feed', label: 'Feed', icon: <FaHome />, component: <FeedComponent /> },
    { id: 'donate', label: 'Donate', icon: <FaHandHoldingHeart />, component: <DonateComponent /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell />, component: <NotificationComponent /> },
    { id: 'requests', label: 'Requests', icon: <FaClipboardList />, component: <RequestComponent /> },
    { id: 'matches', label: 'Matches', icon: <FaHandshake />, component: <MatchesComponent /> },
    { id: 'profile', label: 'Profile', icon: <FaUserCircle />, component: <ProfileComponent /> },
  ];

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate('/'); // Navigate to root
  };

  const renderContent = () => {
    const selectedItem = navItems.find(item => item.id === activeTab);
    return selectedItem ? selectedItem.component : <FeedComponent />;
  };

  return (
    <div className="lifeline-container">
      <div className="sidebar">
        <div className="logo">
          <h1>Life Line</h1>
          <p>Connecting hearts</p>
        </div>
        <nav className="nav-menu">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activeTab === item.id && <span className="active-indicator" />}
            </div>
          ))}
          {/* Logout Button */}
          <div
            className="nav-item logout-item"
            onClick={handleLogout}
          >
            <span className="nav-icon"><FaSignOutAlt /></span>
            <span className="nav-label">Logout</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          <p>© 2025 Life Line</p>
        </div>
      </div>
      <div className="main-content">
        <header className="content-header">
          <h2>{navItems.find(item => item.id === activeTab)?.label}</h2>
          <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button>Search</button>
          </div>
        </header>
        <div className="content-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LifeLineNavigation;