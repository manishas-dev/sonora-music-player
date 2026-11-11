#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX 100

// Doubly Linked List Node
typedef struct Song {
    int id;
    char title[MAX];
    char artist[MAX];
    char filepath[MAX];

    struct Song *prev;
    struct Song *next;
} Song;

// Global pointers
Song *head = NULL;
Song *tail = NULL;
Song *current = NULL;

int songCount = 0;
int nextId = 1;

// Read a complete line safely
void readLine(const char *prompt, char *buffer, int size) {
    printf("%s", prompt);

    if (fgets(buffer, size, stdin) != NULL) {
        buffer[strcspn(buffer, "\n")] = '\0';
    }
}

// Read menu choice
int readChoice(void) {
    char buffer[50];
    char *end;
    long value;

    if (!fgets(buffer, sizeof(buffer), stdin))
        return -1;

    value = strtol(buffer, &end, 10);

    if (end == buffer || (*end != '\n' && *end != '\0'))
        return -1;

    return (int)value;
}

// Create a new song node
Song* createSong(char title[], char artist[],
                 char filepath[]) {

    Song *newSong = (Song*)malloc(sizeof(Song));

    if (newSong == NULL) {
        printf("Memory allocation failed!\n");
        return NULL;
    }

    newSong->id = nextId++;

    strcpy(newSong->title, title);
    strcpy(newSong->artist, artist);
    strcpy(newSong->filepath, filepath);

    newSong->prev = NULL;
    newSong->next = NULL;

    return newSong;
}

// Add song to the end of playlist
void addSong(void) {
    char title[MAX];
    char artist[MAX];
    char filepath[MAX];

    readLine("Enter song title: ", title, MAX);
    readLine("Enter artist name: ", artist, MAX);
    readLine("Enter audio file path: ", filepath, MAX);

    if (strlen(title) == 0 || strlen(artist) == 0) {
        printf("Title and artist cannot be empty!\n");
        return;
    }

    Song *newSong = createSong(title, artist, filepath);

    if (newSong == NULL)
        return;

    if (head == NULL) {
        head = tail = newSong;
        current = newSong;
    } else {
        tail->next = newSong;
        newSong->prev = tail;
        tail = newSong;
    }

    songCount++;

    printf("\nSong added successfully!\n");
}

// Display all songs
void displayPlaylist(void) {
    Song *temp = head;

    if (head == NULL) {
        printf("\nPlaylist is empty!\n");
        return;
    }

    printf("\n========== MUSIC PLAYLIST ==========\n");

    while (temp != NULL) {
        printf("\nID: %d", temp->id);
        printf("\nTitle: %s", temp->title);
        printf("\nArtist: %s", temp->artist);
        printf("\nFile: %s", temp->filepath);

        if (temp == current)
            printf("\n[CURRENT SONG]");

        printf("\n------------------------------------");

        temp = temp->next;
    }

    printf("\nTotal songs: %d\n", songCount);
}

// Search for a song
void searchSong(void) {
    char title[MAX];
    Song *temp = head;

    readLine("\nEnter song title to search: ", title, MAX);

    while (temp != NULL) {
        if (strcmp(temp->title, title) == 0) {
            printf("\nSong found!");
            printf("\nID: %d", temp->id);
            printf("\nTitle: %s", temp->title);
            printf("\nArtist: %s\n", temp->artist);
            return;
        }

        temp = temp->next;
    }

    printf("\nSong not found!\n");
}

// Delete a song by title
void deleteSong(void) {
    char title[MAX];
    Song *temp = head;

    if (head == NULL) {
        printf("\nPlaylist is empty!\n");
        return;
    }

    readLine("\nEnter song title to delete: ", title, MAX);

    while (temp != NULL &&
           strcmp(temp->title, title) != 0) {
        temp = temp->next;
    }

    if (temp == NULL) {
        printf("\nSong not found!\n");
        return;
    }

    // Update current song if necessary
    if (current == temp) {
        current = temp->next ? temp->next : temp->prev;
    }

    // Update previous node
    if (temp->prev != NULL) {
        temp->prev->next = temp->next;
    } else {
        head = temp->next;
    }

    // Update next node
    if (temp->next != NULL) {
        temp->next->prev = temp->prev;
    } else {
        tail = temp->prev;
    }

    printf("\nDeleted: %s\n", temp->title);

    free(temp);
    songCount--;

    if (songCount == 0)
        current = NULL;
}

// Play next song
void nextSong(void) {
    if (current == NULL) {
        printf("\nPlaylist is empty!\n");
        return;
    }

    if (current->next != NULL) {
        current = current->next;
        printf("\nNow playing: %s - %s\n",
               current->title, current->artist);
    } else {
        printf("\nYou are already at the last song!\n");
    }
}

// Play previous song
void previousSong(void) {
    if (current == NULL) {
        printf("\nPlaylist is empty!\n");
        return;
    }

    if (current->prev != NULL) {
        current = current->prev;
        printf("\nNow playing: %s - %s\n",
               current->title, current->artist);
    } else {
        printf("\nYou are already at the first song!\n");
    }
}

// Select a song by title
void selectSong(void) {
    char title[MAX];
    Song *temp = head;

    readLine("\nEnter song title to select: ", title, MAX);

    while (temp != NULL) {
        if (strcmp(temp->title, title) == 0) {
            current = temp;

            printf("\nSelected song: %s - %s\n",
                   current->title, current->artist);
            return;
        }

        temp = temp->next;
    }

    printf("\nSong not found!\n");
}

// Show currently selected song
void showCurrentSong(void) {
    if (current == NULL) {
        printf("\nNo song selected!\n");
        return;
    }

    printf("\nCurrently selected song:");
    printf("\nTitle: %s", current->title);
    printf("\nArtist: %s", current->artist);
    printf("\nFile: %s\n", current->filepath);
}

// Display total number of songs
void totalSongs(void) {
    printf("\nTotal songs in playlist: %d\n", songCount);
}

// Free allocated memory
void freePlaylist(void) {
    Song *temp = head;

    while (temp != NULL) {
        Song *next = temp->next;
        free(temp);
        temp = next;
    }

    head = tail = current = NULL;
    songCount = 0;
}

// Main function
int main(void) {
    int choice;

    printf("\n====================================");
    printf("\n       MUSIC PLAYER BACKEND");
    printf("\n     DOUBLY LINKED LIST IN C");
    printf("\n====================================");

    do {
        printf("\n\n========== MAIN MENU ==========");
        printf("\n1. Add Song");
        printf("\n2. Delete Song");
        printf("\n3. Display Playlist");
        printf("\n4. Search Song");
        printf("\n5. Next Song");
        printf("\n6. Previous Song");
        printf("\n7. Select Song");
        printf("\n8. Show Current Song");
        printf("\n9. Total Songs");
        printf("\n0. Exit");
        printf("\n===============================");
        printf("\nEnter your choice: ");

        choice = readChoice();

        switch (choice) {
            case 1:
                addSong();
                break;

            case 2:
                deleteSong();
                break;

            case 3:
                displayPlaylist();
                break;

            case 4:
                searchSong();
                break;

            case 5:
                nextSong();
                break;

            case 6:
                previousSong();
                break;

            case 7:
                selectSong();
                break;

            case 8:
                showCurrentSong();
                break;

            case 9:
                totalSongs();
                break;

            case 0:
                printf("\nClosing Music Player...\n");
                break;

            default:
                printf("\nInvalid choice! Try again.\n");
        }

    } while (choice != 0);

    freePlaylist();

    printf("\nMemory released successfully!\n");

    return 0;
}
