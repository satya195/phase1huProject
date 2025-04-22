import express from 'express';
import { addUser,loginUser ,deleteUser} from '../controllers/user.controller.js';
const router = express.Router();

router.post("/createUser",addUser);
router.post("/loginUser", loginUser);
router.post("/delUserAcc",deleteUser);

export default router;