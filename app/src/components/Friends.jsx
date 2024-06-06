import React, { useState, useEffect, useRef } from 'react';
import logic from '../logic';
import './Friends.css';
import { format } from 'date-fns';

function Friends({ show, onClose }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [showFriendRequestForm, setShowFriendRequestForm] = useState(false);
    const [showPendingFriendRequests, setShowPendingFriendRequests] = useState(false);
    const [friendRequest, setFriendRequest] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const senderId = logic.decryptToken(sessionStorage.getItem('token')).sub;
    const chatWindowRef = useRef(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const result = await logic.retrieveFriends();
                setFriends(result);
            } catch (error) {
                alert(error.message);
            }
        };

        if (show) {
            fetchFriends();
        }
    }, [show]);

    useEffect(() => {
        let interval;
        if (selectedFriend) {
            interval = setInterval(async () => {
                try {
                    const messages = await logic.retrieveMessages(senderId, selectedFriend);
                    setMessages(messages);
                } catch (error) {
                    console.error('Failed to retrieve messages:', error);
                }
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [selectedFriend, senderId]);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim() !== '' && selectedFriend) {
            try {
                await logic.sendMessage(senderId, selectedFriend, message);
                setMessages([...messages, { text: message, sender: senderId, sentAt: new Date() }]);
                setMessage('');
            } catch (error) {
                alert(`Failed to send message: ${error.message}`);
            }
        }
    };

    const handleSendFriendRequest = () => {
        setShowFriendRequestForm(true);
        setShowPendingFriendRequests(false);
    };

    const handlePendingFriendRequest = async () => {
        try {
            const pendingRequests = await logic.retrievePendingFriendRequests();
            setPendingRequests(Array.isArray(pendingRequests) ? pendingRequests : []);
            setShowPendingFriendRequests(true);
            setShowFriendRequestForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleFriendRequestSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await logic.sendFriendRequest(friendRequest);
            setFriendRequest('');
            setShowFriendRequestForm(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleAcceptRequest = async (senderId) => {
        try {
            await logic.acceptFriendRequest(senderId);
            alert(`Friend request from ${senderId} accepted`);
            handlePendingFriendRequest();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRejectRequest = async (senderId) => {
        try {
            await logic.rejectFriendRequest(senderId);
            alert(`Friend request from ${senderId} rejected`);
            handlePendingFriendRequest();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleChatWithFriend = async (friendId) => {
        try {
            const messages = await logic.retrieveMessages(senderId, friendId);
            setMessages(messages);
            setSelectedFriend(friendId);
        } catch (error) {
            alert(`Failed to retrieve messages: ${error.message}`);
        }
    };

    const formatSentAt = (dateString) => {
        return format(new Date(dateString), 'HH:mm');
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="chat-header">
                    <span>😊 Chat</span>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="friends-header">
                    <button onClick={() => setShowFriendRequestForm(false)}>Chat</button>
                    <button onClick={handleSendFriendRequest}>Send friend request</button>
                    <button onClick={handlePendingFriendRequest}>Pending request</button>
                </div>
                <div className="chat-body">
                    <div className="friends-list">
                        <ul>
                            {friends.map((friend, index) => (
                                <li key={index} onClick={() => handleChatWithFriend(friend.id)}>{friend.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="chat-window" ref={chatWindowRef}>
                        {showFriendRequestForm ? (
                            <form onSubmit={handleFriendRequestSubmit} className="friend-request-form">
                                <input 
                                    type="email" 
                                    value={friendRequest} 
                                    onChange={(e) => setFriendRequest(e.target.value)} 
                                    className="friend-input" 
                                    placeholder="Enter friend's email"
                                />
                                <button type="submit" className="friend-submit-btn">Send</button>
                            </form>
                        ) : showPendingFriendRequests ? (
                            pendingRequests.map((request, index) => (
                                <div key={index} className="chat-message">
                                    {request.name} wants to be your friend.
                                    <button onClick={() => handleAcceptRequest(request.senderId)}>Accept</button>
                                    <button onClick={() => handleRejectRequest(request.senderId)}>Reject</button>
                                </div>
                            ))
                        ) : (
                            messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`chat-message ${msg.sender === senderId ? 'sent-message' : 'received-message'}`}
                                >
                                    {msg.text}
                                    <span className="date-chat">{formatSentAt(msg.sentAt)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {selectedFriend && (
                    <div className="chat-footer">
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            className="chat-input" 
                            placeholder="Type a message"
                        />
                        <button onClick={handleSendMessage} className="send-btn">Send</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Friends;
