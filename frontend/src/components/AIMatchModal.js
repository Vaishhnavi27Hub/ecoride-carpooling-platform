import React, { useState } from 'react';
import { FaTimes, FaRobot, FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaBolt } from 'react-icons/fa';
import api from '../services/api';

const AIMatchModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    departureDate: '',
    departureTime: '',
    seats: 1
  });
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Function to get coordinates from address using Nominatim (OpenStreetMap)
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleFindMatches = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.startLocation || !formData.endLocation || !formData.departureDate || !formData.departureTime) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setGeocoding(true);
    
    try {
      // Get coordinates for both locations
      console.log('Geocoding start location:', formData.startLocation);
      const startCoords = await getCoordinates(formData.startLocation);
      
      if (!startCoords) {
        alert('Could not find start location. Please enter a valid address like "Koramangala, Bangalore" or "MG Road, Bangalore"');
        setLoading(false);
        setGeocoding(false);
        return;
      }

      console.log('Geocoding end location:', formData.endLocation);
      const endCoords = await getCoordinates(formData.endLocation);
      
      if (!endCoords) {
        alert('Could not find end location. Please enter a valid address like "Whitefield, Bangalore" or "Electronic City, Bangalore"');
        setLoading(false);
        setGeocoding(false);
        return;
      }

      console.log('Start coordinates:', startCoords);
      console.log('End coordinates:', endCoords);

      setGeocoding(false);

      // Combine date and time
      const departureDateTime = new Date(`${formData.departureDate}T${formData.departureTime}:00`);
      
      const requestBody = {
        startLocation: {
          address: formData.startLocation,
          coordinates: startCoords
        },
        endLocation: {
          address: formData.endLocation,
          coordinates: endCoords
        },
        departureTime: departureDateTime.toISOString(),
        seats: parseInt(formData.seats)
      };

      console.log('AI Match Request:', requestBody);

      const response = await api.post('/rides/find-matches', requestBody);
      
      console.log('AI Match Response:', response.data);

      if (response.data.success) {
        setMatches(response.data.data);
        setShowResults(true);
        
        if (response.data.count === 0) {
          alert('No matching rides found. Try adjusting your search criteria or time.');
        } else {
          alert(`🎉 Found ${response.data.count} matching ride${response.data.count !== 1 ? 's' : ''}!`);
        }
      }
    } catch (error) {
      console.error('AI Match Error:', error);
      alert(error.response?.data?.message || 'Error finding matches. Please try again.');
    } finally {
      setLoading(false);
      setGeocoding(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#f59e0b'; // yellow
    if (score >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  const handleJoinRide = async (rideId) => {
    try {
      const response = await api.post(`/rides/${rideId}/join`, {
        pickupLocation: {
          address: formData.startLocation,
          coordinates: {
            latitude: 0,
            longitude: 0
          }
        },
        message: 'Found you through AI Smart Matching! Would love to join your ride.'
      });

      if (response.data.success) {
        alert('✅ Join request sent successfully! The driver will review your request.');
        // Remove the ride from matches
        setMatches(matches.filter(m => m.ride._id !== rideId));
      }
    } catch (error) {
      console.error('Join ride error:', error);
      alert(error.response?.data?.message || 'Error sending join request');
    }
  };

  const resetForm = () => {
    setFormData({
      startLocation: '',
      endLocation: '',
      departureDate: '',
      departureTime: '',
      seats: 1
    });
    setMatches([]);
    setShowResults(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <FaRobot style={styles.robotIcon} />
            <h2 style={styles.title}>AI Smart Ride Matching</h2>
          </div>
          <button onClick={handleClose} style={styles.closeButton}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {!showResults ? (
            // Search Form
            <form onSubmit={handleFindMatches} style={styles.form}>
              <div style={styles.infoBox}>
                <FaBolt style={styles.boltIcon} />
                <p style={styles.infoText}>
                  Our AI analyzes distance, time, preferences, and driver ratings to find your perfect ride match! 
                  Just enter location names - we'll handle the rest! 🚀
                </p>
              </div>

              {/* Start Location */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaMapMarkerAlt style={styles.iconGreen} />
                  Pick-up Location
                </label>
                <input
                  type="text"
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleChange}
                  placeholder="e.g., Koramangala, Bangalore or MG Road, Bangalore"
                  style={styles.input}
                  required
                />
                <p style={styles.hint}>💡 Be specific: Include area name and city for best results</p>
              </div>

              {/* End Location */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaMapMarkerAlt style={styles.iconRed} />
                  Drop-off Location
                </label>
                <input
                  type="text"
                  name="endLocation"
                  value={formData.endLocation}
                  onChange={handleChange}
                  placeholder="e.g., Whitefield, Bangalore or Electronic City, Bangalore"
                  style={styles.input}
                  required
                />
                <p style={styles.hint}>💡 Include landmarks or area names for accuracy</p>
              </div>

              {/* Date and Time */}
              <div style={styles.rowGroup}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    <FaClock style={styles.iconPurple} />
                    Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    style={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Time</label>
                  <input
                    type="time"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {/* Seats */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FaUsers style={styles.iconBlue} />
                  Number of Seats Needed
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  style={styles.input}
                  required
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                style={{
                  ...styles.submitButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }} 
                disabled={loading}
              >
                {geocoding ? (
                  <>
                    <div style={styles.spinner}></div>
                    Finding coordinates...
                  </>
                ) : loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Analyzing rides...
                  </>
                ) : (
                  <>
                    <FaRobot />
                    Find My Perfect Match
                  </>
                )}
              </button>
            </form>
          ) : (
            // Results
            <div style={styles.results}>
              <div style={styles.resultsHeader}>
                <h3 style={styles.resultsTitle}>
                  🎯 Found {matches.length} Matching Ride{matches.length !== 1 ? 's' : ''}
                </h3>
                <button onClick={resetForm} style={styles.backButton}>
                  ← New Search
                </button>
              </div>

              {matches.length === 0 ? (
                <div style={styles.noResults}>
                  <FaRobot style={styles.noResultsIcon} />
                  <p style={styles.noResultsText}>No rides match your criteria right now.</p>
                  <p style={styles.noResultsSubtext}>Try adjusting your location, time, or date preferences.</p>
                </div>
              ) : (
                <div style={styles.matchList}>
                  {matches.map((match, index) => (
                    <div key={match.ride._id} style={styles.matchCard}>
                      {/* Match Score Badge */}
                      <div 
                        style={{
                          ...styles.scoreBadge,
                          backgroundColor: getScoreColor(match.matchScore)
                        }}
                      >
                        <div style={styles.scoreNumber}>{match.matchScore}</div>
                        <div style={styles.scoreLabel}>{getScoreLabel(match.matchScore)}</div>
                      </div>

                      {/* Rank Badge */}
                      <div style={styles.rankBadge}>#{index + 1}</div>

                      {/* Driver Info */}
                      <div style={styles.driverSection}>
                        <div style={styles.driverAvatar}>
                          {match.ride.driver.name.charAt(0).toUpperCase()}
                        </div>
                        <div style={styles.driverInfo}>
                          <h4 style={styles.driverName}>{match.ride.driver.name}</h4>
                          <p style={styles.driverDept}>{match.ride.driver.department || 'XYZ Office'}</p>
                          {match.ride.driver.rating > 0 && (
                            <div style={styles.rating}>
                              <FaStar style={styles.starIcon} />
                              <span>{match.ride.driver.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Route Info */}
                      <div style={styles.routeSection}>
                        <div style={styles.routeItem}>
                          <FaMapMarkerAlt style={styles.iconGreen} />
                          <span style={styles.routeText}>{match.ride.route.startLocation.address}</span>
                        </div>
                        <div style={styles.routeLine}></div>
                        <div style={styles.routeItem}>
                          <FaMapMarkerAlt style={styles.iconRed} />
                          <span style={styles.routeText}>{match.ride.route.endLocation.address}</span>
                        </div>
                      </div>

                      {/* Ride Details */}
                      <div style={styles.detailsSection}>
                        <div style={styles.detailItem}>
                          <FaClock style={styles.detailIcon} />
                          <span>{new Date(match.ride.schedule.departureTime).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}</span>
                        </div>
                        <div style={styles.detailItem}>
                          <FaUsers style={styles.detailIcon} />
                          <span>{match.ride.availableSeats} seats available</span>
                        </div>
                        <div style={styles.detailItem}>
                          <span style={styles.priceTag}>₹{match.ride.pricePerSeat}/seat</span>
                        </div>
                      </div>

                      {/* Join Button */}
                      <button
                        onClick={() => handleJoinRide(match.ride._id)}
                        style={styles.joinButton}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
                      >
                        Send Join Request
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  robotIcon: {
    fontSize: '28px',
    color: '#ffffff',
    animation: 'pulse 2s infinite'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff'
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: '18px',
    transition: 'background 0.2s'
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  boltIcon: {
    fontSize: '24px',
    color: '#3b82f6',
    flexShrink: 0
  },
  infoText: {
    margin: 0,
    fontSize: '14px',
    color: '#1e40af',
    lineHeight: '1.5'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    outline: 'none'
  },
  hint: {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  rowGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  iconGreen: {
    color: '#10b981'
  },
  iconRed: {
    color: '#ef4444'
  },
  iconPurple: {
    color: '#8b5cf6'
  },
  iconBlue: {
    color: '#3b82f6'
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '10px',
    transition: 'all 0.2s'
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '3px solid rgba(255, 255, 255, 0.3)',
    borderTop: '3px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px'
  },
  resultsTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827'
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  noResultsIcon: {
    fontSize: '64px',
    color: '#d1d5db',
    marginBottom: '16px'
  },
  noResultsText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  },
  noResultsSubtext: {
    fontSize: '14px',
    color: '#6b7280'
  },
  matchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  matchCard: {
    position: 'relative',
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    transition: 'all 0.3s'
  },
  scoreBadge: {
    position: 'absolute',
    top: '-12px',
    right: '20px',
    borderRadius: '12px',
    padding: '8px 16px',
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  scoreNumber: {
    fontSize: '24px',
    lineHeight: '1'
  },
  scoreLabel: {
    fontSize: '11px',
    marginTop: '4px',
    opacity: 0.9
  },
  rankBadge: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    borderRadius: '8px',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '700'
  },
  driverSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px'
  },
  driverAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700'
  },
  driverInfo: {
    flex: 1
  },
  driverName: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827'
  },
  driverDept: {
    margin: '2px 0 0 0',
    fontSize: '13px',
    color: '#6b7280'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
    fontSize: '14px',
    color: '#f59e0b'
  },
  starIcon: {
    fontSize: '14px'
  },
  routeSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px'
  },
  routeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  routeLine: {
    width: '2px',
    height: '16px',
    backgroundColor: '#d1d5db',
    marginLeft: '8px'
  },
  routeText: {
    fontSize: '14px',
    color: '#374151'
  },
  detailsSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#6b7280'
  },
  detailIcon: {
    fontSize: '14px'
  },
  priceTag: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '700'
  },
  joinButton: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};

export default AIMatchModal;