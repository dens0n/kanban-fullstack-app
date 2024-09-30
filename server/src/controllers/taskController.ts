import { Request, Response } from 'express';
import { Project } from '../models/Project';

export const addTaskToColumn = async (req: Request, res: Response) => {
    try {
        const { projectId, columnId, taskContent } = req.body; // Hämta all data från bodyn

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const column = project.columns.id(columnId); // Hitta kolumnen med dess ID

        if (!column) {
            return res.status(404).json({ error: 'Column not found' });
        }

        // if (column.tasks.length >= column.maxTasks) {
        //     return res.status(400).json({ error: 'Max task limit reached' });
        // }

        column.tasks.push({ content: taskContent, columnId: columnId });
        await project.save();

        res.status(200).json({
            status: 'success',
            data: project,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' });
    }
};

export const moveTaskBetweenColumns = async (req: Request, res: Response) => {
    try {
        const { projectId, taskId, destinationColumnId } = req.body;

        // 1. Hämta projektet
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // 2. Hitta uppgiften i projektet och dess nuvarande kolumn
        const task = project.columns
            .flatMap((column) => column.tasks)
            .find((task) => task._id.toString() === taskId);

        if (!task) {
            return res
                .status(404)
                .json({ error: 'Task not found in any column' });
        }

        // Hämta källkolumnens ID
        const sourceColumnId = project?.columns.find((column) =>
            column.tasks.some((t) => t._id.toString() === taskId)
        )?._id; // Added optional chaining to handle undefined case

        // 3. Ta bort uppgiften från källkolumnen
        await Project.findOneAndUpdate(
            { _id: projectId, 'columns._id': sourceColumnId },
            { $pull: { 'columns.$.tasks': { _id: taskId } } },
            { new: true }
        );

        // 4. Lägg till uppgiften i destinationskolumnen
        await Project.findOneAndUpdate(
            { _id: projectId, 'columns._id': destinationColumnId },
            {
                $push: {
                    'columns.$.tasks': {
                        _id: taskId,
                        content: task.content, // Bevara taskens innehåll
                        columnId: destinationColumnId, // Sätt columnId till destination
                    },
                },
            },
            { new: true }
        );

        res.status(200).json({
            status: 'success',
            data: { projectId, taskId, destinationColumnId },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to move task' });
    }
};

export const getTasksByProjectId = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;

        // Hämta projektet baserat på ID
        const project = await Project.findById(projectId).select('-__v');

        if (!project) {
            return res.status(404).json({
                status: 'fail',
                error: 'Project not found',
            });
        }

        // Samla alla tasks från alla kolumner
        const allTasks = project.columns.reduce<Array<any>>((tasks, column) => {
            return tasks.concat(column.tasks);
        }, []);

        res.status(200).json({
            status: 'success',
            tasksCount: allTasks.length,
            data: allTasks,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to fetch tasks from project',
        });
    }
};

export const updateTaskContent = async (req: Request, res: Response) => {
    try {
        const { newContent } = req.body;
        const { taskId } = req.params;

        // Kontrollera att newContent inte är tomt
        if (!newContent) {
            return res.status(400).json({
                status: 'fail',
                error: 'New content must be provided',
            });
        }

        // Hämta projekt som innehåller tasken
        const project = await Project.findOne({ 'columns.tasks._id': taskId });
        if (!project) {
            return res.status(404).json({
                status: 'fail',
                error: 'Task not found in any project',
            });
        }

        // Leta igenom kolumnerna för att hitta rätt task
        let task;
        for (const column of project.columns) {
            task = column.tasks.id(taskId); // Hitta tasken med rätt ID
            if (task) break; // Avsluta loop om tasken hittas
        }

        if (!task) {
            return res
                .status(404)
                .json({ status: 'fail', error: 'Task not found in columns' });
        }

        // Uppdatera taskens content
        task.content = newContent;

        // Spara projektet med uppdaterad task
        await project.save();

        res.status(200).json({
            status: 'success',
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to update task content',
        });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;

        // Hämta projekt som innehåller tasken
        const project = await Project.findOne({ 'columns.tasks._id': taskId });
        if (!project) {
            return res.status(404).json({
                status: 'fail',
                error: 'Task not found in any project',
            });
        }

        // Leta igenom kolumnerna för att hitta och ta bort rätt task
        let taskRemoved = false;
        for (const column of project.columns) {
            const task = column.tasks.id(taskId); // Hitta tasken med rätt ID
            if (task) {
                column.tasks.splice(column.tasks.indexOf(task), 1); // Ta bort tasken från kolumnen
                taskRemoved = true;
                break; // Avsluta loopen när tasken har tagits bort
            }
        }

        if (!taskRemoved) {
            return res.status(404).json({
                status: 'fail',
                error: 'Task not found in columns',
            });
        }

        // Spara projektet efter att tasken har tagits bort
        await project.save();

        res.status(204).json({
            status: 'success',
            data: null, // Inga data att returnera efter borttagning
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to delete task',
        });
    }
};

export const updateMultipleTasks = async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const tasksToUpdate = req.body;

    try {
        // Hämta projektet baserat på projectId
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                status: 'fail',
                message: 'Project not found',
            });
        }

        // Loopa genom varje task i request-body:n
        tasksToUpdate.forEach(
            (task: { _id: string; content: string; columnId: string }) => {
                const { _id, content, columnId } = task;

                // Leta upp kolumnen där tasken för närvarande är
                project.columns.forEach((column) => {
                    const taskIndex = column.tasks.findIndex(
                        (t) => t._id.toString() === _id
                    );

                    if (taskIndex !== -1) {
                        // Ta bort tasken från den nuvarande kolumnen
                        column.tasks.splice(taskIndex, 1);
                    }
                });

                // Hitta kolumnen där tasken ska placeras
                const newColumn = project.columns.find(
                    (col) => col._id.toString() === columnId
                );

                if (newColumn) {
                    // Flytta task till den nya kolumnen
                    newColumn.tasks.push({ _id, content, columnId });
                }
            }
        );

        // Spara de uppdaterade kolumnerna och tasksen i databasen
        await project.save();

        res.status(200).json({
            status: 'success',
            message: 'Tasks updated successfully',
            project,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to update tasks',
        });
    }
};
