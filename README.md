<img src="./logo.svg" width="300px" alt="Storypoint Shuffle logo" />

# Storypoint Shuffle

A collaborative story point voting app built with Rust (Axum, Socketioxide) and React.

## Features

- Real-time story point voting using WebSockets
- Room and player management
- Frontend built with React and Tailwind CSS
- Backend API and static file serving with Axum and websockets using Socketioxide

## Getting Started

### Setup

1. Install Rust: https://rustup.rs
2. Install Bun: https://bun.sh
3. Install Vite+: https://viteplus.dev/guide/#install-vp
4. Install frontend dependencies:
   ```sh
   cd frontend
   vp install
   ```
5. Copy the `.env.example` file in the project root to `.env`
6. Copy the `.env.example` to `.env` in the `frontend` directory, change as needed for your setup

## Development

- Start the backend: `cargo run`
- Start the frontend (from the `frontend` directory): `vp dev`

## License

Made available under the MIT license see the LICENSE file for full details.
