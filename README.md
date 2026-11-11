
# 🎧 Sonora - Music Player

A web-based music player developed as a Data Structures mini project using C, HTML, CSS and JavaScript.

## ✨ Project Overview

Sonora is a desktop-style music player that provides a simple and interactive environment for listening to music and managing playlists.

The project explores the application of linked lists in playlist management.

## 🛠️ Technologies Used

- C Programming
- HTML5
- CSS3
- JavaScript
- HTML Audio API
- GCC Compiler

## 📂 Project Structure

```text
Sonora/
├── ds-engine/
│   └── main.c
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── music/
└── README.md
```

## 🧠 Data Structures

The C module implements a Doubly Linked List.

Operations include:
- Insertion of songs
- Deletion of songs
- Searching for songs
- Playlist traversal
- Forward and backward navigation

## 🎵 Frontend Features

- Music playback
- Play and pause controls
- Next and previous track navigation
- Song search
- Shuffle and repeat
- Volume control
- Liked songs
- Recently played tracks

## 🚀 How to Run

1. Clone the repository.
2. Add MP3 files to the music folder.
3. Open frontend/index.html using VS Code Live Server.
4. Compile the C module:

```bash
gcc ds-engine/main.c -o ds-engine/main.exe
```

5. Run the executable to test playlist operations.

## 📌 Project Status

Student mini project prototype.

The C data-structure module and JavaScript playback interface are currently separate components. Integration is a planned enhancement.
