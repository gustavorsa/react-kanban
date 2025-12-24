import { PlusIcon } from "@radix-ui/react-icons";
import { Badge, Box, Button, Dialog, Flex, RadioGroup, Text, TextArea, TextField } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export const CreateTaskForm: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>
                    <PlusIcon /> {t("labels.createTask")}
                </Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="32rem">
                <Dialog.Title>{t('title.modal')}</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    {t('descriptions.creteModal')}
                </Dialog.Description>

                <form>
                    <Flex direction="column" gap="4">
                        <Box maxWidth="32rem">
                            <Box mb="2">
                                <Text as="label" htmlFor="title">
                                    {t('labels.title')}
                                </Text>
                            </Box>
                            <TextField.Root
                                placeholder={t('placeholders.title')}
                                name="title"
                                id="title"
                                autoFocus
                                required
                            />
                        </Box>

                        <Box maxWidth="32rem">
                            <Box mb="2">
                                <Text as="label" htmlFor="description">
                                    {t('labels.description')}
                                </Text>
                            </Box>
                            <TextArea
                                placeholder={t('placeholders.description')}
                                name="description"
                                id="description"
                                required
                            />
                        </Box>

                        <Flex gap="8">
                            <Box>
                                <Text as="label" htmlFor="status">
                                    {t('labels.status')}
                                </Text>
                                <RadioGroup.Root name="status" defaultValue="todo">
                                    <RadioGroup.Item value="todo" id="status-todo">
                                        <Badge>{t('labels.toDo')}</Badge>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="in-progress" id="status-in-progress">
                                        {t('labels.inProgress')}
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="done" id="status-done">
                                        {t('labels.completed')}
                                    </RadioGroup.Item>
                                </RadioGroup.Root>
                            </Box>
                            <Box>
                                <Text as="label" htmlFor="priority">
                                    {t('labels.priority')}
                                </Text>
                                <RadioGroup.Root name="priority" defaultValue="todo">
                                    <RadioGroup.Item value="todo" id="low">
                                        {t('labels.low')}
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="in-progress" id="medium">
                                        {t('common.labels')}
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="done" id="high">
                                        {t('labels.high')}
                                    </RadioGroup.Item>
                                </RadioGroup.Root>
                            </Box>
                        </Flex>
                        <Flex gap="2" justify="end">
                            <Dialog.Close>
                                <Button color="gray" variant="soft">
                                    {t('actions.cancel')}
                                </Button>
                            </Dialog.Close>
                            <Button type="submit">{t('actions.createTask')}</Button>
                        </Flex>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};
