import { Router } from 'express';
import {
    addTaskToColumn,
    moveTaskBetweenColumns,
    getTasksByProjectId,
    updateTaskContent,
    deleteTask,
    updateMultipleTasks,
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.route('/tasks/add-task').patch(authMiddleware, addTaskToColumn);

//Flytta task mellan Column
router.route('/tasks/move-task').patch(authMiddleware, moveTaskBetweenColumns);

// Hämta tasks för ett specifikt projekt
router
    .route('/tasks/:projectId/tasks')
    .get(authMiddleware, getTasksByProjectId);
    
// Ny route för att uppdatera flera tasks
router
    .route('/tasks/:projectId/update-tasks')
    .patch(authMiddleware, updateMultipleTasks);

// Uppdatera en specifik task
router
    .route('/tasks/:taskId')
    .patch(authMiddleware, updateTaskContent)
    .delete(authMiddleware, deleteTask);

export default router;
