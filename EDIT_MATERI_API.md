# Edit Materi - API Integration Documentation

## Overview
This document describes the API endpoints required for the Edit Materi page functionality.

## Base URL
```
/api/materi/{materiId}
```

---

## 1. Fetch Material Data

**Endpoint:** `GET /api/materi/{materiId}`

**Description:** Retrieve complete material data for editing

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "fileUrl": "string (optional)",
  "fileName": "string (optional)",
  "videoUrl": "string (optional)",
  "videoName": "string (optional)",
  "explanation": "string",
  "imageUrls": ["string"]
}
```

**Usage in Code:**
```typescript
const fetchMaterialData = async () => {
  const response = await fetch(`/api/materi/${materiId}`);
  const data = await response.json();
  setMaterialData(data);
};
```

---

## 2. Update Material Title

**Endpoint:** `PATCH /api/materi/{materiId}/title`

**Description:** Update only the material title

**Request Body:**
```json
{
  "title": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Judul berhasil diperbarui"
}
```

**Usage in Code:**
```typescript
const handleSaveTitle = async (newTitle: string) => {
  await fetch(`/api/materi/${materiId}/title`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTitle }),
  });
};
```

---

## 3. Update Material File

**Endpoint:** `PATCH /api/materi/{materiId}/file`

**Description:** Upload or update material file (PDF, DOC, DOCX)

**Request Body:** `multipart/form-data`
- `file`: File (PDF, DOC, DOCX)

**Response:**
```json
{
  "success": true,
  "message": "File berhasil diperbarui",
  "fileUrl": "string",
  "fileName": "string"
}
```

**Usage in Code:**
```typescript
const handleSaveFile = async (file: File | null) => {
  const formData = new FormData();
  if (file) formData.append('file', file);

  await fetch(`/api/materi/${materiId}/file`, {
    method: 'PATCH',
    body: formData,
  });
};
```

---

## 4. Delete Material File

**Endpoint:** `DELETE /api/materi/{materiId}/file`

**Description:** Remove the uploaded file

**Response:**
```json
{
  "success": true,
  "message": "File berhasil dihapus"
}
```

**Usage in Code:**
```typescript
const handleDeleteFile = async () => {
  await fetch(`/api/materi/${materiId}/file`, {
    method: 'DELETE',
  });
};
```

---

## 5. Update Material Video

**Endpoint:** `PATCH /api/materi/${materiId}/video`

**Description:** Upload or update material video

**Request Body:** `multipart/form-data`
- `video`: File (MP4, AVI, MOV)

**Response:**
```json
{
  "success": true,
  "message": "Video berhasil diperbarui",
  "videoUrl": "string",
  "videoName": "string"
}
```

**Usage in Code:**
```typescript
const handleSaveVideo = async (video: File | null) => {
  const formData = new FormData();
  if (video) formData.append('video', video);

  await fetch(`/api/materi/${materiId}/video`, {
    method: 'PATCH',
    body: formData,
  });
};
```

---

## 6. Delete Material Video

**Endpoint:** `DELETE /api/materi/${materiId}/video`

**Description:** Remove the uploaded video

**Response:**
```json
{
  "success": true,
  "message": "Video berhasil dihapus"
}
```

**Usage in Code:**
```typescript
const handleDeleteVideo = async () => {
  await fetch(`/api/materi/${materiId}/video`, {
    method: 'DELETE',
  });
};
```

---

## 7. Update Explanation and Images

**Endpoint:** `PATCH /api/materi/${materiId}/explanation`

**Description:** Update explanation text and add new images

**Request Body:** `multipart/form-data`
- `explanation`: string
- `images[]`: File[] (image files)

**Response:**
```json
{
  "success": true,
  "message": "Penjelasan berhasil diperbarui",
  "imageUrls": ["string"]
}
```

**Usage in Code:**
```typescript
const handleSaveExplanation = async (explanation: string, images: File[]) => {
  const formData = new FormData();
  formData.append('explanation', explanation);
  images.forEach((img, index) => {
    formData.append(`images[${index}]`, img);
  });

  await fetch(`/api/materi/${materiId}/explanation`, {
    method: 'PATCH',
    body: formData,
  });
};
```

---

## 8. Delete Explanation

**Endpoint:** `DELETE /api/materi/${materiId}/explanation`

**Description:** Remove explanation and all images

**Response:**
```json
{
  "success": true,
  "message": "Penjelasan berhasil dihapus"
}
```

**Usage in Code:**
```typescript
const handleDeleteExplanation = async () => {
  await fetch(`/api/materi/${materiId}/explanation`, {
    method: 'DELETE',
  });
};
```

---

## Error Handling

All endpoints should return proper error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

**Status Codes:**
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Material Not Found
- `500`: Server Error

---

## TypeScript Types

```typescript
// Material Data
interface MaterialData {
  id: string;
  title: string;
  fileUrl?: string;
  fileName?: string;
  videoUrl?: string;
  videoName?: string;
  explanation: string;
  imageUrls: string[];
}

// API Response
interface ApiResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Update Response with data
interface UpdateResponse extends ApiResponse {
  fileUrl?: string;
  fileName?: string;
  videoUrl?: string;
  videoName?: string;
  imageUrls?: string[];
}
```

---

## Authentication

All requests should include authentication headers:

```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json', // except for multipart/form-data
};
```

---

## File Upload Limits

- **Files (PDF, DOC, DOCX):** Max 10 MB
- **Videos:** Max 100 MB
- **Images:** Max 5 MB each, max 10 images

---

## Implementation Notes

1. Each section can be saved independently
2. Changes are persisted immediately on save
3. Toast notifications show success/error feedback
4. Loading states prevent multiple simultaneous requests
5. Blob URLs are properly cleaned up to prevent memory leaks
6. Images are lazy-loaded for performance
7. Drag-and-drop is supported for all file uploads

---

## Testing Checklist

- [ ] Fetch existing material data on page load
- [ ] Edit and save title successfully
- [ ] Upload new file and see success state
- [ ] Delete file and see empty state
- [ ] Upload new video and see success state
- [ ] Delete video and see empty state
- [ ] Edit explanation text and save
- [ ] Add multiple images and see previews
- [ ] Remove individual images
- [ ] Delete entire explanation
- [ ] See toast notifications for all actions
- [ ] Handle API errors gracefully
- [ ] Verify memory cleanup (no blob URL leaks)
- [ ] Test responsive layout on mobile/tablet/desktop

---

## Next Steps

1. Implement backend API endpoints
2. Add proper authentication middleware
3. Set up file storage (S3, CloudStorage, etc.)
4. Add image optimization/compression
5. Implement video transcoding if needed
6. Add progress indicators for large uploads
7. Set up CDN for media files
