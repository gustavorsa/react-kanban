export type MentionEntityType = "user" | "team";

export interface MentionItem {
    id: string;
    label: string;
    entityType: MentionEntityType;
}

export const users: MentionItem[] = [
    { id: "user-gustavo", label: "Gustavo", entityType: "user" },
    { id: "user-mateus", label: "Mateus", entityType: "user" },
    { id: "user-jack", label: "Jack", entityType: "user" },
];

export const teams: MentionItem[] = [
    { id: "team-azul", label: "azul", entityType: "team" },
    { id: "team-vermelho", label: "vermelho", entityType: "team" },
];
