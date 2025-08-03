import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../services/socketService';
import './ChatPopup.css';

const ChatPopup = ({ isOpen, onClose }) => {
  const { name, role } = useSelector((state) => state.user);
  const { students } = useSelector((state) => state.user);
  
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [studentsWithIds, setStudentsWithIds] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]); // New state for all participants
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Get chat history when popup opens
      socketService.socket?.emit('get-chat-history');
      
      // Get participants list for both teachers and students
      socketService.socket?.emit('get-students-with-ids');
      
      // Listen for new messages
      const handleNewMessage = (messageData) => {
        setMessages(prev => [...prev, messageData]);
      };
      
      const handleChatHistory = (history) => {
        setMessages(history);
      };
      
      const handleChatCleared = () => {
        setMessages([]);
      };

      const handleStudentsWithIds = (studentsData) => {
        setStudentsWithIds(studentsData);
        // Set all participants for both teacher and student views
        setAllParticipants(studentsData);
      };
      
      socketService.socket?.on('new-message', handleNewMessage);
      socketService.socket?.on('chat-history', handleChatHistory);
      socketService.socket?.on('chat-cleared', handleChatCleared);
      socketService.socket?.on('students-with-ids', handleStudentsWithIds);
      
      return () => {
        socketService.socket?.off('new-message', handleNewMessage);
        socketService.socket?.off('chat-history', handleChatHistory);
        socketService.socket?.off('chat-cleared', handleChatCleared);
        socketService.socket?.off('students-with-ids', handleStudentsWithIds);
      };
    }
  }, [isOpen, role]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && name) {
      const messageData = {
        name: name,
        message: message.trim(),
        role: role
      };
      
      socketService.socket?.emit('send-message', messageData);
      setMessage('');
    }
  };

  const handleClearChat = () => {
    if (role === 'teacher') {
      socketService.socket?.emit('clear-chat');
    }
  };

  const handleKickStudent = (studentSocketId, studentName) => {
    if (role === 'teacher' && window.confirm(`Are you sure you want to kick out ${studentName}?`)) {
      socketService.socket?.emit('kick-student', studentSocketId);
      // Remove from local state immediately for better UX
      setStudentsWithIds(prev => prev.filter(s => s.socketId !== studentSocketId));
      setAllParticipants(prev => prev.filter(s => s.socketId !== studentSocketId));
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="chat-overlay">
      <div className="chat-popup">
        <div className="chat-header">
          <div className="chat-tabs">
            <button
              className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`tab-btn ${activeTab === 'participants' ? 'active' : ''}`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="chat-content">
          {activeTab === 'chat' ? (
            <>
              <div className="chat-messages">
                {messages.length === 0 ? (
                  <div className="no-messages">
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`message ${msg.name === name ? 'own-message' : 'other-message'}`}
                    >
                      <div className="message-header">
                        <span className="sender-name">{msg.name}</span>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <div className="chat-input-container">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hey There, how can I help?"
                    className="chat-input"
                    maxLength={500}
                  />
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={!message.trim()}
                  >
                    <span className="send-icon">➤</span>
                  </button>
                </div>
              </form>

              {role === 'teacher' && messages.length > 0 && (
                <button className="clear-chat-btn" onClick={handleClearChat}>
                  Clear Chat
                </button>
              )}
            </>
          ) : (
            <div className="participants-list">
              <div className="participants-header">
                <h3>Name</h3>
                {role === 'teacher' && <h3>Action</h3>}
              </div>
              <div className="participants-content">
                {/* Show current user first with (You) indicator */}
                <div className={`participant-item current-user ${role === 'teacher' ? 'teacher-item' : ''}`}>
                  <div className="participant-info-container">
                    <div className={`participant-avatar ${role === 'teacher' ? 'teacher-avatar' : ''}`}>
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div className="participant-info">
                      <span className="participant-name">{name} (You)</span>
                      <span className="participant-role">{role === 'teacher' ? 'Teacher' : 'Student'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Show all other participants */}
                {allParticipants
                  .filter(participant => participant.name !== name) // Exclude current user
                  .map((participant) => (
                    <div key={participant.socketId} className="participant-item">
                      <div className="participant-info-container">
                        <div className="participant-avatar">
                          {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="participant-info">
                          <span className="participant-name">{participant.name}</span>
                          <span className="participant-role">Student</span>
                        </div>
                      </div>
                      {role === 'teacher' && (
                        <button 
                          className="kick-out-btn"
                          onClick={() => handleKickStudent(participant.socketId, participant.name)}
                          title={`Kick out ${participant.name}`}
                        >
                          Kick out
                        </button>
                      )}
                    </div>
                  ))}
                
                {allParticipants.length === 0 && (
                  <div className="no-participants">
                    <p>No other participants connected yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
