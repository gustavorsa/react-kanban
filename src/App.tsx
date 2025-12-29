import { Box, Flex, Heading } from "@radix-ui/themes";
import { CreateTaskForm, TaskBoard } from "./components";
import { TasksContextProviders } from "./contexts/TaskProviders";

export default function App() {
    return (
        <TasksContextProviders>
            <Box maxWidth="80rem" mx="auto">
                <Box height="4rem">
                    <Flex align="center" gap="4" height="100%">
                        <Heading as="h1" size="8" weight="light">
                            React
                        </Heading>
                        <CreateTaskForm />
                    </Flex>
                </Box>

                <Box>
                    <Heading as="h2" mb={"5"}>
                        Quadro de tarefas
                    </Heading>
                    <TaskBoard />
                </Box>
            </Box>
        </TasksContextProviders>
    );
}
