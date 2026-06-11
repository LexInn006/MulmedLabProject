<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { useProfileStore } from '../stores/profileStore'
import { usePlaylistStore } from '../stores/playlistStore'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, Trash2, ListMusic, Pencil, Check, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()
const profileStore = useProfileStore()
const playlistStore = usePlaylistStore()

// Ambil ID playlist dari URL, contoh: /playlist/123 → id = 123
const playlistId = computed(() => Number(route.params.id))

// Cari data playlist berdasarkan ID
const playlist = computed(() =>
  playlistStore.playlists.find(p => p.id === playlistId.value)
)

// Cek apakah playlist sedang aktif diputar
const isPlaylistPlaying = computed(() => {
  if (!playlist.value || playlist.value.songs.length === 0) return false
  return (
    player.isPlaying &&
    playlist.value.songs.some(s => s.id === player.currentSong?.id)
  )
})

// Play semua lagu di playlist dari lagu pertama
const playAll = () => {
  if (!playlist.value || playlist.value.songs.length === 0) return
  player.playSong(playlist.value.songs[0], playlist.value.songs)
}

// Toggle play/pause untuk playlist
const togglePlayAll = () => {
  if (isPlaylistPlaying.value) {
    player.togglePlay()
  } else {
    playAll()
  }
}

// Play satu lagu tertentu dari dalam playlist
const playSong = (songId: number) => {
  if (!playlist.value) return
  const song = playlist.value.songs.find(s => s.id === songId)
  if (!song) return
  player.playSong(song, playlist.value.songs)
}

// Cek apakah lagu tertentu sedang diputar
const isSongPlaying = (songId: number) => {
  return player.currentSong?.id === songId && player.isPlaying
}

// Hapus lagu dari playlist ini
const removeSong = (songId: number) => {
  playlistStore.removeSongFromPlaylist(playlistId.value, songId)
}

// State untuk mode edit nama playlist
const isEditingName = ref(false)
const editedName = ref('')

// Masuk ke mode edit nama
const startEditName = () => {
  editedName.value = playlist.value?.name || ''
  isEditingName.value = true
}

// Simpan nama baru playlist
const saveEditName = () => {
  if (!editedName.value.trim()) return
  const pl = playlistStore.playlists.find(p => p.id === playlistId.value)
  if (!pl) return
  pl.name = editedName.value.trim()
  playlistStore.save()
  isEditingName.value = false
}

// Batal edit nama
const cancelEditName = () => {
  isEditingName.value = false
}

// Hapus seluruh playlist lalu kembali ke home
const deletePlaylist = () => {
  playlistStore.deletePlaylist(playlistId.value)
  router.push('/')
}
</script>

