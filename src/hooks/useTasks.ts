import { useContext } from "react";
import { TasksContext } from "../contexts/TaskContext";
import type { Task } from "../entities";

export const useTasks = () => {
    const { tasks, createTask, updateTask, deleteTask } = useContext(TasksContext);

    const tasksTodo: Task[] = tasks.filter((task) => task.status === "todo");
    const tasksDoing: Task[] = tasks.filter((task) => task.status === "doing");
    const tasksDone: Task[] = tasks.filter((task) => task.status === "done");

    return { tasksTodo, tasksDoing, tasksDone, createTask, updateTask, deleteTask };
};
