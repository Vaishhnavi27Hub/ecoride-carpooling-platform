// Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate bearing between two points
function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  
  let bearing = Math.atan2(y, x);
  bearing = (bearing * 180 / Math.PI + 360) % 360;
  return bearing;
}

// Convert route to vector for cosine similarity
function routeToVector(route) {
  const startLat = route.startLocation.coordinates.latitude;
  const startLon = route.startLocation.coordinates.longitude;
  const endLat = route.endLocation.coordinates.latitude;
  const endLon = route.endLocation.coordinates.longitude;
  
  const distance = calculateDistance(startLat, startLon, endLat, endLon);
  const bearing = calculateBearing(startLat, startLon, endLat, endLon);
  
  return [
    startLat / 90,
    startLon / 180,
    endLat / 90,
    endLon / 180,
    distance / 100,
    bearing / 360
  ];
}

// Calculate cosine similarity between two routes
function cosineSimilarity(routeA, routeB) {
  const vectorA = routeToVector(routeA);
  const vectorB = routeToVector(routeB);
  
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

// Calculate time compatibility score
function timeCompatibilityScore(time1, time2, flexibilityMinutes = 30) {
  const diff = Math.abs(new Date(time1) - new Date(time2)) / (1000 * 60); // in minutes
  
  if (diff <= flexibilityMinutes) {
    return 1 - (diff / flexibilityMinutes);
  }
  return 0;
}

// Calculate user preference compatibility
function calculatePreferenceScore(riderPreferences, driverPreferences) {
  let score = 0.5; // Base score
  
  // Music preference
  if (riderPreferences.musicPreference === driverPreferences.musicPreference ||
      riderPreferences.musicPreference === 'Any' ||
      driverPreferences.musicPreference === 'Any') {
    score += 0.15;
  }
  
  // Smoking
  if (riderPreferences.smokingTolerance === driverPreferences.smokingAllowed) {
    score += 0.15;
  } else if (riderPreferences.smokingTolerance && !driverPreferences.smokingAllowed) {
    score += 0.1; // Slightly compatible
  } else if (!riderPreferences.smokingTolerance && driverPreferences.smokingAllowed) {
    score -= 0.2; // Not compatible
  }
  
  // Pets
  if (riderPreferences.petsAllowed === driverPreferences.petsAllowed) {
    score += 0.1;
  }
  
  return Math.max(0, Math.min(1, score));
}

// Main matching algorithm
function calculateMatchScore(riderRoute, riderTime, riderPreferences, ride, weights = {
  distance: 0.3,
  routeSimilarity: 0.35,
  timeCompatibility: 0.25,
  userPreferences: 0.1
}) {
  // 1. Calculate pickup distance
  const pickupDistance = calculateDistance(
    riderRoute.startLocation.coordinates.latitude,
    riderRoute.startLocation.coordinates.longitude,
    ride.route.startLocation.coordinates.latitude,
    ride.route.startLocation.coordinates.longitude
  );
  
  // Normalize distance score
  const maxAcceptableDistance = 5; // km
  const distanceScore = Math.max(0, 1 - (pickupDistance / maxAcceptableDistance));
  
  // 2. Calculate route similarity
  const routeSimilarityScore = cosineSimilarity(riderRoute, ride.route);
  
  // 3. Calculate time compatibility
  const timeScore = timeCompatibilityScore(
    riderTime,
    ride.schedule.departureTime,
    ride.schedule.flexibilityMinutes
  );
  
  // 4. Calculate preference compatibility
  const preferenceScore = calculatePreferenceScore(riderPreferences, ride.preferences);
  
  // 5. Calculate composite score
  const compositeScore = 
    distanceScore * weights.distance +
    routeSimilarityScore * weights.routeSimilarity +
    timeScore * weights.timeCompatibility +
    preferenceScore * weights.userPreferences;
  
  return {
    score: compositeScore,
    breakdown: {
      distanceScore,
      pickupDistance: pickupDistance.toFixed(2),
      routeSimilarityScore: routeSimilarityScore.toFixed(2),
      timeScore: timeScore.toFixed(2),
      preferenceScore: preferenceScore.toFixed(2)
    }
  };
}

// Find best matches for a rider
async function findBestMatches(riderData, availableRides, minScore = 0.5, limit = 10) {
  const matches = [];
  
  for (const ride of availableRides) {
    const matchResult = calculateMatchScore(
      riderData.route,
      riderData.departureTime,
      riderData.preferences,
      ride
    );
    
    if (matchResult.score >= minScore) {
      matches.push({
        ride,
        matchScore: matchResult.score,
        breakdown: matchResult.breakdown
      });
    }
  }
  
  // Sort by match score (highest first)
  matches.sort((a, b) => b.matchScore - a.matchScore);
  
  // Return top matches
  return matches.slice(0, limit);
}

module.exports = {
  calculateDistance,
  calculateBearing,
  cosineSimilarity,
  timeCompatibilityScore,
  calculateMatchScore,
  findBestMatches
};