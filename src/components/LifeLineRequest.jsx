import React, { useState } from 'react';
import '../Styles/LifeLineDonate.css';
import { FaHeartbeat, FaUtensils, FaTshirt, FaMoneyBillWave, FaCarAlt, FaHandsHelping, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios'; // Import Axios

const LifeLineRequest = () => {
  const [formData, setFormData] = useState({
    category: 'blood',
    urgency: 'standard',
    location: '',
    title: '',
    description: '',
    bloodType: 'A+',
    organType: 'kidney'
  });

  // Same constants as before (donationCategories, URGENCY_CHOICES, etc.)
  const donationCategories = [
    { id: 'blood', label: 'Blood', icon: <FaHeartbeat /> },
    { id: 'organ', label: 'Organ', icon: <FaHeartbeat /> },
    { id: 'food', label: 'Food', icon: <FaUtensils /> },
    { id: 'clothing', label: 'Clothing', icon: <FaTshirt /> },
    { id: 'financial', label: 'Financial', icon: <FaMoneyBillWave /> },
    { id: 'transport', label: 'Transport', icon: <FaCarAlt /> },
    { id: 'volunteer', label: 'Volunteer', icon: <FaHandsHelping /> },
  ];

  const URGENCY_CHOICES = [
    { value: 'standard', label: 'Standard' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'critical', label: 'Critical' },
  ];

  const BLOOD_TYPES = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const ORGAN_TYPES = [
    { value: 'kidney', label: 'Kidney' },
    { value: 'liver', label: 'Liver (Partial)' },
    { value: 'bone-marrow', label: 'Bone Marrow' },
    { value: 'stem-cells', label: 'Stem Cells' },
    { value: 'cornea', label: 'Cornea' },
    { value: 'heart', label: 'Heart' },
    { value: 'lung', label: 'Lung' },
    { value: 'pancreas', label: 'Pancreas' },
  ];

  const LOCATION_CHOICES = [
    { value: 'center-downtown', label: 'Downtown Donation Center' },
    { value: 'center-north', label: 'North Community Center' },
    { value: 'center-east', label: 'East Medical Facility' },
    { value: 'center-west', label: 'West Branch Office' },
    { value: 'other', label: 'Other Location' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCategoryChange = (categoryId) => {
    setFormData({
      ...formData,
      category: categoryId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }
  
    const selectedCategory = donationCategories.find(cat => cat.id === formData.category);
    const postData = {
      type: 'request',
      category: selectedCategory.label,
      group: formData.bloodType || formData.organType || null,
      urgency: formData.urgency,
      user: parseInt(userId, 10),
      location: formData.location,
      title: formData.title,
      content: formData.description,
      status: 'pending'
    };
  
    console.log("Data being sent:", postData);
  
    try {
      const response = await axios.post('http://localhost:8000/app1/newfeed/', postData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log("Response:", response.data);
      alert("Thank you for your donation request! Our team will process it soon.");
      setFormData({
        category: 'blood',
        urgency: 'standard',
        location: '',
        title: '',
        description: '',
        bloodType: 'A+',
        organType: 'kidney'
      });
    } catch (error) {
      console.error("Network Error Details:", {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
        headers: error.response ? error.response.headers : null
      });
      alert("Network Error: " + (error.response ? JSON.stringify(error.response.data) : error.message));
    }
  };

  // Same renderCategorySpecificFields function as before
  const renderCategorySpecificFields = () => {
    switch (formData.category) {
      case 'blood':
        return (
          <div className="form-group">
            <label htmlFor="bloodType">Blood Type</label>
            <select 
              id="bloodType" 
              name="bloodType" 
              value={formData.bloodType}
              onChange={handleInputChange}
              required
            >
              {BLOOD_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'organ':
        return (
          <div className="form-group">
            <label htmlFor="organType">Organ Type</label>
            <select 
              id="organType" 
              name="organType" 
              value={formData.organType}
              onChange={handleInputChange}
              required
            >
              {ORGAN_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  // Same JSX return statement as before, only handleSubmit has changed
  return (
    <div className="lifeline-donate">
      <div className="donate-header">
        <h2>Request</h2>
        <p>Please provide details about what you need</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Rest of the form remains the same */}
        <div className="donation-form-container">
          <div className="form-section">
            <h3>Donation Category</h3>
            <div className="donate-types">
              {donationCategories.map((category) => (
                <button 
                  type="button"
                  key={category.id}
                  className={`donate-type-btn ${formData.category === category.id ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  <span className="donate-type-icon">{category.icon}</span>
                  <span className="donate-type-label">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Request Details</h3>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                placeholder="Brief title for your request"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {renderCategorySpecificFields()}

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                name="description" 
                placeholder="Please provide details about your donation request"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="urgency">Urgency Level</label>
                <select 
                  id="urgency" 
                  name="urgency" 
                  value={formData.urgency}
                  onChange={handleInputChange}
                  required
                >
                  {URGENCY_CHOICES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">
                  <FaMapMarkerAlt className="form-icon" /> Location
                </label>
                <select 
                  id="location" 
                  name="location" 
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a location</option>
                  {LOCATION_CHOICES.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.location === 'other' && (
              <div className="form-group">
                <label htmlFor="otherLocation">Specify Other Location</label>
                <input 
                  type="text" 
                  id="otherLocation" 
                  name="otherLocation" 
                  placeholder="Enter location details"
                  value={formData.otherLocation || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
          </div>

          {formData.category === 'blood' && (
            <div className="donation-info-box">
              <FaInfoCircle className="info-icon" />
              <div>
                <h4>Blood Donation Information</h4>
                <p>Please specify the blood type needed. For rare blood types, requests may be prioritized based on availability.</p>
              </div>
            </div>
          )}

          {formData.category === 'organ' && (
            <div className="donation-info-box">
              <FaInfoCircle className="info-icon" />
              <div>
                <h4>Organ Donation Information</h4>
                <p>Organ donation requests require additional medical verification. Our medical team will contact you for further information after submission.</p>
              </div>
            </div>
          )}

          <div className="form-submit">
            <button type="submit" className="donation-submit-btn">Submit Request</button>
          </div>
        </div>
      </form>

      <div className="donation-impact">
        <h3>Our Impact</h3>
        <div className="impact-stats">
          <div className="impact-stat">
            <h4>1,245</h4>
            <p>Donations Received</p>
          </div>
          <div className="impact-stat">
            <h4>5,782</h4>
            <p>People Helped</p>
          </div>
          <div className="impact-stat">
            <h4>867</h4>
            <p>Active Volunteers</p>
          </div>
          <div className="impact-stat">
            <h4>98%</h4>
            <p>Request Fulfillment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeLineRequest;