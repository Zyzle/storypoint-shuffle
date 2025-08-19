#![warn(clippy::all, clippy::pedantic, clippy::nursery)]
#![allow(
    clippy::cognitive_complexity,
    reason = "not a fan of this rule, plus threshold seems low"
)]
use std::{
    collections::{HashMap, hash_map::Entry},
    sync::Arc,
};

use socketioxide::extract::{Data, SocketRef, State as SocketState};
use tracing::{error, info};
use uuid::Uuid;

use crate::types::{
    AppState, CardsRevealedEvent, CreateRoomEvent, JoinRoomEvent, NewHostElectedEvent, Player,
    PlayerDisconnectedEvent, PlayerExitEvent, PlayerJoinedEvent, PlayerVotedEvent, ResetVotesEvent,
    RevealCardsEvent, Room, RoomCreatedEvent, RoomEmptyError, RoomNotFoundError, SocketEvent,
    VoteEvent, VotesResetEvent,
};

/// Cleans the votes from the room by setting each player's vote to None.
/// prevents exposing of vote values to clients until the room votes
/// are revealed
fn clean_votes(room: &Room) -> Room {
    let mut cloned_room = room.clone();
    for player in cloned_room.players.values_mut() {
        player.vote = None;
    }
    cloned_room
}

/// Emits an event directly to a single socket.
/// Enforces type safety for event data and name
fn emit_event_direct<E: SocketEvent>(socket: &SocketRef, data: &E::Data) {
    if let Err(err) = socket.emit(E::EVENT, data) {
        error!("Failed to emit {}: {}", E::EVENT, err);
    }
}

/// Emits an event to all sockets in a room.
/// Enforces type safety for event data and name
async fn emit_event_broadcast<E: SocketEvent>(socket: &SocketRef, room: String, data: &E::Data)
where
    E::Data: Sync + Send,
{
    if let Err(err) = socket.within(room).emit(E::EVENT, data).await {
        error!("Failed to emit {}: {}", E::EVENT, err);
    }
}

/// Get a mutable reference to a room from it's ID return an error if
/// the ID cannot be parsed or the room does not exist in the `HashMap`
fn get_room_mut<'a>(
    room_id: &str,
    rooms: &'a mut HashMap<Uuid, Room>,
) -> Result<&'a mut Room, RoomNotFoundError> {
    if let Ok(uuid) = Uuid::parse_str(room_id)
        && let Some(room) = rooms.get_mut(&uuid)
    {
        Ok(room)
    } else {
        Err(RoomNotFoundError {
            room_id: room_id.to_string(),
        })
    }
}

async fn elect_new_host(room: &mut Room, socket: &SocketRef) -> Result<(), RoomEmptyError> {
    if let Some(new_host) = room.players.values().next() {
        room.host_id.clone_from(&new_host.id);
        info!("New host elected: {} for room {}", new_host.id, room.id);
        // Notify all players in the room about the new host
        let () =
            emit_event_broadcast::<NewHostElectedEvent>(socket, room.id.to_string(), &new_host.id)
                .await;
        Ok(())
    } else {
        Err(RoomEmptyError)
    }
}

/// Handles the creation of a new room.
/// - Generates a new room ID and host player.
/// - Adds the room to the shared state.
/// - Joins the socket to the room and emits a "roomCreated" event.
pub async fn handle_create_room(
    socket: SocketRef,
    Data(payload): Data<CreateRoomEvent>,
    app_state: SocketState<Arc<AppState>>,
) {
    let room_id = Uuid::new_v4();
    let player = Player {
        id: socket.id.to_string(),
        name: payload.name.clone(),
        vote: None,
        has_voted: false,
    };

    let mut players = HashMap::new();
    players.insert(socket.id.to_string(), player.clone());

    let room = Room {
        id: room_id,
        host_id: socket.id.to_string(),
        players,
        cards_revealed: false,
    };

    app_state.rooms.lock().await.insert(room_id, room.clone());

    socket.join(room_id.to_string());
    info!("Room created: {}, host: {}", room_id, player.name);

    emit_event_direct::<RoomCreatedEvent>(&socket, &room);
}

/// Handles a player joining a room.
/// - Validates the room ID.
/// - Adds the player to the room if not already present.
/// - Emits "playerJoined" and "roomState" events.
/// - Emits "roomNotFound" if the room does not exist or the ID is invalid.
pub async fn handle_join_room(
    socket: SocketRef,
    Data(payload): Data<JoinRoomEvent>,
    app_state: SocketState<Arc<AppState>>,
) {
    info!("Recieved join room from {}", socket.id);

    let mut rooms = app_state.rooms.lock().await;

    match get_room_mut(&payload.room_id, &mut rooms) {
        Ok(room) => {
            match room.players.entry(socket.id.to_string()) {
                Entry::Occupied(_) => {
                    info!("Player {} already in room {}", socket.id, room.id);
                }
                Entry::Vacant(vacant) => {
                    vacant.insert(Player {
                        id: socket.id.to_string(),
                        name: payload.name.clone(),
                        vote: None,
                        has_voted: false,
                    });
                    info!("Player {} joined room {}", socket.id, room.id);
                    socket.join(room.id.to_string());
                }
            }

            // emit the updated room state to all players in the room
            emit_event_broadcast::<PlayerJoinedEvent>(&socket, room.id.to_string(), room).await;
        }
        Err(_) => {
            emit_event_direct::<RoomNotFoundError>(&socket, &());
        }
    }
}

