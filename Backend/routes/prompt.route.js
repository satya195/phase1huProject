import express from 'express';
import { analyzePromptSentiment, getallPrompts } from '../controllers/prompt.controller.js';
const router = express.Router();

router.post("/analyzePromptSentiment",analyzePromptSentiment);

router.post("/getAllPrompts",getallPrompts);

export default router;