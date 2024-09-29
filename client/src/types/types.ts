export type Id = string;

export type Column = {
  _id: Id;
  title: "To Do" | "In Progress" | "Blocked" | "Done" | string;
  tasks: Task[];
};

export type Task = {
  _id: Id;
  columnId: Id;
  content: string;
};

export type Project = {
  name: string;
  _id: Id;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
};
