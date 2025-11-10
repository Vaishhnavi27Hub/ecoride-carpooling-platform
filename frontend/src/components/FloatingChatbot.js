// import React, { useState, useEffect, useRef } from 'react';
// import { FaRobot, FaPaperPlane, FaTimes, FaUser } from 'react-icons/fa';

// const FloatingChatbot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [hasNewMessage, setHasNewMessage] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Auto-scroll to bottom
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Initial greeting when chatbot is opened for the first time
//   useEffect(() => {
//     if (isOpen && messages.length === 0) {
//       const user = JSON.parse(localStorage.getItem('user'));
//       const userName = user?.name || 'there';
      
//       setMessages([
//         {
//           text: `Hey ${userName}! 👋 I'm your EcoRide assistant. How can I help you today?`,
//           sender: 'bot',
//           timestamp: new Date(),
//           suggestions: [
//             "Find a ride",
//             "Show my stats",
//             "Popular routes",
//             "Help"
//           ]
//         }
//       ]);
//     }
//   }, [isOpen, messages.length]);

//   // Send message to chatbot
//   const handleSendMessage = async (message) => {
//     const messageToSend = message || inputMessage;
    
//     if (!messageToSend || !messageToSend.trim()) {
//       return;
//     }
    
//     // Add user message to chat
//     const userMessage = {
//       text: messageToSend,
//       sender: 'user',
//       timestamp: new Date()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:5000/api/chatbot/message', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({ message: messageToSend })
//       });

//       const data = await response.json();

//       if (data.success) {
//         const botMessage = {
//           text: data.message,
//           sender: 'bot',
//           timestamp: new Date(),
//           suggestions: data.suggestions
//         };
        
//         setMessages(prev => [...prev, botMessage]);
        
//         // Show notification if chatbot is closed
//         if (!isOpen) {
//           setHasNewMessage(true);
//         }
//       }
//     } catch (error) {
//       console.error('Chatbot error:', error);
      
//       const errorMessage = {
//         text: "Sorry, I'm having trouble connecting. Please try again! 😕",
//         sender: 'bot',
//         timestamp: new Date()
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle suggestion click
//   const handleSuggestionClick = (suggestion) => {
//     if (suggestion && suggestion.trim()) {
//       handleSendMessage(suggestion);
//     }
//   };

//   // Handle Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       if (inputMessage && inputMessage.trim()) {
//         handleSendMessage(inputMessage);
//       }
//     }
//   };

//   // Toggle chatbot
//   const toggleChatbot = () => {
//     setIsOpen(!isOpen);
//     if (!isOpen) {
//       setHasNewMessage(false);
//     }
//   };

//   return (
//     <>
//       {/* Floating Chat Widget */}
//       {isOpen && (
//         <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slideUp">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-t-2xl p-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="bg-white p-2 rounded-full">
//                 <FaRobot className="text-green-600 text-xl" />
//               </div>
//               <div>
//                 <h3 className="text-white font-bold">EcoRide Assistant</h3>
//                 <p className="text-white text-xs opacity-90">Online</p>
//               </div>
//             </div>
//             <button
//               onClick={toggleChatbot}
//               className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
//             >
//               <FaTimes className="text-xl" />
//             </button>
//           </div>

//           {/* Messages Container */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
//             {messages.map((message, index) => (
//               <div key={index}>
//                 {/* Message Bubble */}
//                 <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
//                   <div className={`flex items-start gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    
//                     {/* Avatar */}
//                     <div className={`flex-shrink-0 ${
//                       message.sender === 'bot' 
//                         ? 'bg-gradient-to-r from-green-500 to-blue-500' 
//                         : 'bg-gray-600'
//                     } p-1.5 rounded-full`}>
//                       {message.sender === 'bot' ? (
//                         <FaRobot className="text-white text-xs" />
//                       ) : (
//                         <FaUser className="text-white text-xs" />
//                       )}
//                     </div>

//                     {/* Message Content */}
//                     <div>
//                       <div className={`rounded-2xl px-3 py-2 ${
//                         message.sender === 'bot'
//                           ? 'bg-white text-gray-800 shadow'
//                           : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
//                       }`}>
//                         <p className="whitespace-pre-line text-xs leading-relaxed">
//                           {message.text}
//                         </p>
//                       </div>
                      
//                       {/* Timestamp */}
//                       <p className={`text-[10px] text-gray-400 mt-1 ${
//                         message.sender === 'user' ? 'text-right' : 'text-left'
//                       }`}>
//                         {new Date(message.timestamp).toLocaleTimeString([], { 
//                           hour: '2-digit', 
//                           minute: '2-digit' 
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Suggestions */}
//                 {message.suggestions && message.suggestions.length > 0 && (
//                   <div className="flex flex-wrap gap-1.5 ml-8 mt-1">
//                     {message.suggestions.map((suggestion, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => handleSuggestionClick(suggestion)}
//                         className="px-2 py-1 bg-white border border-green-500 text-green-600 rounded-full text-[10px] font-medium hover:bg-green-500 hover:text-white transition-all"
//                       >
//                         {suggestion}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {/* Loading */}
//             {isLoading && (
//               <div className="flex justify-start">
//                 <div className="flex items-start gap-2">
//                   <div className="bg-gradient-to-r from-green-500 to-blue-500 p-1.5 rounded-full">
//                     <FaRobot className="text-white text-xs" />
//                   </div>
//                   <div className="bg-white rounded-2xl px-3 py-2 shadow">
//                     <div className="flex gap-1">
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
//                       <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-3 bg-white border-t border-gray-200 rounded-b-2xl">
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={inputMessage}
//                 onChange={(e) => setInputMessage(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type your message..."
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-green-500 transition-colors"
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={() => handleSendMessage(inputMessage)}
//                 disabled={isLoading || !inputMessage || !inputMessage.trim()}
//                 className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 rounded-full hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaPaperPlane className="text-sm" />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Floating Button */}
//       <button
//         onClick={toggleChatbot}
//         className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 z-50 group"
//       >
//         {isOpen ? (
//           <FaTimes className="text-2xl" />
//         ) : (
//           <>
//             <FaRobot className="text-2xl animate-bounce" />
//             {hasNewMessage && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
//                 1
//               </span>
//             )}
//           </>
//         )}
        
//         {/* Tooltip */}
//         {!isOpen && (
//           <span className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//             Ask AI Assistant
//           </span>
//         )}
//       </button>

//       {/* Add custom animations */}
//       <style jsx>{`
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default FloatingChatbot;