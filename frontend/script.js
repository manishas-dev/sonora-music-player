
// SONORA - MUSIC PLAYER FRONTEND

const audio = document.getElementById("audioPlayer");

const trackList = document.getElementById("trackList");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const nowTitle = document.getElementById("nowTitle");
const nowArtist = document.getElementById("nowArtist");
const nowArt = document.getElementById("nowArt");

const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");

const searchInput = document.getElementById("searchInput");
const songCount = document.getElementById("songCount");
const emptyState = document.getElementById("emptyState");
const likeBtn = document.getElementById("likeBtn");

// Sample music library
// Keep these filenames identical to your actual MP3 files.

const songs = [
    {
        id: 1,
        title: "Midnight Memories",
        artist: "Dreamscape",
        album: "After Hours",
        src: "../music/song1.mp3",
        color: "linear-gradient(135deg,#614b82,#bd9bd6)"
    },
    {
        id: 2,
        title: "Golden Hour",
        artist: "The Sunsets",
        album: "Golden Days",
        src: "../music/song2.mp3",
        color: "linear-gradient(135deg,#a45d38,#f4c27b)"
    },
    {
        id: 3,
        title: "Ocean Eyes",
        artist: "Blue Waves",
        album: "Deep Blue",
        src: "../music/song3.mp3",
        color: "linear-gradient(135deg,#245a78,#76c4d8)"
    }
];

// Player state
let currentIndex = -1;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let likedSongs = [];
let currentFilter = "all";
let recentlyPlayed = [];

// Format seconds into minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${String(secs).padStart(2, "0")}`;
}

// Render playlist
function renderSongs() {
    trackList.innerHTML = "";

    let visibleSongs = songs.filter(song => {
        const matchesSearch =
            (song.title + " " + song.artist + " " + song.album)
            .toLowerCase()
            .includes(searchInput.value.toLowerCase());

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "liked" &&
            likedSongs.includes(song.id)) ||
            (currentFilter === "recent" &&
            recentlyPlayed.includes(song.id));

        return matchesSearch && matchesFilter;
    });

    songCount.textContent =
        `${visibleSongs.length} TRACK${visibleSongs.length === 1 ? "" : "S"}`;

    emptyState.style.display =
        visibleSongs.length === 0 ? "block" : "none";

    visibleSongs.forEach((song, index) => {
        const realIndex = songs.findIndex(s => s.id === song.id);

        const row = document.createElement("div");

        row.className = "track-row";

        if (realIndex === currentIndex) {
            row.classList.add("playing");
        }

        row.innerHTML = `
            <span class="track-number">${index + 1}</span>

            <div class="track-title">
                <div class="track-art"
                     style="background:${song.color};
                     display:grid;place-items:center;
                     color:white;font-size:19px;">
                    ♫
                </div>

                <div>
                    <strong>${escapeHTML(song.title)}</strong>
                    <small>${escapeHTML(song.artist)}</small>
                </div>
            </div>

            <span class="album-name">${escapeHTML(song.album)}</span>

            <span class="track-duration">♫</span>

            <button class="track-heart"
                    data-like="${song.id}">
                ${likedSongs.includes(song.id) ? "♥" : "♡"}
            </button>
        `;

        row.addEventListener("click", () => {
            loadSong(realIndex);
            playSong();
        });

        row.querySelector(".track-heart").addEventListener(
            "click", event => {
                event.stopPropagation();
                toggleLike(song.id);
            }
        );

        trackList.appendChild(row);
    });
}

// Prevent song information from becoming HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

// Load selected song
function loadSong(index) {
    if (index < 0 || index >= songs.length) return;

    currentIndex = index;

    const selectedId = songs[index].id;

    recentlyPlayed = [
        selectedId,
        ...recentlyPlayed.filter(id => id !== selectedId)
    ];

    const song = songs[currentIndex];

    audio.src = song.src;
    audio.load();

    nowTitle.textContent = song.title;
    nowArtist.textContent = song.artist;

    nowArt.style.background = song.color;
    nowArt.textContent = "♫";

    progressBar.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    updateLikeButton();
    renderSongs();
}