/// Handles a player voting in a room.
/// - Updates the player's vote and voting status.
/// - Emits "playerVoted" event to the room and the player.
pub async fn handle_vote(
    socket: SocketRef,
    Data(payload): Data<VoteEvent>,
    app_state: SocketState<Arc<AppState>>,
) {
    info!("Recieved vote from {}", socket.id);

    let mut rooms = app_state.rooms.lock().await;

    match get_room_mut(&payload.room_id, &mut rooms) {
        Ok(room) => {
            let Some(player) = room.players.get_mut(&socket.id.to_string()) else {
                return;
            };
            player.vote = Some(payload.vote);
            player.has_voted = true;
            info!("Player {} voted in room {}", socket.id, room.id);

            emit_event_broadcast::<PlayerVotedEvent>(
                &socket,
                room.id.to_string(),
                &clean_votes(room),
            )
            .await;

            // if all players have voted emit "cardsRevealed" event
            if room.players.values().all(|p| p.has_voted) {
                room.cards_revealed = true;
                info!("All players voted in room {}", room.id);

                emit_event_broadcast::<CardsRevealedEvent>(&socket, room.id.to_string(), room)
                    .await;
            }
        }

        Err(_) => {
            emit_event_direct::<RoomNotFoundError>(&socket, &());
        }
    }
}

/// Handles revealing cards in a room.
/// - Only the host can reveal cards.
/// - Updates the room state and emits "cardsRevealed" event.
pub async fn handle_reveal_cards(
    socket: SocketRef,
    Data(payload): Data<RevealCardsEvent>,
    app_state: SocketState<Arc<AppState>>,
) {
    info!("Recieved reveal cards from {}", socket.id);

    let mut rooms = app_state.rooms.lock().await;

    match get_room_mut(&payload.room_id, &mut rooms) {
        Ok(room) => {
            let all_voted = room.players.values().any(|p| p.has_voted);

            if room.host_id == socket.id.to_string() && all_voted {
                room.cards_revealed = true;
                info!("Cards revealed in room {}", room.id);

                emit_event_broadcast::<CardsRevealedEvent>(&socket, room.id.to_string(), room)
                    .await;
            } else {
                error!("Cannot reveal cards for room {}", room.id);
            }
        }
        Err(_) => {
            emit_event_direct::<RoomNotFoundError>(&socket, &());
        }
    }
}

/// Handles resetting votes in a room.
/// - Only the host can reset votes.
/// - Clears all player votes and voting status.
/// - Emits "votesReset" event.
pub async fn handle_reset_votes(
    socket: SocketRef,
    Data(payload): Data<ResetVotesEvent>,
    app_state: SocketState<Arc<AppState>>,
) {
    info!("Recieved reset votes from {}", socket.id);

    let mut rooms = app_state.rooms.lock().await;

    match get_room_mut(&payload.room_id, &mut rooms) {
        Ok(room) => {
            if room.host_id == socket.id.to_string() {
                room.cards_revealed = false;
                for player in room.players.values_mut() {
                    player.vote = None;
                    player.has_voted = false;
                }
                info!("Votes reset in room {}", room.id);

                emit_event_broadcast::<VotesResetEvent>(&socket, room.id.to_string(), room).await;
            } else {
                error!("Player {} is not the host of room {}", socket.id, room.id);
            }
        }
        Err(_) => {
            emit_event_direct::<RoomNotFoundError>(&socket, &());
        }
    }
}

/// Handles player disconnects.
/// - Removes the player from all rooms.
/// - Emits "playerDisconnected" event.
/// - Elects a new host if the disconnected player was the host and notifies the room.
pub async fn handle_disconnect(socket: SocketRef, app_state: SocketState<Arc<AppState>>) {
    info!("Client disconnected: {}", socket.id);

    // Remove the player from all rooms they are in
    let mut rooms = app_state.rooms.lock().await;
    let mut empty_room_id: Option<Uuid> = None;

    for room in rooms.values_mut() {
        if room.players.remove(&socket.id.to_string()).is_some() {
            info!("Player {} removed from room {}", socket.id, room.id);

            emit_event_broadcast::<PlayerDisconnectedEvent>(&socket, room.id.to_string(), room)
                .await;

            // should elect a new host if the disconnected player was the host
            if room.host_id == socket.id.to_string()
                && matches!(elect_new_host(room, &socket).await, Err(RoomEmptyError))
            {
                empty_room_id = Some(room.id);
            }
        }
    }

    if let Some(room_id) = empty_room_id {
        info!("Room {} is now empty, removing it", room_id);
        rooms.remove(&room_id);
    }
}

pub async fn handle_player_exit(
    socket: SocketRef,
    Data(payload): Data<PlayerExitEvent>,
    app_state: SocketState<Arc<AppState>>,
) {
    info!("Player {} is exiting room {}", socket.id, payload.room_id);

    let mut rooms = app_state.rooms.lock().await;
    let mut empty_room_id: Option<Uuid> = None;

    match get_room_mut(&payload.room_id, &mut rooms) {
        Ok(room) => {
            let Some(_) = room.players.get_mut(&socket.id.to_string()) else {
                return;
            };

            room.players.remove(&socket.id.to_string());
            info!("Player {} exited room {}", socket.id, &room.id);

            socket.leave(room.id.to_string());

            emit_event_broadcast::<PlayerDisconnectedEvent>(&socket, room.id.to_string(), room)
                .await;

            // If the exiting player was the host, elect a new host
            if room.host_id == socket.id.to_string()
                && matches!(elect_new_host(room, &socket).await, Err(RoomEmptyError))
            {
                empty_room_id = Some(room.id);
            }
        }
        Err(_) => {
            emit_event_direct::<RoomNotFoundError>(&socket, &());
        }
    }

    if let Some(room_id) = empty_room_id {
        info!("Room {} is now empty, removing it", room_id);
        rooms.remove(&room_id);
    }
}
