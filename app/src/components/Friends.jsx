import React, { useState } from 'react';
import logic from '../logic';
import './Friends.css';

function Friends({ show, onClose }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [showFriendRequestForm, setShowFriendRequestForm] = useState(false);
    const [friendRequest, setFriendRequest] = useState('');

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            setMessages([...messages, message]);
            setMessage('');
        }
    };

    const handleSendFriendRequest = () => {
        setShowFriendRequestForm(true);
    }

    const handleFriendRequestSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await logic.sendFriendRequest(friendRequest); 
            alert(`La id es: ${result}`);
            setFriendRequest('');
            setShowFriendRequestForm(false);
        } catch (error) {
            alert(error.message);
        }
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
                <div className="chat-body">
                    <div className="friends-list">
                        <span>Online friends</span>
                    </div>
                    <div className="friends-header">
                        <button>Chat</button>
                        <button onClick={handleSendFriendRequest}>Send friend request</button>
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
                        ) : (
                            messages.map((msg, index) => (
                                <div key={index} className="chat-message">{msg}</div>
                            ))
                        )}
                    </div>
                </div>
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
            </div>
        </div>
    );
}

export default Friends;