<template>
  <div class="playlist-page" :class="{ 'is-light': !profileStore.isDarkMode }">

    <!-- Kalau playlist tidak ditemukan -->
    <div v-if="!playlist" class="not-found">
      <p>Playlist not found</p>
      <button class="back-btn" @click="router.push('/')">← Back to Home</button>
    </div>

    <template v-else>
      <!-- Blurred background dari cover playlist -->
      <div
        class="bg-blur"
        :style="{ backgroundImage: playlist.cover ? `url(${playlist.cover})` : 'none' }"
      ></div>
      <div class="bg-overlay"></div>

      <div class="content-wrapper">
        <div class="nav-container">
          <NavBar />
        </div>

        <!-- Header playlist: cover + nama + info -->
        <div class="playlist-header">

          <!-- Cover playlist -->
          <div class="playlist-cover">
            <img v-if="playlist.cover" :src="playlist.cover" alt="cover" />
            <div v-else class="cover-placeholder">
              <ListMusic :size="64" />
            </div>
          </div>

          <!-- Info playlist -->
          <div class="playlist-info">
            <span class="type-label">Playlist</span>

            <!-- Nama playlist: mode normal atau mode edit -->
            <div class="name-row">
              <div v-if="!isEditingName" class="name-display">
                <h1 class="playlist-name">{{ playlist.name }}</h1>
                <!-- Tombol edit nama -->
                <button class="icon-btn" @click="startEditName" title="Edit name">
                  <Pencil :size="20" />
                </button>
              </div>

              <!-- Input edit nama -->
              <div v-else class="name-edit">
                <input
                  v-model="editedName"
                  class="name-input"
                  type="text"
                  @keyup.enter="saveEditName"
                  autofocus
                />
                <button class="icon-btn" @click="saveEditName" title="Save">
                  <Check :size="20" />
                </button>
                <button class="icon-btn" @click="cancelEditName" title="Cancel">
                  <X :size="20" />
                </button>
              </div>
            </div>

            <!-- Jumlah lagu -->
            <p class="playlist-meta">{{ playlist.songs.length }} songs</p>

            <!-- Tombol aksi: Play All + Delete Playlist -->
            <div class="playlist-actions">
              <button
                class="play-all-btn"
                :disabled="playlist.songs.length === 0"
                @click="togglePlayAll"
              >
                <Pause v-if="isPlaylistPlaying" :size="28" fill="currentColor" stroke="currentColor" />
                <Play v-else :size="28" fill="currentColor" stroke="currentColor" style="margin-left: 3px;" />
              </button>

              <button class="delete-all-btn" @click="deletePlaylist" title="Delete Playlist">
                <Trash2 :size="20" />
                Delete Playlist
              </button>
            </div>
          </div>
        </div>

        <!-- Daftar lagu di dalam playlist -->
        <div class="songs-section">

          <!-- Kalau playlist kosong -->
          <div v-if="playlist.songs.length === 0" class="empty-playlist">
            <ListMusic :size="48" />
            <p>This playlist is empty</p>
            <small>Go to a song and click "Add to Playlist"</small>
          </div>

          <!-- List lagu -->
          <div v-else class="songs-list">

            <!-- Header kolom -->
            <div class="songs-list-header">
              <span class="col-num">#</span>
              <span class="col-title">Title</span>
              <span class="col-artist">Artist</span>
              <span class="col-action"></span>
            </div>

            <div class="songs-list-divider"></div>

            <!-- Baris setiap lagu -->
            <div
              v-for="(song, index) in playlist.songs"
              :key="song.id"
              class="song-row"
              :class="{ 'is-playing': isSongPlaying(song.id) }"
              @click="playSong(song.id)"
            >
              <!-- Nomor urut / icon play saat hover -->
              <div class="col-num">
                <span class="row-num">{{ index + 1 }}</span>
                <div class="row-play-icon">
                  <Pause v-if="isSongPlaying(song.id)" :size="16" fill="currentColor" stroke="currentColor" />
                  <Play v-else :size="16" fill="currentColor" stroke="currentColor" />
                </div>
              </div>

              <!-- Cover + judul lagu -->
              <div class="col-title">
                <img :src="song.cover" class="row-cover" :alt="song.title" />
                <span class="row-title" :class="{ 'active-title': isSongPlaying(song.id) }">
                  {{ song.title }}
                </span>
              </div>

              <!-- Nama artis -->
              <span class="col-artist row-artist">{{ song.artist }}</span>

              <!-- Tombol hapus lagu dari playlist -->
              <div class="col-action">
                <button
                  class="remove-btn"
                  @click.stop="removeSong(song.id)"
                  title="Remove from playlist"
                >
                  <Trash2 :size="16" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </template>
  </div>
</template>

<style scoped>
.playlist-page {
  position: relative;
  min-height: 100vh;
  color: #ffffff;
  overflow: hidden;
}

.playlist-page.is-light {
  color: #111111;
}

/* Background blur dari cover playlist */
.bg-blur {
  position: absolute;
  inset: -10%;
  background-size: cover;
  background-position: center;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.4;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, var(--bg-base) 40%);
  z-index: 1;
}

.is-light .bg-overlay {
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, var(--bg-base) 40%);
}

