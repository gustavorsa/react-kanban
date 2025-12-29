import type { TaskPriority } from "./TaskPriority";
import type { TaskStatus } from "./TaskStatus";

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    createdAt?: Date;
    updatedAt?: Date;
}
