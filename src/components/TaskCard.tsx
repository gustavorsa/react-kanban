import { Badge, Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import type React from "react";
import type { Task } from "../entities";
import { useTranslation } from "react-i18next";
import { useTasks } from "../hooks/useTasks";

interface TaskCardProps {
    task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const { t } = useTranslation();
    const { deleteTask, updateTask } = useTasks();

    const priorityColor: Record<string, "sky" | "amber" | "tomato"> = {
        low: "sky",
        medium: "amber",
        high: "tomato",
    };

    const textAction: Record<string, string> = {
        todo: t("labels.start"),
        doing: t("labels.doing"),
    };

    const actionColor: Record<string, "indigo" | "green" | "bronze"> = {
        todo: "indigo",
        doing: "green",
        done: "bronze",
    };

    const handleUpdate = () => {
        if (task.status === "todo") {
            updateTask(task.id, { status: "doing" });
        }

        updateTask(task.id, { status: "done" });
    };

    return (
        <Card>
            <Flex align={"center"} gap={"5"}>
                <Heading as="h3" size={"3"}>
                    {task.title}
                </Heading>
                <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
            </Flex>
            <Text as="p" my={"4"}>
                {task.description}
            </Text>
            <Flex gap={"2"}>
                {task.status != "done" && (
                    <Button color={actionColor[task.status]} onClick={handleUpdate}>
                        {textAction[task.status]}
                    </Button>
                )}
                <Button
                    color="red"
                    onClick={() => {
                        deleteTask(task.id);
                    }}
                >
                    {t("labels.delete")}
                </Button>
            </Flex>
        </Card>
    );
};
