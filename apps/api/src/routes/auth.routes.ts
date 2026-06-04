import {Router} from 'express';
import { registerController } from '../controllers/auth.controllers';

const router = Router();

router.post('/register', registerController);

router.post('/login', (req, res) => {
    // Handle user login logic here
    res.status(200).json({ message: 'User logged in successfully' });
    
});

export default router;