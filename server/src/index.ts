import express, { Express, Request, Response } from 'express';
import connectDB from './config/dbConnection';
// import taskRoutes from './routes/taskRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import cookieParser from 'cookie-parser';
import taskRoutes from './routes/taskRoutes';
import cors from 'cors';

const app: Express = express();

app.use(
    cors({
        origin: 'http://localhost:5173', // Tillåt endast denna domän
        credentials: true, // Tillåter att cookies skickas med förfrågningar
    })
);

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.use('/api', projectRoutes);
app.use('/api', taskRoutes);
app.use('/api', userRoutes);

connectDB();

app.listen(port, () =>
    console.log(`App listening on port http://localhost:${port}`)
);
