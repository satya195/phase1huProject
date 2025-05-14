import mongoose from "mongoose";

const promptSchema = mongoose.Schema({
    promptId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    promptResponse: {
        type: String,
        required: true,
    },
    promptResponseReason: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});

const PromptList = mongoose.model("PromptList", promptSchema);
export default PromptList;
