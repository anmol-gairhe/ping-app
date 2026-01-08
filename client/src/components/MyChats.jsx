import { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import "./MyChats.css";

const MyChats = () => {
    const [loggedUser, setLoggedUser] = useState();
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            alert("Error Occurred! Failed to Load the chats");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, []);

    const getSender = (loggedUser, users) => {
        return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
    };

    return (
        <div className={`my-chats ${selectedChat ? "hidden-mobile" : ""}`}>
            <div className="my-chats-header">
                <h3>My Chats</h3>
                <button className="btn btn-primary btn-sm">
                    New Group +
                </button>
            </div>

            <div className="chats-list">
                {chats ? (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            className={`chat-item ${selectedChat === chat ? "active" : ""
                                }`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="chat-info">
                                <div className="chat-name">
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </div>
                                {chat.latestMessage && (
                                    <div className="chat-message">
                                        <span className="message-sender">
                                            {chat.latestMessage.sender.name}:
                                        </span>{" "}
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="loading">Loading...</div>
                )}
            </div>
        </div>
    );
};

export default MyChats;
