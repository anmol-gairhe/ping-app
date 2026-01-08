import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { ChatState } from "../Context/ChatProvider";
import "./ChatBox.css";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const { selectedChat, user } = ChatState();

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // Notification logic here
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            alert("Error Occurred! Failed to Load the Messages");
            setLoading(false);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            event.preventDefault();
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Error Occurred! Failed to send the Message");
            }
        }
    };

    const sendMessageClick = async () => {
        if (newMessage) {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id,
                    },
                    config
                );

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                alert("Error Occurred! Failed to send the Message");
            }
        }
    };

    const getSender = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    const isSameSender = (messages, m, i, userId) => {
        return (
            i < messages.length - 1 &&
            (messages[i + 1].sender._id !== m.sender._id ||
                messages[i + 1].sender._id === undefined) &&
            messages[i].sender._id !== userId
        );
    };

    const isLastMessage = (messages, i, userId) => {
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].sender._id !== userId &&
            messages[messages.length - 1].sender._id
        );
    };

    const isSameSenderMargin = (messages, m, i, userId) => {
        if (
            i < messages.length - 1 &&
            messages[i + 1].sender._id === m.sender._id &&
            messages[i].sender._id !== userId
        )
            return 33;
        else if (
            (i < messages.length - 1 &&
                messages[i + 1].sender._id !== m.sender._id &&
                messages[i].sender._id !== userId) ||
            (i === messages.length - 1 && messages[i].sender._id !== userId)
        )
            return 0;
        else return "auto";
    };

    const isSameUser = (messages, m, i) => {
        return i > 0 && messages[i - 1].sender._id === m.sender._id;
    };

    return (
        <>
            {selectedChat ? (
                <div className="chat-box">
                    <div className="chat-box-header">
                        <h3>
                            {!selectedChat.isGroupChat
                                ? getSender(user, selectedChat.users)
                                : selectedChat.chatName}
                        </h3>
                    </div>

                    <div className="messages-container">
                        {loading ? (
                            <div className="loading">Loading messages...</div>
                        ) : (
                            <div className="messages">
                                {messages &&
                                    messages.map((m, i) => (
                                        <div
                                            key={m._id}
                                            className="message-wrapper"
                                            style={{
                                                display: "flex",
                                                marginBottom: isSameUser(messages, m, i) ? 3 : 10,
                                            }}
                                        >
                                            {(isSameSender(messages, m, i, user._id) ||
                                                isLastMessage(messages, i, user._id)) && (
                                                    <img
                                                        src={m.sender.pic}
                                                        alt={m.sender.name}
                                                        className="message-avatar"
                                                    />
                                                )}
                                            <div
                                                className={`message ${m.sender._id === user._id ? "own-message" : ""
                                                    }`}
                                                style={{
                                                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                                }}
                                            >
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="message-input-container">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={sendMessage}
                        />
                        <button className="btn btn-primary" onClick={sendMessageClick}>
                            Send
                        </button>
                    </div>
                </div>
            ) : (
                <div className="no-chat-selected">
                    <div className="no-chat-content">
                        <div className="ping-logo">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                                <circle cx="40" cy="40" r="36" fill="url(#gradient2)" />
                                <path
                                    d="M40 20L50 30L40 40L30 30L40 20Z"
                                    fill="white"
                                    opacity="0.9"
                                />
                                <path
                                    d="M40 40L50 50L40 60L30 50L40 40Z"
                                    fill="white"
                                    opacity="0.7"
                                />
                                <defs>
                                    <linearGradient id="gradient2" x1="0" y1="0" x2="80" y2="80">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="100%" stopColor="#764ba2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h2>Welcome to Ping</h2>
                        <p>Select a chat to start messaging</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;
