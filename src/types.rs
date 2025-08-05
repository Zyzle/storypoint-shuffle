#![warn(
    clippy::all,
    clippy::restriction,
    clippy::pedantic,
    clippy::nursery,
    clippy::cargo
)]

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use uuid::Uuid;

/// Player represents a connected user
/// It contains their ID, name, vote, and whether they have voted
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Player {
    pub id: String,
    pub name: String,
    pub vote: Option<u8>,
    pub has_voted: bool,
}

/// Room represents a game room
/// It contains the room ID, host ID, and a list of players
/// and whether the cards have been revealed
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Room {
    pub id: Uuid,
    pub host_id: String,
    pub players: HashMap<String, Player>,
    pub cards_revealed: bool,
}

/// AppState holds the global application state
/// It contains a map of room IDs to Room objects
/// and is protected by a Mutex for thread safety
#[derive(Debug, Default)]
pub struct AppState {
    pub rooms: Mutex<HashMap<Uuid, Room>>,
}

/// Room created event
#[derive(Debug, Deserialize)]
pub struct CreateRoomEvent {
    pub name: String,
}

/// Join room event
#[derive(Debug, Deserialize)]
pub struct JoinRoomEvent {
    pub room_id: String,
    pub name: String,
}

/// User voted in a room
#[derive(Debug, Deserialize)]
pub struct VoteEvent {
    pub room_id: String,
    pub vote: u8,
}

/// Card values reveled to players
#[derive(Debug, Deserialize)]
pub struct RevealCardsEvent {
    pub room_id: String,
}

/// Votes reset in a room
#[derive(Debug, Deserialize)]
pub struct ResetVotesEvent {
    pub room_id: String,
}
