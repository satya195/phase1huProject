import UserList from "../models/users.models.js";
import PromptList from "../models/prompts.models.js";
import axios from "axios";

export const analyzePromptSentiment = async (req, res) => {
    const { prompt, promptId } = req.body;
    const userId = req.user.id;

    const pythonResponse = await axios.post("http://localhost:8000/analyze_sentiment", {
        paragraph: prompt,
    });

    const promptResponse = pythonResponse.data.sentiment || "Unknown";
    const promptResponseReason = pythonResponse.data.reason || "No reason provided.";
    const promptInfo = { userId, prompt, promptId, promptResponse, promptResponseReason };
    const newPrompt = new PromptList(promptInfo);

    try {
        await newPrompt.save();
        res.status(200).json({ success: true, data: newPrompt });
    } catch (error) {
        console.error("error in creating prompt:", error.message);
        res.status(500).json({ success: false, message: "server Error" });
    }
};


export const getallPrompts = async (req, res) => {
    const userId = req.user.id;
    try {
        const prompts = await PromptList.find({ userId });
        if (prompts.length === 0) {
            return res.status(200).json({ success: false, message: "No prompts found for this user" });
        }
        res.status(200).json({ success: true, data: prompts });
    } catch (error) {
        console.error("error in fetching prompt:", error.message);
        res.status(500).json({ success: false, message: "server Error" });
    }
};
