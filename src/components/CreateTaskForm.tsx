import { PlusIcon } from "@radix-ui/react-icons";
import { Box, Button, Dialog, Flex, RadioGroup, Text, TextArea, TextField } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

export const CreateTaskForm: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>
                    <PlusIcon /> {t("common.labels.createTask")}
                </Button>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="32rem">
                <Dialog.Title>Criar nova tarefa</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Adicione uma nova tarefa ao quadro.
                </Dialog.Description>

                <form>
                    <Flex direction="column" gap="4">
                        <Box maxWidth="32rem">
                            <Box mb="2">
                                <Text as="label" htmlFor="title">
                                    Titulo
                                </Text>
                            </Box>
                            <TextField.Root
                                placeholder="Defina um título"
                                name="title"
                                id="title"
                                autoFocus
                                required
                            />
                        </Box>

                        <Box maxWidth="32rem">
                            <Box mb="2">
                                <Text as="label" htmlFor="description">
                                    Descrição
                                </Text>
                            </Box>
                            <TextArea
                                placeholder="Descreva a tarefa"
                                name="description"
                                id="description"
                                required
                            />
                        </Box>

                        <Flex gap="8">
                            <Box>
                                <Text as="label" htmlFor="status">
                                    Status
                                </Text>
                                <RadioGroup.Root name="status" defaultValue="todo">
                                    <RadioGroup.Item value="todo" id="status-todo">
                                        Para fazer
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="in-progress" id="status-in-progress">
                                        Em progresso
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="done" id="status-done">
                                        Concluído
                                    </RadioGroup.Item>
                                </RadioGroup.Root>
                            </Box>
                            <Box>
                                <Text as="label" htmlFor="priority">
                                    Prioridade
                                </Text>
                                <RadioGroup.Root name="priority" defaultValue="todo">
                                    <RadioGroup.Item value="todo" id="low">
                                        Baixa
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="in-progress" id="medium">
                                        Média
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="done" id="high">
                                        Alta
                                    </RadioGroup.Item>
                                </RadioGroup.Root>
                            </Box>
                        </Flex>
                        <Flex gap="2" justify="end">
                            <Dialog.Close>
                                <Button color="gray" variant="soft">
                                    Cancelar
                                </Button>
                            </Dialog.Close>
                            <Button type="submit">Criar tarefa</Button>
                        </Flex>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
};
