import { Router } from 'express';
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Hämta alla projekt eller skapa ett nytt projekt
router
    .route('/projects')
    .get(authMiddleware, getAllProjects)
    .post(authMiddleware, createProject);


router
    .route('/projects/:id')
    .get(authMiddleware, getProjectById)
    .patch(authMiddleware, updateProject)
    .delete(authMiddleware, deleteProject);


export default router;
