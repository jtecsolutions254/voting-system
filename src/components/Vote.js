import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

function Voting() {
    const [candidates, setCandidates] = useState([]);
    const [votedCandidateId, setVotedCandidateId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Extract department and category from URL
    const queryParams = new URLSearchParams(location.search);
    const selectedDepartment = queryParams.get("department");
    const selectedCategory = queryParams.get("category");

    // Get logged-in user safely
    const storedUser = localStorage.getItem("user");
    console.log("Stored User:", storedUser);

    let userEmail = null;
    try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        userEmail = parsedUser?.email?.trim() || null;
    } catch (error) {
        console.error("Error parsing user data:", error);
    }

    console.log("Extracted User Email:", userEmail);

    // Fetch Candidates Function
    const fetchCandidates = async () => {
        if (!selectedDepartment || !selectedCategory) {
            setErrorMessage("Invalid department or category selection.");
            return;
        }

        try {
            const response = await axios.get(
                `http://localhost:5000/candidates?department=${selectedDepartment}&category=${selectedCategory}`
            );
            setCandidates(response.data);
        } catch (error) {
            console.error("Error fetching candidates:", error);
            setErrorMessage("Failed to load candidates.");
        }
    };

    // Check Vote Status Function
    const checkVoteStatus = async () => {
        if (!userEmail) return;

        const storedVote = JSON.parse(localStorage.getItem("hasVoted"));
        if (storedVote?.userEmail === userEmail) {
            setVotedCandidateId(storedVote.candidateId);
            return;
        }

        try {
            const res = await axios.get(
                `http://localhost:5000/hasVoted?email=${encodeURIComponent(userEmail)}`
            );
            if (res.data.hasVoted) {
                setVotedCandidateId(res.data.votedCandidateId);
                localStorage.setItem(
                    "hasVoted",
                    JSON.stringify({ userEmail, candidateId: res.data.votedCandidateId })
                );
            }
        } catch (error) {
            console.error("Error checking vote status:", error);
        }
    };

    // UseEffect Hook to Fetch Data on Load
    useEffect(() => {
        fetchCandidates();
        checkVoteStatus();
    }, [selectedDepartment, selectedCategory, userEmail]);

    // Cast Vote Function
    const castVote = async (candidateId) => {
        if (votedCandidateId) {
            alert("You have already voted!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/vote", {
                email: userEmail, // Updated to use `userEmail`
                candidateId,
            });

            if (response.data.success) {
                setVotedCandidateId(candidateId);
                localStorage.setItem(
                    "hasVoted",
                    JSON.stringify({ userEmail, candidateId })
                ); // Save locally
                alert(
                    `You have successfully voted for ${
                        candidates.find((c) => c._id === candidateId)?.name
                    }`
                );
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error casting vote:", error);
            alert("An error occurred while voting. Please try again.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Vote for Your Candidate</h2>
            <p>
                <strong>Department:</strong> {selectedDepartment}
            </p>
            <p>
                <strong>Category:</strong> {selectedCategory}
            </p>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                {candidates.map((candidate) => (
                    <div
                        key={candidate._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            borderRadius: "10px",
                            textAlign: "center",
                            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                            width: "200px",
                        }}
                    >
                        <img
                            src={candidate.image}
                            alt={candidate.name}
                            style={{
                                width: "100%",
                                height: "150px",
                                borderRadius: "10px",
                                objectFit: "cover",
                            }}
                        />
                        <h3>{candidate.name}</h3>
                        <button
                            onClick={() => castVote(candidate._id)}
                            style={{
                                padding: "10px",
                                width: "100%",
                                background:
                                    votedCandidateId === candidate._id ? "gray" : "blue",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor:
                                    votedCandidateId === candidate._id
                                        ? "not-allowed"
                                        : "pointer",
                                marginTop: "10px",
                            }}
                            disabled={!!votedCandidateId}
                        >
                            {votedCandidateId === candidate._id ? "Voted" : "Vote"}
                        </button>
                    </div>
                ))}
            </div>

            {votedCandidateId && (
                <div style={{ marginTop: "20px" }}>
                    <h1
                        style={{
                            cursor: "pointer",
                            color: "blue",
                            textDecoration: "underline",
                        }}
                        onClick={() => navigate("/results")}
                    >
                        Click to View Results
                    </h1>
                </div>
            )}
        </div>
    );
}

export default Voting;
