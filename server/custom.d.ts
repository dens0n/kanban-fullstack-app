import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user?: {
            _id: ObjectId;
            name: string;
            email: string;
            password: string;
        } | null;
    }
}
