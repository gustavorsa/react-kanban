# RichTextEditor Architecture

## Overview
The `RichTextEditor` provides a lightweight Tiptap-based editor focused on mentions, text formatting, and external attachments. It avoids embedding heavy content (images/documents) within the editor to reduce rendering overhead and potential runtime errors.

## Key Design Decisions
- Single mention system via `@`, unified across users and teams.
- Serializer-only approach for legacy image nodes when rendering saved comments (no image extension inside the editor).
- External attachments are handled outside the editor as a toolbar/list, using a modal viewer and a direct download mechanism.
- Minimal styling with Radix UI components for accessibility and consistency.

## Extensions
- `StarterKit`: Base nodes/marks (paragraphs, headings, bold, italic, lists, blockquote, code, horizontal rule).
- `Underline`: Adds underline mark.
- `Link`: Autolink with a simple prompt handler.
- `Placeholder`: User-defined placeholder text.
- `TextAlign`: Alignment for paragraph/headings.
- `MentionUnified`: Custom mention node that persists `entityType` and `label`.

### MentionUnified
- Extends `@tiptap/extension-mention` and adds attributes:
  - `entityType`: `user` | `team`, rendered as `data-entity-type`.
  - `label`: human-friendly text for the mention, stored and rendered.
- Suggestion provider merges `users` and `teams` and filters by query.
- Serialized HTML: `span.mention` or `span.mention.team` with `@label` and `data-entity-type`.

## Comment Rendering
- Uses `generateHTML` with a local `MentionSerializer` and `ImageSerializer`:
  - `MentionSerializer`: renders `<span class="mention|mention team" data-entity-type="...">@label</span>`.
  - `ImageSerializer`: converts legacy image nodes to `<a href="..." target="_blank" class="image-link">filename</a>`.
- This prevents errors like `RangeError: Content hole not allowed in a leaf node spec` and `Unknown node type: image` while keeping visual clarity.

## Attachments Architecture
- State: `attachments: { id, name, src, type }[]`.
- Input: single file input accepting images and common document MIME types (PDF/Office).
- UI: buttons for each attachment showing an eye icon and the filename.
- Preview:
  - Images: `<img>` inside modal.
  - PDFs: `<iframe>` inside modal.
  - Other documents: a note to download for viewing.
- Download: `downloadDataUrl(filename, dataUrl)` creates a temporary anchor link with `download` and triggers a click.

## Persistence
- Comments are saved via `commentService` as `JSONContent` from the editor.
- Attachments are currently kept in component state only; they are not persisted to the API. Future change could add `attachments` to the comment payload.

## Styling
- Toolbar uses Radix `IconButton` and `Button`.
- Mention colors:
  - `.mention` (users): blue.
  - `.mention.team` (teams): green.
- Editor box has `.rt-bordered` for a visible boundary and placeholder.

## Error Handling & Constraints
- No embed of images/documents in editor content, reducing performance and avoiding heavy nodes.
- Legacy content support through serializers for display-only.
- Graceful fallback for unsupported preview types.

## Future Enhancements
- Persist attachments alongside comments (`attachments` array in API).
- Add file size/type validations and upload progress.
- Add icons per file type and better listing (e.g., grid or table).
- Mention chips with avatars or team badges.