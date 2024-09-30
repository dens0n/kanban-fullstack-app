import { useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// Components
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";

// Types
import { Column, Id, Task } from "../types/types";

// Proptypes
type Props = {
  activeProjectId: Id | null;
};

function KanbanBoard({ activeProjectId }: Props) {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
  );

  useEffect(() => {
    fetchColumns();
    fetchTasks();
    setColumns([]);
    setTasks([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProjectId]);

  const fetchColumns = async () => {
    if (!activeProjectId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/projects/${activeProjectId}`,
        {
          withCredentials: true,
        },
      );

      const dbData = response.data.data.columns;

      setColumns(dbData);
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const fetchTasks = async () => {
    if (!activeProjectId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tasks/${activeProjectId}/tasks`,
        {
          withCredentials: true,
        },
      );
      const dbData = response.data.data;
      setTasks(dbData);
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  // Task events:

  const updateAllTasksToDB = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/${activeProjectId}/update-tasks`,
        tasks,
        {
          withCredentials: true,
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      sessionStorage.removeItem("isLoggedIn");
      console.error(error.response.data.error);
      window.location.reload();
    }
  };

  const createTask = async (columnId: Id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/add-task`,
        {
          projectId: activeProjectId,
          columnId: columnId,
        },
        {
          withCredentials: true,
        },
      );

      fetchTasks();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const deleteTask = async (id: Id) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
        withCredentials: true,
      });

      fetchTasks();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };
  //remove isLogged in from session storage and reload the page
  const updateTask = async (id: Id, content: string) => {
    if (!content) return;
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/${id}`,
        {
          newContent: content,
        },
        {
          withCredentials: true,
        },
      );

      fetchTasks();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  // Drag And Drop Events:

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      const activeTaskId = event.active.id;
      const task = tasks.find((task) => task._id === activeTaskId) || null; // Fallback to null
      setActiveTask(task);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Dropping a task over another task
    const isActiveTask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task._id === activeId);
        const overIndex = tasks.findIndex((task) => task._id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task._id === activeId);

        const updatedTasks = tasks.map((task, index) => {
          if (index === activeIndex) {
            return { ...task, columnId: overId.toString() };
          }
          return task;
        });
        return updatedTasks;
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { over } = event;

    if (!over) return;

    updateAllTasksToDB();
  };

  return (
    <div className="flex w-full items-center justify-start overflow-y-hidden overflow-x-scroll px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <div className="flex gap-4">
            {columns.map((col) => (
              <ColumnContainer
                key={col._id}
                column={col}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId === col._id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
