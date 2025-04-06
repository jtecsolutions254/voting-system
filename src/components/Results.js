import React, { useEffect, useState } from "react";
import axios from "axios";

function Results() {
    const [candidates, setCandidates] = useState([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [registeredVoters, setRegisteredVoters] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                // Fetch candidates (which include votes)
                const candidatesResponse = await axios.get("http://localhost:5000/candidates");
                console.log("Candidates Response:", candidatesResponse.data);

                // Store candidates data
                setCandidates(candidatesResponse.data);

                // Calculate total votes from candidates' data
                const total = candidatesResponse.data.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
                console.log("Total Votes:", total);
                setTotalVotes(total);

                // Fetch registered voters count
                const votersResponse = await axios.get("http://localhost:5000/registered-voters");
                console.log("Registered Voters:", votersResponse.data);
                setRegisteredVoters(votersResponse.data.count || 0);

            } catch (error) {
                console.error("Error fetching results:", error);
                setError("Failed to fetch election results. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Sort candidates based on votes (descending order)
    const sortedCandidates = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            <h2>Election Results</h2>

            {loading ? <p>Loading results...</p> : (
                <>
                    {error && <p style={{ color: "red" }}>{error}</p>}

                    <p><strong>Total Registered Voters:</strong> {registeredVoters}</p>
                    <p><strong>Total Votes Cast:</strong> {totalVotes}</p>

                    <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
                        {sortedCandidates.map((candidate, index) => {
                            const candidateVotes = candidate.votes || 0;
                            const votePercentage = totalVotes > 0 ? ((candidateVotes / totalVotes) * 100).toFixed(2) : "0.00";

                            return (
                                <div key={candidate._id || index} style={{ 
                                    border: "1px solid #ccc", 
                                    padding: "15px", 
                                    borderRadius: "10px",
                                    textAlign: "center",
                                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                                    width: "220px",
                                    background: candidateVotes === Math.max(...sortedCandidates.map(c => c.votes || 0)) ? "#c9f7c9" : "white"
                                }}>
                                    <img 
    src={`http://localhost:5000/${candidate.image}`} 
    alt={candidate.name} 
    style={{ width: "100%", height: "150px", borderRadius: "10px", objectFit: "cover" }} 
/>


                                    <h3>{candidate.name}</h3>
                                    <p><strong>Votes:</strong> {candidateVotes}</p>
                                    <p><strong>Percentage:</strong> {votePercentage}%</p>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export default Results;
