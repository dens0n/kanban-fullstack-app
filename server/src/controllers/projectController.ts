import { Request, Response } from 'express';
import { Project } from '../models/Project';

export const createProject = async (req: Request, res: Response) => {
    try {
        const newProject = await Project.create(req.body);
        res.status(201).json({
            status: 'success',
            data: newProject,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: 'Failed to create project',
        });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().select('-__v');
        res.status(200).json({
            status: 'success',
            results: projects.length,
            data: projects,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to fetch projects',
        });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id).select('-__v');
        if (!project) {
            return res
                .status(404)
                .json({ status: 'fail', error: 'Project not found' });
        }
        res.status(200).json({
            status: 'success',
            data: project,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to fetch project',
        });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!project) {
            return res
                .status(404)
                .json({ status: 'fail', error: 'Project not found' });
        }

        res.status(200).json({
            status: 'success',
            data: project,
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            error: 'Failed to update project',
        });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res
                .status(404)
                .json({ status: 'fail', error: 'Project not found' });
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: 'Failed to delete project',
        });
    }
};

