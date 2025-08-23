#![warn(clippy::all, clippy::pedantic, clippy::nursery)]

use std::{collections::HashMap, error::Error, fmt};

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
    /// Indicates if the player is a spectator
    pub is_spectator: bool,
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
    /// whether the player is a spectator
    pub is_spectator: bool,
}

/// Join room event
#[derive(Debug, Deserialize)]
pub struct JoinRoomEvent {
    /// The name of the player joining the room
    pub name: String,
    /// The ID of the room to join
    pub room_id: String,
    /// whether the player is a spectator
    pub is_spectator: bool,
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
}

pub trait SocketEvent {
    const EVENT: &'static str;
    type Data: serde::Serialize;
}

pub struct RoomCreatedEvent;
impl SocketEvent for RoomCreatedEvent {
    const EVENT: &'static str = "roomCreated";
    type Data = Room;
}

pub struct PlayerJoinedEvent;
impl SocketEvent for PlayerJoinedEvent {
    const EVENT: &'static str = "playerJoined";
    type Data = Room;
}

pub struct PlayerVotedEvent;
impl SocketEvent for PlayerVotedEvent {
    const EVENT: &'static str = "playerVoted";
    type Data = Room;
}

pub struct CardsRevealedEvent;
impl SocketEvent for CardsRevealedEvent {
    const EVENT: &'static str = "cardsRevealed";
    type Data = Room;
}

pub struct VotesResetEvent;
impl SocketEvent for VotesResetEvent {
    const EVENT: &'static str = "votesReset";
    type Data = Room;
}

pub struct PlayerDisconnectedEvent;
impl SocketEvent for PlayerDisconnectedEvent {
    const EVENT: &'static str = "playerDisconnected";
    type Data = Room;
}

pub struct NewHostElectedEvent;
impl SocketEvent for NewHostElectedEvent {
    const EVENT: &'static str = "newHostElected";
    type Data = String;
}

pub struct RoomNotFoundEvent;
impl SocketEvent for RoomNotFoundEvent {
    const EVENT: &'static str = "roomNotFound";
    type Data = ();
}

#[derive(Debug)]
pub struct RoomNotFoundError {
    pub room_id: String,
}

impl Error for RoomNotFoundError {}

impl fmt::Display for RoomNotFoundError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Room does not exist: {}", self.room_id)
    }
}

#[derive(Debug)]
pub struct RoomEmptyError;

impl Error for RoomEmptyError {}

impl fmt::Display for RoomEmptyError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Room is empty")
    }
}
