import { Request, Response } from 'express';
import { Task } from '../models/Task';

export const createTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({
            status: 'success',
            data: task,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        // Skapa ett objekt med de fält som ska uppdateras
        const updatedTask = { ...req.body };

        // Uppdatera uppgiften i databasen
        const task = await Task.findByIdAndUpdate(req.params.id, updatedTask, {
            new: true,
        });

        if (!task) {
            return res.status(404).json({ error: 'Task ID not found' });
        }

        res.status(200).json({
            status: 'success',
            data: task,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

export const assignTask = async (req: Request, res: Response) => {
    try {
        const { userId, taskId } = req.body;

        // Hitta och uppdatera uppgiften med den nya tilldelningen
        const task = await Task.findByIdAndUpdate(
            taskId,
            { assignedTo: userId }, // Tilldela uppgiften
            { new: true }
        ).select('-__v');

        if (!task) {
            return res.status(404).json({ error: 'Task ID not found' });
        }

        res.status(200).json({
            status: 'success',
            data: task,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign task' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) return res.status(404).json({ error: 'Task ID not found' });

        res.status(200).json({ status: 'success', message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

export const getUserTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({
            assignedTo: req.user!._id,
        }).select('-__v');

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find()
            .populate({ path: 'assignedTo', select: '-password -__v' })
            .select('-__v');

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};
