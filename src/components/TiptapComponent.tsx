// src/Tiptap.tsx
import { useEditor, EditorContent, EditorContext } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Card, Flex, Heading, Text, Select } from "@radix-ui/themes";
import type { Comment } from "../entities";
import { commentService } from "../services/api";
import { generateHTML, mergeAttributes, type JSONContent } from "@tiptap/core";
import { users, teams, type MentionItem } from "../data/mentions";

const TiptapComponent = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, autolink: true }),
            Image.configure({ inline: false, allowBase64: true }),
            Mention.configure({
                HTMLAttributes: {
                    class: "mention",
                },
                renderLabel({ node }) {
                    const label = node.attrs.label ?? node.attrs.id ?? "";
                    return `${label}`;
                },
                suggestion: {
                    char: "@",
                    items: ({ query }) => {
                        const pool: MentionItem[] = users;
                        return pool
                            .filter((item) =>
                                item.label.toLowerCase().includes(query.toLowerCase()),
                            )
                            .slice(0, 5);
                    },
                    render: () => {
                        let component: HTMLDivElement;
                        return {
                            onStart: (props) => {
                                component = document.createElement("div");
                                component.className = "tiptap-mention-suggestion";
                                updateSuggestion(component, props);
                                const rect = props.clientRect?.();
                                if (rect) positionFloating(component, rect);
                                document.body.appendChild(component);
                            },
                            onUpdate: (props) => {
                                updateSuggestion(component, props);
                                const rect = props.clientRect?.();
                                if (rect) positionFloating(component, rect);
                            },
                            onKeyDown: (props) => {
                                if (props.event.key === "Escape") {
                                    component.remove();
                                    return true;
                                }
                                return false;
                            },
                            onExit: () => {
                                component.remove();
                            },
                        };
                    },
                },
            }),
            Mention.configure({
                HTMLAttributes: { class: "mention team" },
                suggestion: {
                    char: "#",
                    items: ({ query }) => {
                        const pool: MentionItem[] = teams;
                        return pool
                            .filter((item) =>
                                item.label.toLowerCase().includes(query.toLowerCase()),
                            )
                            .slice(0, 5);
                    },
                    render: () => {
                        let component: HTMLDivElement;
                        return {
                            onStart: (props) => {
                                component = document.createElement("div");
                                component.className = "tiptap-mention-suggestion";
                                updateSuggestion(component, props);
                                const rect = props.clientRect?.();
                                if (rect) positionFloating(component, rect);
                                document.body.appendChild(component);
                            },
                            onUpdate: (props) => {
                                updateSuggestion(component, props);
                                const rect = props.clientRect?.();
                                if (rect) positionFloating(component, rect);
                            },
                            onKeyDown: (props) => {
                                if (props.event.key === "Escape") {
                                    component.remove();
                                    return true;
                                }
                                return false;
                            },
                            onExit: () => {
                                component.remove();
                            },
                        };
                    },
                },
            }),
        ],
        content: "<p>Escreva aqui...</p>",
        editorProps: {
            attributes: {
                class: "tiptap-editor",
            },
        },
    });

    // Comentários salvos como JSON
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        commentService.fetchComments().then((stored) => setComments(stored));
    }, []);

    function positionFloating(el: HTMLElement, rect: DOMRect) {
        el.style.position = "fixed";
        el.style.left = `${rect.left}px`;
        el.style.top = `${rect.bottom + 6}px`;
        el.style.zIndex = "1000";
        el.style.background = "white";
        el.style.border = "1px solid #ddd";
        el.style.borderRadius = "6px";
        el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
        el.style.padding = "6px";
        el.style.minWidth = "180px";
        el.style.fontSize = "14px";
    }

    function updateSuggestion(container: HTMLDivElement, props: any) {
        const { items, command } = props;
        container.innerHTML = "";
        items.forEach((item: MentionItem) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = item.label;
            btn.style.display = "block";
            btn.style.width = "100%";
            btn.style.textAlign = "left";
            btn.style.padding = "6px 8px";
            btn.style.border = "none";
            btn.style.background = "transparent";
            btn.style.cursor = "pointer";
            btn.onmouseenter = () => (btn.style.background = "#f5f5f5");
            btn.onmouseleave = () => (btn.style.background = "transparent");
            btn.onclick = () => {
                command({ id: item.id, label: item.label, entityType: item.entityType });
            };
            container.appendChild(btn);
        });
    }

    // Memoize the provider value to avoid unnecessary re-renders
    const providerValue = useMemo(() => ({ editor }), [editor]);

    const handleSave = async (): Promise<void> => {
        if (!editor) return;
        const json: JSONContent = editor.getJSON();
        const payload: Omit<Comment, "id"> = {
            comment: json,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await commentService.createComment(payload);
        const stored = await commentService.fetchComments();
        setComments(stored);
        editor.commands.setContent("<p></p>");
    };

    const handleSetLink = () => {
        const url = window.prompt("Insira a URL");
        if (!url) return;
        editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const insertImageFromFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = () => {
            const src = String(reader.result);
            editor?.chain().focus().setImage({ src }).run();
        };
        reader.readAsDataURL(file);
    };

    const handlePaste: React.ClipboardEventHandler<HTMLDivElement> = (ev) => {
        const items = ev.clipboardData?.items;
        if (!items) return;
        for (const item of items) {
            if (item.type.startsWith("image/")) {
                const file = item.getAsFile();
                if (file) insertImageFromFile(file);
            }
        }
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (ev) => {
        const files = ev.dataTransfer?.files;
        if (!files || files.length === 0) return;
        ev.preventDefault();
        for (const file of Array.from(files)) {
            insertImageFromFile(file);
        }
    };

    const MentionHTML = Mention.extend({
        renderHTML({ node, HTMLAttributes }) {
            const entityType = node.attrs.entityType ?? (String(HTMLAttributes.class || "").includes("team") ? "team" : "user");
            return [
                "span",
                mergeAttributes(HTMLAttributes, { "data-entity-type": entityType }),
                0,
            ];
        },
    });

    const renderCommentHTML = (content: JSONContent) => {
        return generateHTML(content, [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false, autolink: true }),
            Image.configure({ inline: false, allowBase64: true }),
            MentionHTML.configure({ HTMLAttributes: { class: "mention" } }),
            MentionHTML.configure({ HTMLAttributes: { class: "mention team" } }),
        ]);
    };

    return (
        <EditorContext.Provider value={providerValue}>
            <Flex direction="column" gap="3">
                <Flex gap="2" align="center">
                    <Select.Root
                        defaultValue="paragraph"
                        onValueChange={(v) => {
                            if (v === "paragraph") editor?.chain().focus().setParagraph().run();
                            if (v === "h1")
                                editor?.chain().focus().toggleHeading({ level: 1 }).run();
                            if (v === "h2")
                                editor?.chain().focus().toggleHeading({ level: 2 }).run();
                            if (v === "h3")
                                editor?.chain().focus().toggleHeading({ level: 3 }).run();
                        }}
                    >
                        <Select.Trigger placeholder="Normal Text" />
                        <Select.Content>
                            <Select.Item value="paragraph">Normal Text</Select.Item>
                            <Select.Item value="h1">Heading 1</Select.Item>
                            <Select.Item value="h2">Heading 2</Select.Item>
                            <Select.Item value="h3">Heading 3</Select.Item>
                        </Select.Content>
                    </Select.Root>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                    >
                        Negrito
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                    >
                        Itálico
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                    >
                        Sublinhado
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                    >
                        {"< >"} Código
                    </Button>
                    <Button variant="soft" onClick={handleSetLink}>
                        Link
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    >
                        Lista não ordenada
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    >
                        Lista ordenada
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    >
                        Citação
                    </Button>
                    <Button
                        variant="soft"
                        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                    >
                        Linha
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                            const file = e.currentTarget.files?.[0];
                            if (file) insertImageFromFile(file);
                            e.currentTarget.value = "";
                        }}
                    />
                    <Button variant="soft" onClick={() => fileInputRef.current?.click()}>
                        Anexar imagem
                    </Button>
                    <Button color="green" onClick={handleSave}>
                        Embed block entry
                    </Button>
                </Flex>
                <EditorContent editor={editor} onPaste={handlePaste} onDrop={handleDrop} />

                <Box mt="4">
                    <Heading as="h4" size="3">
                        Comentários
                    </Heading>
                    {comments.length === 0 && <Text color="gray">Nenhum comentário ainda.</Text>}
                    <Flex direction="column" gap="3" mt="2">
                        {comments.map((c) => (
                            <Card key={`comment-${c.id}`}>
                                <Box mt="2">
                                    <div
                                        style={{ lineHeight: 1.6 }}
                                        dangerouslySetInnerHTML={{ __html: renderCommentHTML(c.comment) }}
                                    />
                                </Box>
                            </Card>
                        ))}
                    </Flex>
                </Box>
            </Flex>
        </EditorContext.Provider>
    );
};

export default TiptapComponent;
