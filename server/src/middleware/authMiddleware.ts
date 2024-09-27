import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;

    if (!token) {
        return res
            .status(401)
            .json({ message: 'No token found, authorization denied' });
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'yourSecretKey';
        const decodedUser = jwt.verify(token, secretKey) as JwtPayload;

        if (!decodedUser.id) {
            return res
                .status(400)
                .json({ message: 'Token does not contain valid user id' });
        }

        const user = await User.findById(decodedUser.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;

        next();
    } catch (error) {
        return res
            .status(401)
            .clearCookie('token')
            .json({ message: 'Token is not valid' });
    }
};
