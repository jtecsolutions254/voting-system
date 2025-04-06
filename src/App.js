import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Vote from "./components/Vote";
import Results from "./components/Results";
import Navbar from "./components/Navbar";
import CategorySelection from "./CategorySelection"; 
import Voting from "./components/Vote";

function PrivateRoute({ element }) {
    const isAuthenticated = localStorage.getItem("user"); 
    return isAuthenticated ? element : <Navigate to="/register" />;
}

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
            <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                
                {/* Updated Category Selection route */}
                <Route path="/CategorySelection" element={<CategorySelection />} />

                {/* Protected routes for voting and results */}
                <Route path="/vote" element={<PrivateRoute element={<Voting />} />} />
                <Route path="/results" element={<PrivateRoute element={<Results />} />} />
            </Routes>
        </Router>
    );
}

export default App;
