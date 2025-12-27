import { Badge, Flex, Grid, ScrollArea } from "@radix-ui/themes";
import type React from "react";
import { useTranslation } from "react-i18next";
import { TaskCard } from "./TaskCard";
import type { Task } from "../entities";

export const TaskBoard: React.FC = () => {
    const { t } = useTranslation();

    const tasksTodo: Task[] = [
        {
            id: 1,
            title: "Enviar relatório",
            description: "Enviar o relatório mensal para o departamento financeiro.",
            status: "todo",
            priority: "high",
        },
    ];

    const tasksDoing: Task[] = [
        {
            id: 1,
            title: "Enviar relatório",
            description: "Enviar o relatório mensal para o departamento financeiro.",
            status: "doing",
            priority: "high",
        },
    ];
    const tasksDone: Task[] = [
        {
            id: 1,
            title: "Enviar relatório",
            description: "Enviar o relatório mensal para o departamento financeiro.",
            status: "done",
            priority: "high",
        },
    ];

    return (
        <ScrollArea scrollbars="horizontal">
            <Grid columns={"3"} gap={"4"} minWidth={"64rem"}>
                <Flex direction={"column"} gap={"4"}>
                    <Badge size={"3"} color="gray">
                        {t("labels.toDo")}
                    </Badge>
                    {tasksTodo.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Flex>
                <Flex direction={"column"} gap={"4"}>
                    <Badge size={"3"} color="yellow">
                        {t("labels.doing")}
                    </Badge>
                    {tasksDoing.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Flex>
                <Flex direction={"column"} gap={"4"}>
                    <Badge size={"3"} color="green">
                        {t("labels.completed")}
                    </Badge>
                    {tasksDone.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Flex>
            </Grid>
        </ScrollArea>
    );
};
