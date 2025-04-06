import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Voting System</h1>
            <div style={{ marginTop: "20px" }}>
                <Link to="/register">
                    <button style={buttonStyle}>Register</button>
                </Link>
                <Link to="/login">
                    <button style={{ ...buttonStyle, marginLeft: "5px" }}>Login</button>
                </Link>
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: "5px 7px",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "white",
};

export default Home;
