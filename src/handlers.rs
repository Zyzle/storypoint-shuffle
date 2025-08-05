#![warn(
    clippy::all,
    clippy::restriction,
    clippy::pedantic,
    clippy::nursery,
    clippy::cargo
)]
use std::{
    collections::{HashMap, hash_map::Entry},
    sync::Arc,
};

use socketioxide::extract::{Data, SocketRef, State as SocketState};
use tracing::{error, info};
use uuid::Uuid;

use crate::types;

#[expect(clippy::single_call_fn)]
pub async fn handle_create_room(
    socket: SocketRef,
    Data(payload): Data<types::CreateRoomEvent>,
    app_state: SocketState<Arc<types::AppState>>,
) {
    let room_id = Uuid::new_v4();
    let player = types::Player {
        id: socket.id.to_string(),
        name: payload.name.clone(),
        vote: None,
        has_voted: false,
    };

    let mut rooms = app_state.rooms.lock().await;
    let mut players = HashMap::new();
    players.insert(socket.id.to_string(), player.clone());

    let room = types::Room {
        id: room_id,
        host_id: socket.id.to_string(),
        players,
        cards_revealed: false,
    };
    rooms.insert(room_id, room.clone());

    socket.join(room_id.to_string());
    info!("Room created: {}, host: {}", room_id, player.name);

    socket.emit("roomCreated", &(room, true)).ok();
}

#[expect(clippy::single_call_fn)]
pub async fn handle_join_room(
    socket: SocketRef,
    Data(payload): Data<types::JoinRoomEvent>,
    app_state: SocketState<Arc<types::AppState>>,
) {
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
                    vacant.insert(types::Player {
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
}

#[expect(clippy::single_call_fn)]
pub async fn handle_vote(
    socket: SocketRef,
    Data(payload): Data<types::VoteEvent>,
    app_state: SocketState<Arc<types::AppState>>,
) {
    info!("Recieved vote from {}", socket.id);

    let room_id_str = payload.room_id.clone();

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
}

#[expect(clippy::single_call_fn)]
pub async fn handle_reveal_cards(
    socket: SocketRef,
    Data(payload): Data<types::RevealCardsEvent>,
    app_state: SocketState<Arc<types::AppState>>,
) {
    info!("Recieved reveal cards from {}", socket.id);
    let room_id_str = payload.room_id.clone();

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
}

#[expect(clippy::single_call_fn)]
pub async fn handle_reset_votes(
    socket: SocketRef,
    Data(payload): Data<types::ResetVotesEvent>,
    app_state: SocketState<Arc<types::AppState>>,
) {
    info!("Recieved reset votes from {}", socket.id);
    let room_id_str = payload.room_id.clone();

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
}

#[expect(clippy::single_call_fn)]
pub async fn handle_disconnect(socket: SocketRef, app_state: SocketState<Arc<types::AppState>>) {
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
                    room.host_id.clone_from(&new_host.id);
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
}
