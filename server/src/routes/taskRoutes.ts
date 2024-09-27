import { Router } from 'express';
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    getUserTasks,
    assignTask,
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.route('/my-tasks').get(authMiddleware, getUserTasks);

router.route('/tasks/assign').patch(authMiddleware, assignTask);

router
    .route('/tasks')
    .get(authMiddleware, getTasks)
    .post(authMiddleware, createTask);

router
    .route('/tasks/:id')
    .patch(authMiddleware, updateTask)
    .delete(authMiddleware, deleteTask);

export default router;
