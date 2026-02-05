import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Box, Flex, IconButton, Select, Button, Card, Heading, Text, Dialog } from "@radix-ui/themes";
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  CodeIcon,
  Link1Icon,
  ListBulletIcon,
  RowsIcon,
  QuoteIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import { users, teams, type MentionItem } from "../data/mentions";
import { commentService } from "../services/api";
import type { Comment } from "../entities";
import { type JSONContent, generateHTML, mergeAttributes } from "@tiptap/core";
import { useRef } from "react";

const RichTextEditor: React.FC<{ placeholder?: string }> = ({ placeholder = "Escreva aqui..." }) => {
  // Lista de comentários salvos
  const [comments, setComments] = useState<Comment[]>([]);
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; src: string }>>([]);
  const [preview, setPreview] = useState<{ name: string; src: string } | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  function positionFloating(el: HTMLElement, rect: DOMRect) {
    el.style.position = "fixed";
    el.style.left = `${rect.left}px`;
    el.style.top = `${rect.bottom + 6}px`;
    el.style.zIndex = "1000";
    el.style.background = "white";
    el.style.border = "1px solid #ddd";
    el.style.borderRadius = "6px";
    el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)`";
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
  // Extensão de menção com atributos extras para persistir entityType e label
  const MentionUnified = Mention.extend({
    addAttributes() {
      return {
        entityType: {
          default: "user",
          renderHTML: (attributes) => ({ "data-entity-type": attributes.entityType }),
        },
        label: {
          default: null,
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      // Menção única via '@' que cobre users e teams, preservando entityType
      MentionUnified.configure({
        HTMLAttributes: { class: "mention" },
        renderLabel({ node }) {
          const label = node.attrs.label ?? node.attrs.id ?? "";
          return `${label}`;
        },
        suggestion: {
          char: "@",
          items: ({ query }) => {
            const pool: MentionItem[] = [...users, ...teams];
            return pool
              .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
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
    content: "<p></p>",
    editorProps: {
      attributes: {
        class: "tiptap-editor rt-bordered",
      },
    },
  });

  // Serializer de menção para gerar HTML com data-entity-type (sem content hole)
  const MentionSerializer = MentionUnified.extend({
    renderHTML({ node, HTMLAttributes }) {
      const entityType = node.attrs.entityType ?? "user";
      const label = node.attrs.label ?? node.attrs.id ?? "";
      const classes = entityType === "team" ? "mention team" : "mention";
      return [
        "span",
        mergeAttributes(HTMLAttributes, { class: classes, "data-entity-type": entityType }),
        `@${label}`,
      ];
    },
  });

  // Serializer de imagem para comentários legados: renderiza link com nome do arquivo
  const ImageSerializer = Image.extend({
    renderHTML({ HTMLAttributes }) {
      const src = String(HTMLAttributes.src || "");
      const filename = src ? (src.split("/").pop() || "imagem") : "imagem";
      return [
        "a",
        mergeAttributes({ href: src, target: "_blank", rel: "noopener noreferrer", class: "image-link" }),
        filename,
      ];
    },
  });

  const renderCommentHTML = (content: JSONContent) => {
    return generateHTML(content, [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      ImageSerializer,
      MentionSerializer,
    ]);
  };

  // Anexar imagem sem inserir no editor
  const handleAttachImage = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const id = crypto.randomUUID?.() ?? String(Date.now());
      const src = String(reader.result);
      setAttachments((prev) => [...prev, { id, name: file.name, src }]);
    };
    reader.readAsDataURL(file);
  };

  // Download de imagem em base64
  const downloadDataUrl = (filename: string, dataUrl: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename || "imagem";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Buscar comentários ao montar
  useEffect(() => {
    commentService.fetchComments().then((stored) => setComments(stored));
  }, []);

  const handleSave = async (): Promise<void> => {
    if (!editor) return;
    const json: JSONContent = editor.getJSON();
    const payload: Omit<Comment, "id"> = {
      comment: json,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await commentService.createComment(payload);
    const refreshed = await commentService.fetchComments();
    setComments(refreshed);
    editor.commands.setContent("<p></p>");
  };

  return (
    <Flex direction="column" gap="4">
      {/* Lista de comentários acima do editor */}
      <Box>
        <Heading as="h4" size="3">Comentários</Heading>
        {comments.length === 0 && <Text color="gray">Nenhum comentário ainda.</Text>}
        <Flex direction="column" gap="3" mt="2">
          {comments.map((c: Comment) => (
            <Card key={`comment-${c.id}`}>
              <Box mt="2">
                <div style={{ lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: renderCommentHTML(c.comment) }} />
              </Box>
            </Card>
          ))}
        </Flex>
      </Box>
      <Flex gap="2" align="center" wrap="wrap">
        <Select.Root
          defaultValue="paragraph"
          onValueChange={(v) => {
            if (v === "paragraph") editor?.chain().focus().setParagraph().run();
            if (v === "h1") editor?.chain().focus().toggleHeading({ level: 1 }).run();
            if (v === "h2") editor?.chain().focus().toggleHeading({ level: 2 }).run();
            if (v === "h3") editor?.chain().focus().toggleHeading({ level: 3 }).run();
          }}
        >
          <Select.Trigger placeholder="Parágrafo" />
          <Select.Content>
            <Select.Item value="paragraph">Parágrafo</Select.Item>
            <Select.Item value="h1">Título 1</Select.Item>
            <Select.Item value="h2">Título 2</Select.Item>
            <Select.Item value="h3">Título 3</Select.Item>
          </Select.Content>
        </Select.Root>

        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleBold().run()}>
          <FontBoldIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleItalic().run()}>
          <FontItalicIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          <CodeIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
          <ListBulletIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
          <RowsIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
          <QuoteIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().setTextAlign("left").run()}>
          <TextAlignLeftIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().setTextAlign("center").run()}>
          <TextAlignCenterIcon />
        </IconButton>
        <IconButton variant="soft" onClick={() => editor?.chain().focus().setTextAlign("right").run()}>
          <TextAlignRightIcon />
        </IconButton>
        <IconButton
          variant="soft"
          onClick={() => {
            const url = window.prompt("Insira a URL");
            if (!url) return;
            editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          <Link1Icon />
        </IconButton>
      </Flex>

      <Box>
        <EditorContent editor={editor} />
      </Box>
      {/* Anexos de imagem (fora do texto) */}
      <Flex gap="2" align="center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.currentTarget.files?.[0] ?? null;
            handleAttachImage(file);
            e.currentTarget.value = "";
          }}
        />
        <Button variant="soft" onClick={() => fileInputRef.current?.click()}>
          Anexar imagem
        </Button>
        {attachments.map((a) => (
          <Button key={a.id} variant="ghost" onClick={() => { setPreview(a); setPreviewOpen(true); }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {/* Ícone de olho simples via unicode para evitar pacote extra */}
              <span aria-hidden>👁️</span>
              {a.name}
            </span>
          </Button>
        ))}
      </Flex>
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>Visualizar imagem</Dialog.Title>
          <Dialog.Description>{preview?.name}</Dialog.Description>
          {preview && (
            <Box mt="3">
              <img src={preview.src} alt={preview.name} style={{ maxWidth: "100%", borderRadius: 8 }} />
            </Box>
          )}
          <Flex mt="3" justify="between" align="center">
            <Button
              variant="soft"
              onClick={() => preview && downloadDataUrl(preview.name, preview.src)}
            >
              Baixar
            </Button>
            <Button onClick={() => setPreviewOpen(false)}>Fechar</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <Flex mt="3" justify="end">
        <Button color="green" onClick={handleSave}>Salvar</Button>
      </Flex>
    </Flex>
  );
};

export default RichTextEditor;