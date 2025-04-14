import express from 'express';
import { addUser,loginUser } from '../controllers/user.controller.js';
const router = express.Router();

router.post("/createUser",addUser);
router.post("/loginUser", loginUser);

export default router;