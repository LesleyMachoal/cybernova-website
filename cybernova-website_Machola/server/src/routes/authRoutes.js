import { Router } from 'express';
import { adminLogin } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/login', adminLogin);

export default authRouter;
