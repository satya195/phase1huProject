import express from 'express';
import { analyzePromptSentiment, getallPrompts } from '../controllers/prompt.controller.js';
import { authenticateToken }from "../utils/auth.js";
const router = express.Router();

router.post("/analyzePromptSentiment",authenticateToken,analyzePromptSentiment);

router.post("/getAllPrompts",authenticateToken,getallPrompts);

export default router;