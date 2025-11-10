// const Ride = require('../models/Ride');
// const User = require('../models/User');

// // Helper function to call Gemini API directly
// async function callGeminiAPI(prompt) {
//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: prompt
//             }]
//           }]
//         })
//       }
//     );

//     const data = await response.json();
    
//     if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
//       return data.candidates[0].content.parts[0].text;
//     }
    
//     throw new Error('Invalid response from Gemini API');
//   } catch (error) {
//     console.error('Error calling Gemini API:', error);
//     throw error;
//   }
// }

// // Helper function to extract location info using Gemini
// async function extractLocationsFromQuery(userMessage) {
//   const prompt = `You are a location extraction assistant. Extract the start location and end location from this user query about finding a ride.

// User Query: "${userMessage}"

// Response format (JSON only, no extra text):
// {
//   "startLocation": "location name or null",
//   "endLocation": "location name or null",
//   "intent": "find_ride" or "other"
// }

// Examples:
// - "Find rides from Koramangala to Whitefield" → {"startLocation": "Koramangala", "endLocation": "Whitefield", "intent": "find_ride"}
// - "Any rides to BTM Layout" → {"startLocation": null, "endLocation": "BTM Layout", "intent": "find_ride"}
// - "Show rides from Electronic City" → {"startLocation": "Electronic City", "endLocation": null, "intent": "find_ride"}
// - "Are there any rides available today from koramangala to whitefield?" → {"startLocation": "Koramangala", "endLocation": "Whitefield", "intent": "find_ride"}
// - "Hello" → {"startLocation": null, "endLocation": null, "intent": "other"}

// IMPORTANT: Return ONLY the JSON object, nothing else.`;

//   try {
//     const response = await callGeminiAPI(prompt);
    
//     // Extract JSON from response
//     const jsonMatch = response.match(/\{[\s\S]*\}/);
//     if (jsonMatch) {
//       const parsed = JSON.parse(jsonMatch[0]);
//       // Normalize null strings to actual null
//       if (parsed.startLocation === 'null') parsed.startLocation = null;
//       if (parsed.endLocation === 'null') parsed.endLocation = null;
//       return parsed;
//     }
    
//     return { startLocation: null, endLocation: null, intent: 'other' };
//   } catch (error) {
//     console.error('Error extracting locations:', error);
//     return { startLocation: null, endLocation: null, intent: 'other' };
//   }
// }

// // Helper function to search rides in database
// async function searchRides(startLocation, endLocation) {
//   try {
//     const query = {
//       status: 'active',
//       departureTime: { $gte: new Date() } // Only future rides
//     };

//     // Build location query
//     if (startLocation && endLocation) {
//       query.$and = [
//         { 'route.start.address': { $regex: startLocation, $options: 'i' } },
//         { 'route.end.address': { $regex: endLocation, $options: 'i' } }
//       ];
//     } else if (startLocation) {
//       query['route.start.address'] = { $regex: startLocation, $options: 'i' };
//     } else if (endLocation) {
//       query['route.end.address'] = { $regex: endLocation, $options: 'i' };
//     }

//     console.log('🔍 Database Query:', JSON.stringify(query, null, 2));

//     const rides = await Ride.find(query)
//       .populate('driver', 'name profilePicture rating')
//       .limit(5)
//       .sort({ departureTime: 1 });

//     return rides;
//   } catch (error) {
//     console.error('Error searching rides:', error);
//     return [];
//   }
// }

// // Main chatbot handler
// exports.chat = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const userId = req.user.id;

//     if (!message || message.trim() === '') {
//       return res.status(400).json({ error: 'Message is required' });
//     }

//     console.log(`\n🤖 Chatbot Query from User ${userId}: "${message}"`);

//     // Extract locations using Gemini AI
//     const extracted = await extractLocationsFromQuery(message);
//     console.log('📍 Extracted:', extracted);

//     let responseText = '';
//     let rides = [];
//     let suggestions = [];

//     // Handle different intents
//     if (extracted.intent === 'find_ride' && (extracted.startLocation || extracted.endLocation)) {
//       // Search for rides
//       rides = await searchRides(extracted.startLocation, extracted.endLocation);
//       console.log(`🚗 Found ${rides.length} rides`);

//       if (rides.length > 0) {
//         const locations = extracted.startLocation && extracted.endLocation
//           ? `from ${extracted.startLocation} to ${extracted.endLocation}`
//           : extracted.startLocation
//           ? `from ${extracted.startLocation}`
//           : `to ${extracted.endLocation}`;

//         responseText = `Great! I found ${rides.length} available ride${rides.length > 1 ? 's' : ''} ${locations}. Check them out below! 🚗`;
        
//         suggestions = [
//           'Show ride details',
//           'Find different route',
//           'Create a ride'
//         ];
//       } else {
//         const locations = extracted.startLocation && extracted.endLocation
//           ? `from ${extracted.startLocation} to ${extracted.endLocation}`
//           : extracted.startLocation
//           ? `from ${extracted.startLocation}`
//           : extracted.endLocation
//           ? `to ${extracted.endLocation}`
//           : 'for your query';

//         responseText = `Unfortunately, no rides are available right now ${locations}. You can try creating a ride or checking other locations that may have more options available. Would you like me to suggest some alternatives?`;
        
//         suggestions = [
//           'Try different location',
//           'Create a ride',
//           'Popular routes'
//         ];
//       }
//     } else if (message.toLowerCase().includes('stats') || message.toLowerCase().includes('statistics')) {
//       // Get user stats
//       const user = await User.findById(userId);
//       responseText = `📊 Your EcoRide Stats:\n\n🚗 Rides Offered: ${user.ridesOffered || 0}\n🎒 Rides Taken: ${user.ridesTaken || 0}\n🌱 CO₂ Saved: ${user.carbonSaved || 0} kg\n💰 Money Saved: ₹${user.moneySaved || 0}`;
//       suggestions = ['Find a ride', 'View my rides', 'Help me'];
//     } else if (message.toLowerCase().includes('help')) {
//       responseText = `I'm your EcoRide assistant! I can help you:\n\n🔍 Find rides by location\n📊 Check your statistics\n🚗 View your rides\n📍 Suggest popular routes\n\nJust ask me anything like "Find rides from Koramangala to Whitefield"!`;
//       suggestions = ['Find a ride', 'Show my stats', 'Popular routes'];
//     } else {
//       // General greeting or unknown query
//       responseText = `Hello! I'm your EcoRide assistant. I can help you find rides, check your stats, or answer questions about carpooling. What would you like to do?`;
//       suggestions = ['Find a ride', 'Show my stats', 'View my rides', 'Help me'];
//     }

//     // Format rides data for frontend
//     const ridesData = rides.map(ride => ({
//       id: ride._id,
//       driver: {
//         name: ride.driver?.name || 'Unknown',
//         profilePicture: ride.driver?.profilePicture || '',
//         rating: ride.driver?.rating || 0
//       },
//       route: {
//         start: ride.route.start.address,
//         end: ride.route.end.address
//       },
//       departureTime: ride.departureTime,
//       availableSeats: ride.availableSeats,
//       pricePerSeat: ride.pricePerSeat,
//       vehicleDetails: ride.vehicleDetails
//     }));

//     res.json({
//       response: responseText,
//       rides: ridesData,
//       suggestions: suggestions
//     });

//   } catch (error) {
//     console.error('❌ Chatbot Error:', error);
//     res.status(500).json({ 
//       error: 'Sorry, I encountered an error. Please try again.',
//       suggestions: ['Find a ride', 'Show my stats', 'Help me']
//     });
//   }
// };