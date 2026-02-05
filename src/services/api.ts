import type { Task, Comment } from "../entities";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const taskService = {
    async fetchTasks(): Promise<Task[]> {
        const response = await fetch(`${API_URL}/tasks`);
        return await response.json();
    },
    async createTask(attributes: Omit<Task, "id">): Promise<void> {
        await fetch(`${API_URL}/tasks`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(attributes),
        });
    },
    async updateTask(id: string, attributes: Partial<Omit<Task, "id">>): Promise<void> {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(attributes),
        });
    },
    async deleteTask(id: string): Promise<void> {
        await fetch(`${API_URL}/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
        });
    },
};

export const commentService = {
    async fetchComments(): Promise<Comment[]> {
        const response = await fetch(`${API_URL}/comments`);
        return await response.json();
    },
    async createComment(attributes: Omit<Comment, "id">): Promise<void> {
        await fetch(`${API_URL}/comments`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(attributes),
        });
    },
    async updateComment(id: string, attributes: Partial<Omit<Comment, "id">>): Promise<void> {
        await fetch(`${API_URL}/comments/${id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(attributes),
        });
    },
    async deleteComment(id: string): Promise<void> {
        await fetch(`${API_URL}/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
        });
    },
};
