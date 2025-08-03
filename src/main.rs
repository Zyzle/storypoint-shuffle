use std::{
    collections::{HashMap, hash_map::Entry},
    sync::Arc,
};

use axum::{
    Router,
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
    routing::get_service,
    serve,
};
use serde::{Deserialize, Serialize};
use socketioxide::{
    SocketIo,
    extract::{Data, SocketRef, State as SocketState},
};
use tokio::{net::TcpListener, sync::Mutex};
use tower::ServiceBuilder;
use tower_http::{
    cors::CorsLayer,
    services::{ServeDir, ServeFile},
    trace::TraceLayer,
};
use tracing::{error, info};
use tracing_subscriber::FmtSubscriber;
use uuid::Uuid;

// State structs
#[derive(Clone, Debug, Deserialize, Serialize)]
struct Player {
    id: String,
    name: String,
    vote: Option<u8>,
    has_voted: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
struct Room {
    id: Uuid,
    host_id: String,
    players: HashMap<String, Player>,
    cards_revealed: bool,
}

#[derive(Debug, Default)]
struct AppState {
    rooms: Mutex<HashMap<Uuid, Room>>,
}

// Event structs
#[derive(Debug, Deserialize)]
struct CreateRoomEvent {
    name: String,
}

#[derive(Debug, Deserialize)]
struct JoinRoomEvent {
    room_id: String,
    name: String,
}

#[derive(Debug, Deserialize)]
struct VoteEvent {
    room_id: String,
    vote: u8,
}

#[derive(Debug, Deserialize)]
struct RevealCardsEvent {
    room_id: String,
}

#[derive(Debug, Deserialize)]
struct ResetVotesEvent {
    room_id: String,
}

async fn log_404(req: Request<Body>, next: Next) -> Response {
    let response = next.run(req).await;
    if response.status() == StatusCode::NOT_FOUND {
        error!(
            "404 Not Found: {}",
            response
                .extensions()
                .get::<axum::extract::OriginalUri>()
                .map(|uri| uri.to_string())
                .unwrap_or_else(|| "<unknown>".to_string())
        );
    }
    response
}

async fn on_connect(socket: SocketRef) {
    info!("Client connected: {}", socket.id);

    socket.on(
        "createRoom",
        |socket: SocketRef,
         Data(payload): Data<CreateRoomEvent>,
         app_state: SocketState<Arc<AppState>>| async move {
            let room_id = Uuid::new_v4();
            let player = Player {
                id: socket.id.to_string(),
                name: payload.name.clone(),
                vote: None,
                has_voted: false,
            };

            let mut rooms = app_state.rooms.lock().await;
            let mut players = HashMap::new();
            players.insert(socket.id.to_string(), player.clone());

            let room = Room {
                id: room_id,
                host_id: socket.id.to_string(),
                players,
                cards_revealed: false,
            };
            rooms.insert(room_id, room.clone());

            socket.join(room_id.to_string());
            info!("Room created: {}, host: {}", room_id, player.name);

            socket.emit("roomCreated", &(room, true)).ok();
        },
    );

    socket.on(
        "joinRoom",
        |socket: SocketRef,
         Data(payload): Data<JoinRoomEvent>,
         app_state: SocketState<Arc<AppState>>| async move {
            info!("Recieved join room from {}", socket.id);

            if let Ok(room_id) = Uuid::parse_str(&payload.room_id) {
                let mut rooms = app_state.rooms.lock().await;

                if let Some(room) = rooms.get_mut(&room_id) {
                    // check if player is in room, if not add them
                    match room.players.entry(socket.id.to_string()) {
                        Entry::Occupied(_) => {
                            info!("Player {} already in room {}", socket.id, room_id);
                        }
                        Entry::Vacant(vacant) => {
                            vacant.insert(Player {
                                id: socket.id.to_string(),
                                name: payload.name.clone(),
                                vote: None,
                                has_voted: false,
                            });
                            info!("Player {} joined room {}", socket.id, room_id);
                            socket.join(room_id.to_string());
                        }
                    }

                    // emit the updated room state to all players in the room
                    // should probably handle the error rather than ignoring it
                    let _ = socket.to(payload.room_id).emit("playerJoined", &room).await;
                    // send room state to the newly joined player
                    let is_host = room.host_id == socket.id.to_string();
                    socket.emit("roomState", &(room, is_host)).ok();
                } else {
                    error!("Room not found: {}", payload.room_id);
                    // why do i need to borrow the unit struct here?
                    socket.emit("roomNotFound", &()).ok();
                }
            } else {
                error!("Invalid room ID format: {}", payload.room_id);
                socket.emit("roomNotFound", &()).ok();
            }
        },
    );

    socket.on(
        "vote",
        |socket: SocketRef,
         Data(payload): Data<VoteEvent>,
         app_state: SocketState<Arc<AppState>>| async move {
            info!("Recieved vote from {}", socket.id);

            let room_id_str = payload.room_id.to_string();

            if let Ok(room_id) = Uuid::parse_str(&payload.room_id) {
                let mut rooms = app_state.rooms.lock().await;

                if let Some(room) = rooms.get_mut(&room_id) {
                    if let Some(player) = room.players.get_mut(&socket.id.to_string()) {
                        player.vote = Some(payload.vote);
                        player.has_voted = true;
                        info!("Player {} voted in room {}", socket.id, room_id_str);

                        // broadcast to room without revealing vote
                        // should probably remove the vote values from the object to stop them
                        // being seen by the client
                        let _ = socket
                            .to(room_id_str)
                            .emit("playerVoted", &room.clone())
                            .await;
                        socket.emit("playerVoted", &room.clone()).ok();
                    }
                }
            }
        },
    );

    socket.on(
        "revealCards",
        |socket: SocketRef,
         Data(payload): Data<RevealCardsEvent>,
         app_state: SocketState<Arc<AppState>>| async move {
            info!("Recieved reveal cards from {}", socket.id);
            let room_id_str = payload.room_id.to_string();

            if let Ok(room_id) = Uuid::parse_str(&payload.room_id) {
                let mut rooms = app_state.rooms.lock().await;
                if let Some(room) = rooms.get_mut(&room_id) {
                    if room.host_id == socket.id.to_string() {
                        room.cards_revealed = true;
                        info!("Cards revealed in room {}", room_id_str);

                        let _ = socket
                            .to(room_id_str)
                            .emit("cardsRevealed", &room.clone())
                            .await;
                        socket.emit("cardsRevealed", &room.clone()).ok();
                    } else {
                        error!(
                            "Player {} is not the host of room {}",
                            socket.id, room_id_str
                        );
                    }
                }
            }
        },
    );

    socket.on(
        "resetVotes",
        |socket: SocketRef,
         Data(payload): Data<ResetVotesEvent>,
         app_state: SocketState<Arc<AppState>>| async move {
            info!("Recieved reset votes from {}", socket.id);
            let room_id_str = payload.room_id.to_string();

            if let Ok(room_id) = Uuid::parse_str(&payload.room_id) {
                let mut rooms = app_state.rooms.lock().await;

                if let Some(room) = rooms.get_mut(&room_id) {
                    if room.host_id == socket.id.to_string() {
                        room.cards_revealed = false;
                        for player in room.players.values_mut() {
                            player.vote = None;
                            player.has_voted = false;
                        }
                        info!("Votes reset in room {}", room_id_str);

                        let _ = socket
                            .to(room_id_str)
                            .emit("votesReset", &room.clone())
                            .await;
                        socket.emit("votesReset", &room.clone()).ok();
                    } else {
                        error!(
                            "Player {} is not the host of room {}",
                            socket.id, room_id_str
                        );
                    }
                }
            }
        },
    );

    socket.on_disconnect(
        |socket: SocketRef, app_state: SocketState<Arc<AppState>>| async move {
            info!("Client disconnected: {}", socket.id);

            // Remove the player from all rooms they are in
            let mut rooms = app_state.rooms.lock().await;

            for room in rooms.values_mut() {
                if room.players.remove(&socket.id.to_string()).is_some() {
                    info!("Player {} removed from room {}", socket.id, room.id);

                    // Optionally, you can emit an event to notify other clients
                    let _ = socket
                        .to(room.id.to_string())
                        .emit("playerDisconnected", &socket.id)
                        .await;

                    // should elect a new host if the disconnected player was the host
                    if room.host_id == socket.id.to_string() {
                        if let Some(new_host) = room.players.values().next() {
                            room.host_id = new_host.id.clone();
                            info!("New host elected: {} for room {}", new_host.id, room.id);
                            // Notify all players in the room about the new host
                            let _ = socket
                                .to(room.id.to_string())
                                .emit("newHostElected", &new_host.id)
                                .await;
                        }
                    }
                }
            }
        },
    );
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing::subscriber::set_global_default(FmtSubscriber::default())?;

    let app_state = Arc::new(AppState::default());
    let (layer, io) = SocketIo::builder()
        .with_state(app_state.clone())
        .build_layer();

    io.ns("/", on_connect);

    // Create a service to serve the index.html file directly from the 'dist' directory.
    // let index_service =
    //     get_service(ServeFile::new("dist/index.html")).handle_error(|error| async move {
    //         error!("Error serving index.html: {}", error);
    //         (
    //             axum::http::StatusCode::INTERNAL_SERVER_ERROR,
    //             "Index file error",
    //         )
    //     });

    // Create a new router to serve the static files from the 'dist' folder.
    // let static_files_service =
    //     get_service(ServeDir::new("dist")).handle_error(|error| async move {
    //         error!("Error serving static files: {}", error);
    //         (
    //             axum::http::StatusCode::INTERNAL_SERVER_ERROR,
    //             "Static file error",
    //         )
    //     });

    let static_service = get_service(ServeDir::new("dist/assets"));

    let app = Router::new()
        // .fallback_service(index_service)
        .route("/", get_service(ServeFile::new("dist/index.html")))
        .nest_service("/assets", static_service.clone())
        // .fallback(get_service(ServeFile::new("dist/index.html")))
        .layer(
            ServiceBuilder::new()
                .layer(CorsLayer::permissive())
                .layer(layer)
                .layer(TraceLayer::new_for_http())
                .layer(axum::middleware::from_fn(log_404)),
        )
        .layer(TraceLayer::new_for_http())
        .layer(axum::middleware::from_fn(log_404));

    info!("Starting server");

    let listener = TcpListener::bind("0.0.0.0:3333").await?;

    serve(listener, app).await?;

    Ok(())
}
