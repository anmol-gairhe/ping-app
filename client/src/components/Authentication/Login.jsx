import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!email || !password) {
            alert("Please Fill all the Fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={submitHandler} className="auth-form fade-in">
                <h2>Welcome Back</h2>
                <p className="auth-subtitle">Sign in to continue to Ping</p>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </button>

                <div className="demo-credentials">
                    <p>Demo Credentials</p>
                    <button
                        type="button"
                        className="btn btn-secondary w-full"
                        onClick={() => {
                            setEmail("guest@example.com");
                            setPassword("123456");
                        }}
                    >
                        Get Guest User Credentials
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
