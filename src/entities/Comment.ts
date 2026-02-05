import type { JSONContent } from "@tiptap/core";

export interface Comment {
  id: string;
  comment: JSONContent;
  createdAt?: string;
  updatedAt?: string;
}