import { Router } from 'express';
import {
    createUser,
    getUsers,
    updateUser,
    deleteUser,
    loginUser,
    logOutUser,
    validateUser,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.route('/users').get(authMiddleware, getUsers).post(createUser);


router
.route('/users/:id')
.patch(authMiddleware, updateUser)
.delete(authMiddleware, deleteUser);

router.post('/login', loginUser);
router.post('/logout', authMiddleware, logOutUser);

router.route('/validate').get(authMiddleware, validateUser);

export default router;
