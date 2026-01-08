import { useState } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import "./HomePage.css";

const HomePage = () => {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <div className="homepage">
            <div className="homepage-container">
                <div className="homepage-header fade-in">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="18" fill="url(#gradient)" />
                                <path
                                    d="M20 10L25 15L20 20L15 15L20 10Z"
                                    fill="white"
                                    opacity="0.9"
                                />
                                <path
                                    d="M20 20L25 25L20 30L15 25L20 20Z"
                                    fill="white"
                                    opacity="0.7"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
                                        <stop offset="0%" stopColor="#667eea" />
                                        <stop offset="100%" stopColor="#764ba2" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <h1>Ping</h1>
                    </div>
                    <p className="homepage-tagline">Real-time messaging, reimagined.</p>
                </div>

                <div className="auth-tabs-container fade-in">
                    <div className="auth-tabs">
                        <button
                            className={`tab ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                        >
                            Login
                        </button>
                        <button
                            className={`tab ${activeTab === "signup" ? "active" : ""}`}
                            onClick={() => setActiveTab("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="auth-content">
                        {activeTab === "login" ? <Login /> : <Signup />}
                    </div>
                </div>
            </div>

            <div className="background-gradient"></div>
        </div>
    );
};

export default HomePage;
