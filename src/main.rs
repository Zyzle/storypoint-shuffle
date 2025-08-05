#![warn(
    clippy::all,
    clippy::restriction,
    clippy::pedantic,
    clippy::nursery,
    clippy::cargo
)]
use core::error::Error;
use std::sync::Arc;

use axum::{
    Router,
    body::Body,
    extract::OriginalUri,
    http::{Request, StatusCode},
    middleware::{Next, from_fn},
    response::Response,
    routing::get_service,
    serve,
};
use socketioxide::{SocketIo, extract::SocketRef};
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing::{error, info, subscriber::set_global_default};
use tracing_subscriber::FmtSubscriber;

mod handlers;
mod types;

async fn log_404(req: Request<Body>, next: Next) -> Response {
    let response = next.run(req).await;
    if response.status() == StatusCode::NOT_FOUND {
        error!(
            "404 Not Found: {}",
            response
                .extensions()
                .get::<OriginalUri>()
                .map(|uri| uri.to_string())
                .unwrap_or_else(|| "<unknown>".to_owned())
        );
    }
    response
}

#[expect(clippy::single_call_fn)]
async fn on_connect(socket: SocketRef) {
    info!("Client connected: {}", socket.id);

    socket.on("createRoom", handlers::handle_create_room);

    socket.on("joinRoom", handlers::handle_join_room);

    socket.on("vote", handlers::handle_vote);

    socket.on("revealCards", handlers::handle_reveal_cards);

    socket.on("resetVotes", handlers::handle_reset_votes);

    socket.on_disconnect(handlers::handle_disconnect);
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    set_global_default(FmtSubscriber::default())?;

    let app_state = Arc::new(types::AppState::default());
    let (layer, io) = SocketIo::builder()
        .with_state(Arc::<types::AppState>::clone(&app_state))
        .build_layer();

    io.ns("/", on_connect);

    let static_service = get_service(ServeDir::new("dist/assets"));

    let app = Router::new()
        .route("/", get_service(ServeFile::new("dist/index.html")))
        .nest_service("/assets", static_service.clone())
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
                .layer(layer)
                .layer(TraceLayer::new_for_http())
                .layer(from_fn(log_404)),
        )
        .layer(TraceLayer::new_for_http())
        .layer(from_fn(log_404));

    info!("Starting server");

    let listener = TcpListener::bind("0.0.0.0:3333").await?;

    serve(listener, app).await?;

    Ok(())
}
