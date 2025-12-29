import { useEffect, useState, type ReactNode } from "react";
import type { Task } from "../entities";
import { taskService } from "../services/api";
import { TasksContext } from "./TaskContext";

interface TaskContextProviderProps {
    children: ReactNode;
}

export const TasksContextProviders: React.FC<TaskContextProviderProps> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        taskService.fetchTasks().then((storedTasks) => {
            setTasks(storedTasks);
        });
    });

    const createTask = async (attributes: Omit<Task, "id">): Promise<void> => {
        taskService.createTask(attributes);
    };

    const updateTask = async (id: string, attributes: Partial<Omit<Task, "id">>): Promise<void> => {
        taskService.updateTask(id, attributes);
    };

    const deleteTask = async (id: string): Promise<void> => {
        taskService.deleteTask(id);
    };

    return (
        <TasksContext.Provider value={{ tasks, createTask, updateTask, deleteTask }}>
            {children}
        </TasksContext.Provider>
    );
};
