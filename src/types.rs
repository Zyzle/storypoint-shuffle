#![warn(clippy::all, clippy::pedantic, clippy::nursery)]

use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use uuid::Uuid;

/// Player represents a connected user
/// It contains their ID, name, vote, and whether they have voted
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Player {
    /// Indicates if the player has voted
    pub has_voted: bool,
    /// Unique identifier for the player
    pub id: String,
    /// The player's name
    pub name: String,
    /// The player's vote, if any
    pub vote: Option<u8>,
}

/// `Room` represents a game room
/// It contains the room ID, host ID, and a list of players
/// and whether the cards have been revealed
#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Room {
    /// Whether or not the room cards have been revealed
    pub cards_revealed: bool,
    /// the room host's ID
    pub host_id: String,
    /// Unique identifier for the room
    pub id: Uuid,
    /// A list of players in the room
    pub players: HashMap<String, Player>,
}

/// `AppState` holds the global application state
/// It contains a map of room IDs to Room objects
/// and is protected by a Mutex for thread safety
#[derive(Debug, Default)]
pub struct AppState {
    /// A map of room IDs to Room objects
    /// Protected by a Mutex for thread safety
    pub rooms: Mutex<HashMap<Uuid, Room>>,
}

/// `Room` created event
#[derive(Debug, Deserialize)]
pub struct CreateRoomEvent {
    /// The name of the player creating the room
    pub name: String,
}

/// Join room event
#[derive(Debug, Deserialize)]
pub struct JoinRoomEvent {
    /// The name of the player joining the room
    pub name: String,
    /// The ID of the room to join
    pub room_id: String,
}

/// User voted in a room
#[derive(Debug, Deserialize)]
pub struct VoteEvent {
    /// The ID of the room where the vote is cast
    pub room_id: String,
    /// The player's vote
    pub vote: u8,
}

/// Card values reveled to players
#[derive(Debug, Deserialize)]
pub struct RevealCardsEvent {
    /// The ID of the room where the cards are revealed
    pub room_id: String,
}

/// Votes reset in a room
#[derive(Debug, Deserialize)]
pub struct ResetVotesEvent {
    /// The ID of the room where the votes are reset
    pub room_id: String,
}

/// Player exits a room
#[derive(Debug, Deserialize)]
pub struct PlayerExitEvent {
    /// The ID of the room the player is exiting
    pub room_id: String,
    /// The ID of the player exiting the room
    pub player_id: String,
}
