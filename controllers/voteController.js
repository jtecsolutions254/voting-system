const User = require("../models/User");
const Candidate = require("../models/Candidate");

exports.castVote = async (req, res) => {
    try {
        const { email, candidateId } = req.body;
        if (!email || !candidateId) {
            return res.status(400).json({ success: false, message: "Email and Candidate ID are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        if (user.hasVoted) return res.status(400).json({ success: false, message: "You have already voted!" });

        const candidate = await Candidate.findById(candidateId);
        if (!candidate) return res.status(404).json({ success: false, message: "Candidate not found" });

        candidate.votes += 1;
        await candidate.save();

        user.hasVoted = true;
        user.votedCandidateId = candidateId;
        await user.save();

        res.json({ success: true, message: `Vote cast for ${candidate.name}` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error casting vote", error });
    }
};

exports.getResults = async (req, res) => {
    try {
        const results = await Candidate.find({}, { name: 1, votes: 1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching results", error });
    }
};
