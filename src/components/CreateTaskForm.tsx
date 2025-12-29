import { PlusIcon } from "@radix-ui/react-icons";
import {
    Badge,
    Box,
    Button,
    Dialog,
    Flex,
    RadioGroup,
    Text,
    TextArea,
    TextField,
} from "@radix-ui/themes";
import type { FormEventHandler } from "react";
import { useTranslation } from "react-i18next";
import z from "zod";
import { useTasks } from "../hooks/useTasks";

const CreateTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["todo", "doing", "done"]),
    priority: z.enum(["low", "medium", "high"]),
});

export const CreateTaskForm: React.FC = () => {
    const { t } = useTranslation();
    const { createTask } = useTasks();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (ev) => {
        ev.preventDefault();

        const formData = new FormData(ev.currentTarget);
        const title = formData.get("title");
        const description = formData.get("description");
        const status = formData.get("status");
        const priority = formData.get("priority");

        ev.currentTarget.reset();

        const taskData = CreateTaskSchema.parse({ title, description, status, priority });
        await createTask(taskData);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>
                    <PlusIcon /> {t("labels.createTask")}
                </Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="32rem">
                <Dialog.Title>{t("title.modal")}</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    {t("descriptions.creteModal")}
                </Dialog.Description>

                <form onSubmit={handleSubmit}>
                    <Flex direction="column" gap="4">
                        <Box maxWidth="32rem">
                            <Box mb="2">
                                <Text as="label" htmlFor="title">
                                    {t("labels.title")}
                                </Text>
                            </Box>
                            <TextField.Root
                                placeholder={t("placeholders.title")}
                                name="title"
                                id="title"
                                autoFocus
                                required
                            />
                        </Box>

                        <Box maxWidth="32rem">
                            <Box mb="2">
                                <Text as="label" htmlFor="description">
                                    {t("labels.description")}
                                </Text>
                            </Box>
                            <TextArea
                                placeholder={t("placeholders.description")}
                                name="description"
                                id="description"
                                required
                            />
                        </Box>

                        <Flex gap="8">
                            <Box>
                                <Text as="label" htmlFor="status">
                                    {t("labels.status")}
                                </Text>
                                <RadioGroup.Root name="status" defaultValue="todo">
                                    <RadioGroup.Item value="todo" id="status-todo">
                                        <Badge color="gray">{t("labels.toDo")}</Badge>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="doing" id="status-doing">
                                        <Badge color="yellow">{t("labels.doing")}</Badge>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="done" id="status-done">
                                        <Badge color="green">{t("labels.completed")}</Badge>
                                    </RadioGroup.Item>
                                </RadioGroup.Root>
                            </Box>
                            <Box>
                                <Text as="label" htmlFor="priority">
                                    {t("labels.priority")}
                                </Text>
                                <RadioGroup.Root name="priority" defaultValue="low">
                                    <RadioGroup.Item value="low" id="low">
                                        <Badge color="sky">{t("labels.low")}</Badge>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="medium" id="medium">
                                        <Badge color="amber">{t("common.labels")}</Badge>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="high" id="high">
                                        <Badge color="tomato">{t("labels.high")}</Badge>
                                    </RadioGroup.Item>
                                </RadioGroup.Root>
                            </Box>
                        </Flex>
                        <Flex gap="2" justify="end">
                            <Dialog.Close>
                                <Button color="gray" variant="soft">
                                    {t("actions.cancel")}
                                </Button>
                            </Dialog.Close>
                            <Button type="submit">{t("actions.createTask")}</Button>
                        </Flex>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};
