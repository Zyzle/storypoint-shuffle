# Storypoint Shuffle — Agent Guidelines

A collaborative story point voting app. The backend is a Rust (Axum + Socketioxide) WebSocket server; the frontend is a React/TypeScript SPA in the `frontend/` subdirectory and has it's own `AGENTS.md` file.

Reply in the most concise form possible. Skip pleasantries, preambles, and recaps of my question. No phrases like "I'd be happy to", "Great question", or "Let me explain".

Drop articles and filler words wherever the meaning stays clear.

Prefer short declarative sentences. If a tool call is needed, run it first and show only the result. Do not narrate your steps.

## Repository Layout

```
src/          Rust backend (main.rs, handlers.rs, types.rs)
frontend/     React/TypeScript frontend (see frontend/AGENTS.md)
Cargo.toml    Rust workspace manifest
fly.toml      Fly.io deployment config
```

## Backend (Rust)

### Running & Checking

```sh
cargo run          # start the dev server
cargo clippy       # lint (all, pedantic, nursery lints are enabled)
cargo fmt          # format
cargo test         # run tests
```

Always run `cargo fmt` and `cargo clippy` before finishing backend changes. The project uses Rust edition 2024.

### Conventions

- Clippy lints `clippy::all`, `clippy::pedantic`, and `clippy::nursery` are active — fix all warnings before committing.
- Use `tracing::{info, error}` for logging; do not use `println!`.
- New socket events must be registered in `on_connect` in `main.rs` and handled in `handlers.rs`.
- Types belong in `types.rs`. Implement the `SocketEvent` trait for new event structs so the typed `emit_event_*` helpers can be used.
- `AppState` is wrapped in `Arc<Mutex<…>>` — acquire the lock only for the minimum scope needed.

## Frontend

See [frontend/AGENTS.md](frontend/AGENTS.md) for frontend-specific tooling (Vite+), commands, and conventions.

Key points:

- Package manager and tooling are managed via `vp` (Vite+). Do **not** call `pnpm`/`npm`/`yarn` directly.
- Run `vp check` (format + lint + type-check) and `vp test` before finishing frontend changes.
- New components should include a `.stories.ts(x)` file for Storybook.

## Commit Style

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Include a `resolves: #<issue>` footer when addressing an open issue.

## Environment Setup

1. Copy `.env.example` → `.env` in the project root.
2. Copy `frontend/.env.example` → `frontend/.env` and adjust as needed.
3. `ALLOWED_HOST` must be set in production; set `SKIP_HOST_ENFORCEMENT=1` for local dev to bypass the host redirect middleware.