// Play audio
function playSong() {
    if (currentIndex === -1) {
        loadSong(0);
    }

    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.textContent = "Ⅱ";
        })
        .catch(error => {
            isPlaying = false;
            playBtn.textContent = "▶";
            console.error("Audio playback error:", error);

            alert(
                "Unable to play this song. Check that the MP3 file exists in the music folder."
            );
        });
}

// Pause audio
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
}

// Play / pause button
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Next song
function nextSong() {
    if (songs.length === 0) return;

    if (isShuffle && songs.length > 1) {
        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentIndex);

        loadSong(randomIndex);
    } else {
        loadSong((currentIndex + 1) % songs.length);
    }

    playSong();
}

// Previous song
function previousSong() {
    if (songs.length === 0) return;

    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    const previousIndex =
        (currentIndex - 1 + songs.length) % songs.length;

    loadSong(previousIndex);
    playSong();
}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", previousSong);

// Shuffle
shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("enabled", isShuffle);
});

// Repeat
repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("enabled", isRepeat);
    audio.loop = isRepeat;
});

// Update playback progress
audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration)) return;

    const progress =
        (audio.currentTime / audio.duration) * 100;

    progressBar.value = progress;

    currentTime.textContent = formatTime(audio.currentTime);
    duration.textContent = formatTime(audio.duration);
});

// Seek through song
progressBar.addEventListener("input", () => {
    if (Number.isFinite(audio.duration)) {
        audio.currentTime =
            (progressBar.value / 100) * audio.duration;
    }
});

// Volume control
volumeBar.addEventListener("input", () => {
    audio.volume = Number(volumeBar.value);
});

audio.volume = 0.7;

// Automatically move to next song
audio.addEventListener("ended", () => {
    if (!isRepeat) {
        nextSong();
    }
});

// Update duration when audio loads
audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
});

// Like / unlike songs
function toggleLike(id) {
    if (likedSongs.includes(id)) {
        likedSongs = likedSongs.filter(songId => songId !== id);
    } else {
        likedSongs.push(id);
    }

    updateLikeButton();
    renderSongs();
}

function updateLikeButton() {
    if (currentIndex === -1) {
        likeBtn.textContent = "♡";
        return;
    }

    likeBtn.textContent =
        likedSongs.includes(songs[currentIndex].id) ? "♥" : "♡";
}

likeBtn.addEventListener("click", () => {
    if (currentIndex !== -1) {
        toggleLike(songs[currentIndex].id);
    }
});

// Search functionality
searchInput.addEventListener("input", renderSongs);

// Navigation buttons
document.getElementById("homeBtn").addEventListener("click", () => {
    currentFilter = "all";
    searchInput.value = "";
    document.getElementById("listHeading").textContent = "Recently Added";
    renderSongs();
});

document.getElementById("libraryBtn").addEventListener("click", () => {
    currentFilter = "all";
    searchInput.value = "";
    document.getElementById("listHeading").textContent = "Your Library";
    renderSongs();
});

document.getElementById("searchBtn").addEventListener("click", () => {
    searchInput.focus();
});

document.getElementById("allSongsCard").addEventListener("click", () => {
    currentFilter = "all";
    searchInput.value = "";
    document.getElementById("listHeading").textContent = "All Songs";
    renderSongs();
});

document.getElementById("likedCard").addEventListener("click", () => {
    currentFilter = "liked";
    searchInput.value = "";
    document.getElementById("listHeading").textContent = "Liked Songs";
    renderSongs();
});

// Initial setup
renderSongs();

console.log("Sonora Music Player initialized successfully!");


// SIDEBAR PLAYLIST NAVIGATION

document.getElementById("sidebarLiked")
    .addEventListener("click", () => {
        currentFilter = "liked";
        searchInput.value = "";
        document.getElementById("listHeading").textContent =
            "Liked Songs";
        renderSongs();
    });

document.getElementById("sidebarPlaylist")
    .addEventListener("click", () => {
        currentFilter = "all";
        searchInput.value = "";
        document.getElementById("listHeading").textContent =
            "My Playlist";
        renderSongs();
    });

document.getElementById("sidebarRecent")
    .addEventListener("click", () => {
        currentFilter = "recent";
        searchInput.value = "";
        document.getElementById("listHeading").textContent =
            "Recently Played";
        renderSongs();
    });
