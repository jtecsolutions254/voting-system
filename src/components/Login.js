import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa"; // Import icons

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(""); // Clear previous errors

        const { username, password } = formData;

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password.");
            return;
        }

        console.log("Sending login data:", { username, password });

        setLoading(true); // Show loading state

        try {
            const response = await axios.post(
                "http://localhost:5000/login",
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                console.log("Login successful:", response.data);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                window.location.href = "/dashboard"; // Redirect after login
            } else {
                setError("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid username or password.");
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Welcome to UoEm Voting Centre</h2>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="login-form">
                {/* Username Field */}
                <div className="input-container">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Enter your username"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password Field with Eye Icon */}
                <div className="input-container">
                    <FaLock className="input-icon" />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        placeholder="Enter your password"
                        onChange={handleChange}
                        required
                    />
                    <span
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="signup-text">
                Don't have an account?{" "}
                <span
                    className="signup-link"
                    onClick={() => navigate("/register")}
                    style={{ color: "blue", cursor: "pointer" }}
                >
                    Sign up
                </span>
            </p>
        </div>
    );
}

export default Login;
