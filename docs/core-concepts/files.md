---
sidebar_position: 5
---

# Files

Revisium supports file attachments at any level of your schema using the built-in File system schema. Files are stored in S3-compatible storage.

## Declaration

Use the File system schema reference in your JSON Schema:

```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "default": "" },
    "cover": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" },
    "gallery": {
      "type": "array",
      "items": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" }
    }
  },
  "required": ["title", "cover", "gallery"]
}
```

File fields can appear at any nesting level — root, nested objects, or arrays of files.

## File Metadata

Once uploaded, a file field contains:

```json
{
  "status": "uploaded",
  "fileId": "abc123",
  "url": "https://s3.../cover.jpg",
  "fileName": "cover.jpg",
  "hash": "sha256...",
  "extension": "jpg",
  "mimeType": "image/jpeg",
  "size": 340000,
  "width": 1200,
  "height": 800
}
```

## Upload Process

File upload is a two-step process:

1. **Create or update the row** — this generates a `fileId` for each file field
2. **Upload the file** — send the file to the upload endpoint using the `fileId`

Metadata (`url`, `size`, `mimeType`) is populated automatically after upload.

## File Placement

| Placement | Schema | Example |
|-----------|--------|---------|
| Single file | `{ "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" }` | Product cover image |
| Array of files | `{ "type": "array", "items": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" } }` | Photo gallery |
| In nested object | `{ "type": "object", "properties": { "icon": { "$ref": "urn:jsonschema:io:revisium:file-schema:1.0.0" } } }` | Category icon |

## Admin UI

The Admin UI provides:
- Drag-and-drop file upload in the Row Editor
- Image preview for supported formats
- File gallery view with filtering by table, type, and status
- File size and metadata display

## Limits

- Maximum file size: 50 MB
- S3-compatible storage must be configured for file uploads (see [Infrastructure](../deployment/infrastructure))
