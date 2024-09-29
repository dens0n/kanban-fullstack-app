import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

// components
import TaskCard from "./TaskCard";
// Types
import { Column, Id, Task } from "../types/types";

// Proptypes
interface Props {
  column: Column;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function ColumnContainer({
  column,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const tasksIds = useMemo(() => tasks.map((task) => task._id), [tasks]);

  const { setNodeRef } = useSortable({
    id: column._id,
    data: {
      type: "Column",
      column,
    },
    disabled: true,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex h-[600px] max-h-[600px] w-[310px] flex-col rounded-md bg-columnBackgroundColor"
    >
      {/* Column title */}
      <div className="text-md flex h-[60px] items-center justify-between rounded-md rounded-b-none border-4 border-columnBackgroundColor bg-mainBackgroundColor p-3 font-bold">
        <div className="relative flex w-full items-center justify-center">
          <div className="absolute left-0 flex items-center justify-center rounded-full bg-columnBackgroundColor px-2 py-1 text-sm">
            {tasks.length}
          </div>
          <div>{column.title}</div>
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column footer */}
      {tasks.length < 5 && (
        <button
          onClick={() => {
            createTask(column._id);
          }}
          className="flex items-center gap-2 rounded-md border-2 border-columnBackgroundColor border-x-columnBackgroundColor p-4 hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        >
          <Plus />
          Add task
        </button>
      )}
    </div>
  );
}
