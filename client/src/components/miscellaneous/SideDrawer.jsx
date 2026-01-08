import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import "./SideDrawer.css";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();
    const { user, setSelectedChat, chats, setChats } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please Enter something in search");
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Error Occurred! Failed to Load the Search Results");
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setDrawerOpen(false);
        } catch (error) {
            alert("Error fetching the chat");
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="side-drawer-header">
                <button
                    className="btn btn-ghost"
                    onClick={() => setDrawerOpen(!drawerOpen)}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-2A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                        <path d="M8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                    </svg>
                    Search Users
                </button>

                <div className="header-title">Ping</div>

                <div className="header-actions">
                    <div className="user-menu">
                        <img
                            src={user?.pic}
                            alt={user?.name}
                            className="avatar"
                        />
                        <button className="btn btn-ghost" onClick={logoutHandler}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {drawerOpen && (
                <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
                    <div className="drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="drawer-header">
                            <h3>Search Users</h3>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setDrawerOpen(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="drawer-search">
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button className="btn btn-primary" onClick={handleSearch}>
                                Search
                            </button>
                        </div>

                        <div className="drawer-results">
                            {loading ? (
                                <div className="loading">Loading...</div>
                            ) : (
                                searchResult?.map((user) => (
                                    <div
                                        key={user._id}
                                        className="user-list-item"
                                        onClick={() => accessChat(user._id)}
                                    >
                                        <img src={user.pic} alt={user.name} className="avatar" />
                                        <div className="user-info">
                                            <div className="user-name">{user.name}</div>
                                            <div className="user-email">{user.email}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {loadingChat && <div className="loading">Loading chat...</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SideDrawer;