.content-wrapper {
  position: relative;
  z-index: 2;
  min-height: 100vh;
}

.nav-container {
  padding: 0 32px;
}

/* Header playlist */
.playlist-header {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  padding: 32px 32px 40px;
}

@media (max-width: 600px) {
  .playlist-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

/* Cover playlist besar */
.playlist-cover {
  width: 220px;
  height: 220px;
  border-radius: 12px;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  background-color: var(--bg-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-subdued);
}

/* Info playlist */
.playlist-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
}

.type-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--text-secondary);
}

/* Baris nama + tombol edit */
.name-row {
  display: flex;
  align-items: center;
}

.name-display {
  display: flex;
  align-items: center;
  gap: 12px;
}

.playlist-name {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  margin: 0;
  line-height: 1.1;
}

/* Input edit nama */
.name-edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-input {
  font-size: 2rem;
  font-weight: 700;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--accent);
  color: inherit;
  outline: none;
  padding: 4px 0;
  width: 280px;
}

/* Tombol icon (edit, save, cancel) */
.icon-btn {
  background: none;
  border: none;
  color: var(--text-subdued);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  color: var(--text-primary);
  background-color: var(--bg-highlight);
}

.playlist-meta {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Tombol aksi Play All + Delete */
.playlist-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.play-all-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--accent);
  color: #000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.play-all-btn:hover:not(:disabled) {
  transform: scale(1.05);
  background-color: var(--accent-hover);
}

.play-all-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.delete-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: inherit;
  border-radius: 32px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.is-light .delete-all-btn {
  border-color: rgba(0,0,0,0.15);
}

.delete-all-btn:hover {
  background-color: #e53e3e;
  border-color: #e53e3e;
  color: white;
}

/* Section daftar lagu */
.songs-section {
  padding: 0 32px 48px;
}

.empty-playlist {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 64px 0;
  color: var(--text-subdued);
  text-align: center;
}

.empty-playlist p {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-secondary);
}

.empty-playlist small {
  font-size: 0.9rem;
}

/* Tabel lagu */
.songs-list {
  display: flex;
  flex-direction: column;
}

.songs-list-header {
  display: grid;
  grid-template-columns: 48px 1fr 1fr 48px;
  padding: 0 16px 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-subdued);
}

.songs-list-divider {
  height: 1px;
  background-color: var(--bg-highlight);
  margin-bottom: 8px;
}

/* Setiap baris lagu */
.song-row {
  display: grid;
  grid-template-columns: 48px 1fr 1fr 48px;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s;
}

.song-row:hover {
  background-color: var(--bg-highlight);
}

/* Highlight lagu yang sedang diputar */
.song-row.is-playing {
  background-color: var(--bg-elevated);
}

/* Kolom nomor urut */
.col-num {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
}

.row-num {
  font-size: 0.9rem;
  color: var(--text-subdued);
}

/* Icon play/pause muncul saat hover, nomor disembunyikan */
.row-play-icon {
  position: absolute;
  opacity: 0;
  transition: opacity 0.2s;
}

.song-row:hover .row-num {
  opacity: 0;
}

.song-row:hover .row-play-icon {
  opacity: 1;
}

.song-row.is-playing .row-num {
  opacity: 0;
}

.song-row.is-playing .row-play-icon {
  opacity: 1;
  color: var(--accent);
}

/* Kolom judul lagu */
.col-title {
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
}

.row-cover {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
}

.row-title {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Warna hijau untuk lagu yang sedang diputar */
.active-title {
  color: var(--accent);
}

/* Kolom artis */
.col-artist {
  font-size: 0.85rem;
}

.row-artist {
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tombol hapus lagu */
.col-action {
  display: flex;
  justify-content: center;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-subdued);
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: all 0.2s;
}

.song-row:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: #e53e3e;
}

/* Not found */
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 16px;
  color: var(--text-secondary);
}

.back-btn {
  background: none;
  border: 1px solid var(--text-subdued);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  padding: 10px 24px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.back-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}
</style>