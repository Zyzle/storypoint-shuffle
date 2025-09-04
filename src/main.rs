#![warn(clippy::all, clippy::pedantic, clippy::nursery)]
use std::{env::var, error::Error, sync::Arc};

use axum::{
    Router,
    body::Body,
    extract::OriginalUri,
    http::{
        HeaderValue, Request, StatusCode,
        header::{self, HOST},
    },
    middleware::{Next, from_fn},
    response::{IntoResponse, Redirect, Response},
    routing::get_service,
    serve,
};
use socketioxide::{SocketIo, extract::SocketRef};
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
    set_header::SetResponseHeaderLayer,
    trace::TraceLayer,
};
use tracing::{error, info, subscriber::set_global_default};
use tracing_subscriber::FmtSubscriber;

/// Handlers module containing the logic for handling socket events.
mod handlers;
/// Types module containing the application state and data structures.
mod types;

/// Middleware to log 404 Not Found responses.
/// - Logs the request URI when a 404 response is encountered.
async fn log_404(req: Request<Body>, next: Next) -> Response {
    let response = next.run(req).await;
    if response.status() == StatusCode::NOT_FOUND {
        error!(
            "404 Not Found: {}",
            response
                .extensions()
                .get::<OriginalUri>()
                .map_or_else(|| "<unknown>".to_owned(), |uri| uri.to_string())
        );
    }
    response
}

async fn enforce_host(req: Request<Body>, next: Next) -> Response {
    if let Some(_) = var("SKIP_HOST_ENFORCEMENT").ok() {
        return next.run(req).await;
    }

    let allowed_host = var("ALLOWED_HOST").unwrap();
    let host = req.headers().get(HOST).and_then(|h| h.to_str().ok());

    if let Some(host) = host {
        if host != allowed_host {
            info!("Redirecting to allowed host: {}", allowed_host);
            let uri = req.uri();
            let location = format!("https://{host}{uri}", host = allowed_host, uri = uri);
            return Redirect::permanent(&location).into_response();
        }
    }
    next.run(req).await
}

/// Called when a new client connects.
/// - Initializes the connection handlers for the socket.
/// - Logs the connection event.
async fn on_connect(socket: SocketRef) {
    info!("Client connected: {}", socket.id);

    socket.on("createRoom", handlers::handle_create_room);

    socket.on("joinRoom", handlers::handle_join_room);

    socket.on("vote", handlers::handle_vote);

    socket.on("revealCards", handlers::handle_reveal_cards);

    socket.on("resetVotes", handlers::handle_reset_votes);

    socket.on("exitRoom", handlers::handle_player_exit);

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

    let static_service =
        get_service(ServeDir::new("dist/assets")).layer(SetResponseHeaderLayer::overriding(
            header::CACHE_CONTROL,
            HeaderValue::from_static("public, max-age=31536000, immutable"),
        ));

    let app = Router::new()
        .fallback_service(get_service(ServeFile::new("dist/index.html")))
        .route("/", get_service(ServeFile::new("dist/index.html")))
        .route(
            "/robots.txt",
            get_service(ServeFile::new("dist/robots.txt")),
        )
        .route(
            "/sitemap.xml",
            get_service(ServeFile::new("dist/sitemap.xml")),
        )
        .nest_service("/assets", static_service.clone())
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
                .layer(layer)
                .layer(TraceLayer::new_for_http())
                .layer(from_fn(log_404)),
        )
        .layer(TraceLayer::new_for_http())
        .layer(from_fn(log_404))
        .layer(from_fn(enforce_host));

    info!("Starting server");

    let listener = TcpListener::bind("0.0.0.0:3333").await?;

    serve(listener, app).await?;

    Ok(())
}
