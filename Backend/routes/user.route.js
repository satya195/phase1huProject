import express from 'express';
import { addUser,loginUser ,deleteUser} from '../controllers/user.controller.js';
import { authenticateToken }from "../utils/auth.js";
const router = express.Router();

router.post("/createUser",addUser);
router.post("/loginUser", loginUser);
router.post("/delUserAcc", authenticateToken, deleteUser);

export default router;