import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import './Ratings.css';

const Ratings = () => {
  const [formData, setFormData] = useState({
    reviewed_user_id: '',
    rating: 5,
    comment: '',
  });
  const [userRatings, setUserRatings] = useState(null);
  const [searchUserId, setSearchUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.reviewed_user_id) {
      setError('Please enter a user ID');
      return;
    }

    try {
      await axiosInstance.post('/ratings/add', {
        ...formData,
        reviewed_user_id: parseInt(formData.reviewed_user_id),
        rating: parseInt(formData.rating),
      });
      setSuccess('Rating submitted successfully!');
      setFormData({ reviewed_user_id: '', rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  const handleSearchRatings = async (e) => {
    e.preventDefault();
    setError('');

    if (!searchUserId) {
      setError('Please enter a user ID to search');
      return;
    }

    try {
      const response = await axiosInstance.get(`/ratings/user?user_id=${searchUserId}`);
      setUserRatings(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch ratings');
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="ratings-page">
      <div className="ratings-container">
        <h1>Ratings & Reviews</h1>

        <div className="ratings-grid">
          <div className="submit-rating-section">
            <h2>Submit a Rating</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="rating-form">
              <div className="form-group">
                <label>User ID to Rate</label>
                <input
                  type="number"
                  value={formData.reviewed_user_id}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewed_user_id: e.target.value })
                  }
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rating: {formData.rating} ⭐</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="rating-slider"
                />
                <div className="rating-display">{renderStars(parseInt(formData.rating))}</div>
              </div>

              <div className="form-group">
                <label>Comment (Optional)</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>

              <button type="submit" className="submit-btn">Submit Rating</button>
            </form>
          </div>

          <div className="view-ratings-section">
            <h2>View User Ratings</h2>
            <form onSubmit={handleSearchRatings} className="search-form">
              <input
                type="number"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder="Enter user ID to view ratings"
                className="search-input"
              />
              <button type="submit" className="search-btn">Search</button>
            </form>

            {userRatings && (
              <div className="ratings-results">
                <div className="ratings-summary">
                  <h3>Average Rating</h3>
                  <div className="avg-rating">
                    <span className="rating-number">{userRatings.average_rating}</span>
                    <span className="rating-stars">
                      {renderStars(Math.round(userRatings.average_rating))}
                    </span>
                    <span className="rating-count">
                      ({userRatings.total_ratings} reviews)
                    </span>
                  </div>
                </div>

                <div className="ratings-list">
                  {userRatings.ratings.length > 0 ? (
                    userRatings.ratings.map((rating) => (
                      <div key={rating.id} className="rating-card">
                        <div className="rating-header">
                          <span className="reviewer-name">{rating.reviewer.name}</span>
                          <span className="rating-stars-small">
                            {renderStars(rating.rating)}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="rating-comment">{rating.comment}</p>
                        )}
                        <span className="rating-date">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">No ratings yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
