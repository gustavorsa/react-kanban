import { Badge, Flex, Grid, ScrollArea } from "@radix-ui/themes";
import type React from "react";
import { useTranslation } from "react-i18next";
import { TaskCard } from "./TaskCard";
import { useTasks } from "../hooks/useTasks";

export const TaskBoard: React.FC = () => {
    const { t } = useTranslation();
    const { tasksTodo, tasksDone, tasksDoing } = useTasks();

    return (
        <ScrollArea scrollbars="horizontal" style={{ width: "100%", maxWidth: "100vw" }}>
            <Grid columns={"3"} gap={"4"} minWidth={"64rem"}>
                <Flex direction={"column"} gap={"4"}>
                    <Badge size={"3"} color="gray">
                        {t("labels.toDo")} ({tasksTodo.length})
                    </Badge>
                    {tasksTodo.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Flex>
                <Flex direction={"column"} gap={"4"}>
                    <Badge size={"3"} color="yellow">
                        {t("labels.doing")} ({tasksDoing.length})
                    </Badge>
                    {tasksDoing.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Flex>
                <Flex direction={"column"} gap={"4"}>
                    <Badge size={"3"} color="green">
                        {t("labels.completed")} ({tasksDone.length})
                    </Badge>
                    {tasksDone.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Flex>
            </Grid>
        </ScrollArea>
    );
};
