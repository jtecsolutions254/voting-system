import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("user");

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav>
            <Link to="/">Home</Link>
            {!isAuthenticated ? (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            ) : (
                <>
                    <Link to="/vote">Vote</Link>
                    <Link to="/results">Results</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            )}
        </nav>
    );
}

export default Navbar;
