import UserList from "../models/users.models.js";
import PromptList from "../models/prompts.models.js";
import axios from "axios";

export const analyzePromptSentiment = async (req, res) => {
    const { prompt, promptId } = req.body;
    const userId = req.user.id;

    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || "http://ai-service:8000";
        
        // Add timeout and better error handling
        const pythonResponse = await axios.post(`${aiServiceUrl}/analyze_sentiment`, {
            paragraph: prompt,
        }, {
            timeout: 30000, // 30 second timeout
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const promptResponse = pythonResponse.data.sentiment || "Unknown";
        const promptResponseReason = pythonResponse.data.reason || "No reason provided.";
        const promptInfo = { userId, prompt, promptId, promptResponse, promptResponseReason };
        const newPrompt = new PromptList(promptInfo);

        await newPrompt.save();
        res.status(200).json({ success: true, data: newPrompt });
    } catch (error) {
        console.error("error in creating prompt:", error.message);
        
        // Provide specific error messages based on the error type
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                success: false, 
                message: "AI service is starting up. Please try again in a few minutes." 
            });
        } else if (error.code === 'ETIMEDOUT') {
            return res.status(504).json({ 
                success: false, 
                message: "AI service is taking longer than expected. Please try again." 
            });
        } else {
            return res.status(500).json({ 
                success: false, 
                message: "Unable to analyze sentiment at the moment. Please try again later." 
            });
        }
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
