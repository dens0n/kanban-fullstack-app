import { Schema, model, Types } from 'mongoose';

const taskSchema = new Schema({
    content: { type: String, default: '' },
    columnId: { type: Types.ObjectId, ref: 'Column', required: true },
});

const columnSchema = new Schema({
    title: { type: String, required: true },
    tasks: [taskSchema],
    maxTasks: { type: Number, default: 5 },
});

const projectSchema = new Schema({
    name: { type: String, required: true },
    columns: {
        type: [columnSchema],
        default: [
            { title: 'To Do', tasks: [] },
            { title: 'In Progress', tasks: [] },
            { title: 'Blocked', tasks: [] },
            { title: 'Done', tasks: [] },
        ],
        validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

function arrayLimit(val: []): boolean {
    return val.length <= 4;
}

projectSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Project = model('Project', projectSchema);
