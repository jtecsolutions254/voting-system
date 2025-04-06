import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CategorySelection() {
    const navigate = useNavigate();
    
    const departments = ["Education", "ICT", "Business", "Agriculture"];
    const categories = ["Male Delegate", "Female Delegate", "Male Rep", "Female Rep", "School President", "Special Needs"];

    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleProceed = () => {
        if (!selectedDepartment || !selectedCategory) {
            alert("Please select both a department and candidate category.");
            return;
        }
        
        // Navigate to voting page and pass selected category as a URL param
        navigate(`/vote?department=${selectedDepartment}&category=${selectedCategory}`);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Select Your Department</h2>
            <select 
                value={selectedDepartment} 
                onChange={(e) => setSelectedDepartment(e.target.value)} 
                style={{ padding: "10px", marginBottom: "20px", width: "200px" }}
            >
                <option value="">-- Select Department --</option>
                {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                ))}
            </select>

            <h2>Select Candidate Category</h2>
            <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)} 
                style={{ padding: "10px", width: "200px" }}
            >
                <option value="">-- Select Category --</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>

            <br />

            <button 
                onClick={handleProceed} 
                style={{ 
                    marginTop: "20px", 
                    padding: "10px 20px", 
                    background: "blue", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Proceed to Voting
            </button>
        </div>
    );
}

export default CategorySelection;
