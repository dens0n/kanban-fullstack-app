export type Id = string | number;

export type Column = {
  id: Id;
  title: "To-do" | "In-progress" | "Blocked" | "Done" | string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};
