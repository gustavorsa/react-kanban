import type { Task } from "../entities";

export const taskService = {
    async fetchTasks(): Promise<Task[]> {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`);
        return await response.json();
    },
    async createTask(attributes: Omit<Task, "id">): Promise<void> {
        await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(attributes),
        });
    },
    async updateTask(id: string, attributes: Partial<Omit<Task, "id">>): Promise<void> {
        await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(attributes),
        });
    },
    async deleteTask(id: string): Promise<void> {
        await fetch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
        });
    },
};
