# Agora Debates

A structured debate platform designed to bring order to public discussion, using a visual "Pro" vs "Con" layout and a reliability-weighted voting consensus system.

## Project Details

- **Subproject Slug**: `agora-debates`
- **Firebase Project ID**: `katz-web-solutions`

## Firestore Architecture & Prefixes

All collection names are prefixed with `agora-debates_` as per workspace standards to prevent collisions:

- **Users**: `agora-debates_users`
- **Debate Topics**: `agora-debates_debates`
- **Arguments (Subcollection)**: `agora-debates_debates/{debateId}/arguments`
- **Rebuttals (Subcollection)**: `agora-debates_debates/{debateId}/arguments/{argumentId}/rebuttals`
- **Votes (Subcollection)**: 
  - For Arguments: `agora-debates_debates/{debateId}/arguments/{argumentId}/votes`
  - For Rebuttals: `agora-debates_debates/{debateId}/arguments/{argumentId}/rebuttals/{rebuttalId}/votes`

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the Vite local development server:
   ```bash
   npm run dev
   ```

3. Run the Firebase Local Emulators:
   ```bash
   npm run emulators
   ```

## Build & Deployment

- **Build Script**: `npm run build`
- **Output Directory**: `dist`
- **Cloudflare Routing**: Configured via `public/_redirects` for Single Page Application routing (`/* /index.html 200`).

---
*a Jordan Katz project*

