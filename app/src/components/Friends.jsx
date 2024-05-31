import React, { useState, useEffect } from 'react';
import logic from '../logic';
import './Friends.css';

function Friends({ show, onClose }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [showFriendRequestForm, setShowFriendRequestForm] = useState(false);
    const [showPendingFriendRequests, setShowPendingFriendRequests] = useState(false);
    const [chat, setChat] = useState(false);
    const [friendRequest, setFriendRequest] = useState('');
    const [pendingRequests, setPendingRequests] = useState([]);
    const [friends, setFriends] = useState([]);

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

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            setMessages([...messages, message]);
            setMessage('');
        }
    };

    const handleSendFriendRequest = () => {
        setShowFriendRequestForm(true);
        setShowPendingFriendRequests(false);
        setChat(false);
    };

    const handlePendingFriendRequest = async () => {
        try {
            const pendingRequests = await logic.retrievePendingFriendRequests();
            setPendingRequests(Array.isArray(pendingRequests) ? pendingRequests : []);
            setShowPendingFriendRequests(true);
            setShowFriendRequestForm(false);
            setChat(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleChatMenu = () => {
        setShowFriendRequestForm(false);
        setShowPendingFriendRequests(false);
        setChat(true);
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

    const handleOpenConversation = async (id) => {
        alert(id)
    }

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
                    <button onClick={handleChatMenu}>Chat</button>
                    <button onClick={handleSendFriendRequest}>Send friend request</button>
                    <button onClick={handlePendingFriendRequest}>Pending request</button>
                </div>
                <div className="chat-body">
                    <div className="friends-list">
                        <ul>
                            {friends.map((friend, index) => (
                                <li onClick={handleOpenConversation(friend.id)} key={index}>{friend.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="chat-window">
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
                                    {request.senderId} wants to be your friend.
                                    <button onClick={() => handleAcceptRequest(request.senderId)}>Accept</button>
                                    <button onClick={() => handleRejectRequest(request.senderId)}>Reject</button>
                                </div>
                            ))
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="chat-message">{msg}</div>
                            ))
                        )}
                    </div>
                </div>
                {chat && (
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
