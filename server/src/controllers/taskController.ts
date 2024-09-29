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

        if (column.tasks.length >= column.maxTasks) {
            return res.status(400).json({ error: 'Max task limit reached' });
        }

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
        const { projectId, taskId, sourceColumnId, destinationColumnId } =
            req.body;

        // Hämta projektet
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Hitta källkolumnen och destinationskolumnen
        const sourceColumn = project.columns.id(sourceColumnId);
        const destinationColumn = project.columns.id(destinationColumnId);

        if (!sourceColumn || !destinationColumn) {
            return res
                .status(404)
                .json({ error: 'Source or destination column not found' });
        }

        // Hitta uppgiften i källkolumnen med hjälp av MongoDB-uppföljning
        const task = sourceColumn.tasks.id(taskId);
        if (!task) {
            return res
                .status(404)
                .json({ error: 'Task not found in source column' });
        }

        // Ta bort uppgiften från källkolumnen med hjälp av MongoDB-uppföljning
        sourceColumn.tasks.pull(task);

        // Uppdatera columnId på uppgiften för att matcha destinationskolumnen
        task.columnId = destinationColumnId;

        // Kontrollera att destinationskolumnen inte överskrider max antal uppgifter
        if (destinationColumn.tasks.length >= destinationColumn.maxTasks) {
            return res.status(400).json({
                error: 'Max task limit reached in destination column',
            });
        }

        // Lägg till uppgiften i destinationskolumnen med uppdaterad columnId med hjälp av MongoDB-uppföljning
        destinationColumn.tasks.push(task);

        // Spara ändringarna i projektet
        await project.save();

        res.status(200).json({
            status: 'success',
            data: project,
        });
    } catch (error) {
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
    try {
        const { projectId } = req.params;
        const tasksData = req.body; // Array av task data

        // Hämta projektet
        const project = await Project.findById(projectId);
        if (!project) {
            return res
                .status(404)
                .json({ status: 'fail', error: 'Project not found' });
        }

        // Uppdatera varje task
        for (const taskData of tasksData) {
            const { _id, columnId } = taskData;

            // Hitta tasken i projektet
            let task;
            for (const column of project.columns) {
                task = column.tasks.id(_id); // Hitta tasken med rätt ID
                if (task) {
                    task.columnId = columnId; // Uppdatera columnId
                    break; // Avsluta loop om tasken hittas
                }
            }

            if (!task) {
                return res.status(404).json({
                    status: 'fail',
                    error: `Task with ID ${_id} not found`,
                });
            }
        }

        // Spara projektet med uppdaterade tasks
        await project.save();

        res.status(200).json({
            status: 'success',
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to update tasks',
        });
    }
};
