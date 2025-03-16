import React, { useState, useEffect } from 'react';
import '../Styles/LifeLineFeed.css';
import { FaHeart, FaComment, FaShare, FaBookmark, FaHandHoldingHeart, FaMapMarkerAlt, FaRegClock, FaTag, FaFilter, FaUserCircle } from 'react-icons/fa'; // Added FaUserCircle
import axios from 'axios';
import Connect from './Connect';

const LifeLineFeed = () => {
  const [posts, setPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFeedId, setSelectedFeedId] = useState(null);

  const filterCategories = [
    { id: 'all', label: 'All', icon: <FaFilter /> },
    { id: 'blood', label: 'Blood', icon: <FaHeart /> },
    { id: 'organ', label: 'Organ', icon: <FaHeart /> },
    { id: 'food', label: 'Food', icon: <FaHandHoldingHeart /> },
    { id: 'clothing', label: 'Clothing', icon: <FaHandHoldingHeart /> },
    { id: 'cash', label: 'Financial', icon: <FaHandHoldingHeart /> }
  ];

  useEffect(() => {
    const fetchPendingFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:8000/app1/pending-feeds/', {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const mappedPosts = response.data.map(feed => ({
          id: feed.id,
          type: feed.type,
          category: feed.category.toLowerCase(),
          urgency: feed.urgency,
          user: {
            name: feed.user.userName,
            // Removed avatar image URL, using icon instead
            verified: feed.user.status === 'Active'
          },
          timePosted: new Date(feed.time_posted).toLocaleString(),
          location: feed.location,
          title: feed.title,
          content: feed.content,
          likes: 0,
          comments: 0,
          shares: 0,
          saved: false,
          liked: false
        }));
        setPosts(mappedPosts);
        console.log("Fetched posts:", mappedPosts);
      } catch (err) {
        setError(err.response ? err.response.data : err.message);
        console.error("Error fetching feeds:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingFeeds();
  }, []);

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeFilter);

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked } 
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, saved: !post.saved } 
        : post
    ));
  };

  const handleOpenModal = (feedId) => {
    setSelectedFeedId(feedId);
    setModalOpen(true);
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency) {
      case 'critical': return 'urgency-critical';
      case 'urgent': return 'urgency-urgent';
      case 'high': return 'urgency-high';
      default: return 'urgency-standard';
    }
  };

  const getCategoryIcon = (category) => {
    const foundCategory = filterCategories.find(cat => cat.id === category);
    return foundCategory ? foundCategory.icon : <FaTag />;
  };

  return (
    <div className="lifeline-feed">
      <div className="feed-header">
        <h2>Community Feed</h2>
        <div className="feed-filters">
          {filterCategories.map(category => (
            <button 
              key={category.id}
              className={`filter-btn ${activeFilter === category.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.id)}
            >
              <span className="filter-icon">{category.icon}</span>
              <span className="filter-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="post-create">
        <div className="post-input">
          {/* Replace img with icon */}
          <FaUserCircle className="user-avatar-icon" />
          <input 
            type="text" 
            placeholder="Share a request or donation offer..." 
            className="create-input"
          />
        </div>
        <div className="post-actions">
          <button className="post-btn request">Request Help</button>
          <button className="post-btn donate">Offer Donation</button>
        </div>
      </div>

      <div className="feed-posts">
        {loading ? (
          <div className="loading">
            <h3>Loading feeds...</h3>
          </div>
        ) : error ? (
          <div className="error">
            <h3>Error loading feeds</h3>
            <p>{JSON.stringify(error)}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <div key={post.id} className={`post-card ${post.type}`}>
              <div className="post-header">
                <div className="post-user">
                  {/* Replace img with icon */}
                  <FaUserCircle className="user-avatar-icon" />
                  <div className="user-info">
                    <h4>{post.user.name} {post.user.verified && <span className="verified-badge">✓</span>}</h4>
                    <div className="post-meta">
                      <span className="post-time"><FaRegClock /> {post.timePosted}</span>
                      <span className="post-location"><FaMapMarkerAlt /> {post.location}</span>
                    </div>
                  </div>
                </div>
                <div className="post-type-badge">
                  <span className={`type-indicator ${post.type}`}>
                    {post.type === 'request' ? 'Requesting' : 'Donating'}
                  </span>
                  <span className={`category-badge ${post.category}`}>
                    {getCategoryIcon(post.category)} {post.category}
                  </span>
                </div>
              </div>

              <div className="post-content">
                <h3 className="post-title">
                  <span className={`urgency-badge ${getUrgencyClass(post.urgency)}`}>
                    {post.urgency.toUpperCase()}
                  </span>
                  {post.title}
                </h3>
                <p>{post.content}</p>
              </div>

              <div className="post-footer">
                <button 
                  className={`post-action ${post.liked ? 'active' : ''}`}
                  onClick={() => handleLike(post.id)}
                >
                  <FaHeart /> <span>{post.likes}</span>
                </button>
                <button className="post-action">
                  <FaComment /> <span>{post.comments}</span>
                </button>
                <button className="post-action">
                  <FaShare /> <span>{post.shares}</span>
                </button>
                <button 
                  className={`post-action save ${post.saved ? 'active' : ''}`}
                  onClick={() => handleSave(post.id)}
                >
                  <FaBookmark />
                </button>
                <button 
                  className="post-action connect"
                  onClick={() => handleOpenModal(post.id)}
                >
                  Connect
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-posts">
            <h3>No pending posts available</h3>
            <p>Try selecting a different category or check back later</p>
          </div>
        )}
      </div>

      <Connect 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        id={selectedFeedId} 
      />
    </div>
  );
};

export default LifeLineFeed;