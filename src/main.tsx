import { createRoot } from "react-dom/client";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import "@radix-ui/themes/styles.css";
import { TasksContextProviders } from "./contexts/TaskProviders";

import "./plugins/i18n";

createRoot(document.getElementById("root")!).render(
    <Theme appearance="dark">
        <TasksContextProviders>
            <App />
        </TasksContextProviders>
    </Theme>
);
