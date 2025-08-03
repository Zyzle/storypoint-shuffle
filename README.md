# Storypoint Shuffle

A collaborative story point voting app built with Rust (Axum, Socketioxide) and React.

## Features

- Real-time story point voting using WebSockets
- Room and player management
- Frontend built with React and Tailwind CSS
- Backend API and static file serving with Axum

## Project Structure

```
storypoint-shuffle/
├── Cargo.toml         # Rust backend config
├── src/               # Rust backend source
├── dist/              # Compiled frontend assets (served by Axum)
├── frontend/          # React frontend source
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
```

## Getting Started

### Backend

1. Install Rust: https://rustup.rs
2. Run the backend server:
   ```sh
   cargo run
   ```

### Frontend

1. Install Bun: https://bun.sh
2. Install dependencies:
   ```sh
   cd frontend
   bun install
   ```
3. Build the frontend:
   ```sh
   bun run build
   ```
   This outputs static files to `../dist`.

## Development

- Start the backend: `cargo run`
- Start the frontend dev server: `bun run dev` (for hot reload, not for production)

## Serving

- The backend serves static files from the `dist` directory and handles WebSocket connections for real-time features.

## License
