import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

export const logOutUser = async (req: Request, res: Response) => {
    try {
        res.status(200).clearCookie('token').json({ message: 'Logged out' });
    } catch (error) {
        res.status(500).json({ error: 'Failed tologout' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        const secretKey = process.env.JWT_SECRET || 'yourSecretKey';

        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        res.status(200)
            .cookie('token', token, {
                httpOnly: true,
            })
            .json({
                status: 'success',
                message: 'Login successful',
            });
    } catch (error: any) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await User.create(req.body);

        res.status(201).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-__v');

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).select('-__v');

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({
            status: 'success',
            data: user,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).clearCookie('token').json({
            status: 'success',
            message: 'User deleted',
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
export const validateUser = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Logged in' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to validate login' });
    }
};
