FROM lukemathwalker/cargo-chef:latest-rust-1 AS chef
WORKDIR /app

FROM chef AS planner
COPY . .

WORKDIR /app/frontend
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"
# should probably get these from the workflow or something
ENV VITE_SITE_URL="https://storypoint-shuffle.zyzle.dev"
ENV VITE_SOCKET_URL="https://storypoint-shuffle.zyzle.dev"
RUN bun install
RUN bun run build

WORKDIR /app

RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json

WORKDIR /app

# Build application
COPY . .
RUN cargo build --release --bin storypoint-shuffle

# We do not need the Rust toolchain to run the binary!
FROM debian:bookworm-slim AS runtime
WORKDIR /app
COPY --from=builder /app/target/release/storypoint-shuffle /app
COPY --from=planner /app/dist /app/dist
ENV ALLOWED_HOST="storypoint-shuffle.zyzle.dev"
RUN chmod -R 755 /app/dist
ENTRYPOINT ["/app/storypoint-shuffle"]
EXPOSE 3333