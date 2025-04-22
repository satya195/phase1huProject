import UserList from "../models/users.models.js";
import PromptList from "../models/prompts.models.js";

export const analyzePromptSentiment = async (req, res) => {
    const { userId , prompt , promptId } = req.body; 
    let promptResponse = '';
    if (prompt.includes('happy') || prompt.includes('good')) {
        promptResponse = 'Positive';
    } else if (prompt.includes('sad') || prompt.includes('bad')) {
        promptResponse = 'Negative';
    } else {
        promptResponse = 'Neutral';
    }
        const promptInfo = { userId , prompt , promptId , promptResponse} 
        const newPrompt = new PromptList(promptInfo);

        try {
            await newPrompt.save();
            res.status(200).json({ success: true, data: newPrompt })
        } catch (error) {
            console.error("error in creating prompt  :", error.message);
            res.status(500).json({ success: false, message: "server Error" })
        }
};

export const getallPrompts = async (req, res) => {
    const { userId } = req.body; 
     const prompts = await PromptList.find({ userId });
        if(prompts.length === 0){
            return res.status(200).json({ success: false, message: "No prompts found for this user" });
        }
        try {
            res.status(200).json({ success: true, data: prompts })
        } catch (error) {
            console.error("error in fetching prompt  :", error.message);
            res.status(500).json({ success: false, message: "server Error" })
        }
};
