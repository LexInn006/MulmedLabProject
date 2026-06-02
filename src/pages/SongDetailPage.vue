<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { useProfileStore } from '../stores/profileStore'
// Import playlist store yang tadi sudah dibuat
import { usePlaylistStore } from '../stores/playlistStore'
import { songs } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, Heart, MonitorPlay, ListPlus, Check, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()
const profileStore = useProfileStore()
const playlistStore = usePlaylistStore()

const songId = computed(() => Number(route.params.id))
const currSong = computed(() => songs.find(s => s.id === songId.value) || songs[0])

const isCurrentPlaying = computed(() => {
  return player.currentSong?.id === currSong.value.id && player.isPlaying
})

const handlePlay = () => {
  if (player.currentSong?.id === currSong.value.id) {
    player.togglePlay()
  } else {
    player.playSong(currSong.value, songs)
  }
}

const goToMV = () => {
  if (currSong.value.mv) {
    router.push(`/music-video/${currSong.value.mv}`)
  }
}

// State untuk dropdown "Add to Playlist"
const showPlaylistDropdown = ref(false)

// Cek apakah lagu sudah ada di playlist tertentu
const isSongInPlaylist = (playlistId: number) => {
  const playlist = playlistStore.playlists.find(p => p.id === playlistId)
  if (!playlist) return false
  return playlist.songs.some(s => s.id === currSong.value.id)
}

// Tambah lagu ke playlist yang dipilih
const addToPlaylist = (playlistId: number) => {
  // Kalau lagu sudah ada, tidak perlu tambah lagi
  if (isSongInPlaylist(playlistId)) return
  playlistStore.addSongToPlaylist(playlistId, currSong.value)
  // Tutup dropdown setelah berhasil tambah
  showPlaylistDropdown.value = false
}

// Toggle buka/tutup dropdown playlist
const toggleDropdown = () => {
  showPlaylistDropdown.value = !showPlaylistDropdown.value
}
</script>

<template>
  <div class="song-detail-page" :class="{ 'is-light': !profileStore.isDarkMode }">
    <!-- Blurred Background -->
    <div
      class="bg-blur"
      :style="{ backgroundImage: `url(${currSong.cover})` }"
    ></div>
    <div class="bg-overlay"></div>

    <div class="content-wrapper">
      <div class="nav-container">
        <NavBar />
      </div>

      <div class="detail-main">
        <div class="cover-container">
          <img :src="currSong.cover" class="main-cover" />
        </div>

        <div class="info-container">
          <span class="type-label">Single</span>
          <h1 class="song-title">{{ currSong.title }}</h1>
          <p class="song-artist">{{ currSong.artist }} • {{ currSong.duration }}</p>

          <div class="action-buttons">
            <!-- Tombol Play/Pause -->
            <button class="play-btn" @click="handlePlay">
              <Pause v-if="isCurrentPlaying" :size="32" fill="currentColor" stroke="currentColor" />
              <Play v-else :size="32" fill="currentColor" stroke="currentColor" style="margin-left: 4px;" />
            </button>

            <!-- Tombol Like -->
            <button class="like-btn" @click="player.toggleLike(currSong.id)">
              <Heart
                :size="40"
                :fill="player.isLiked(currSong.id) ? '#8b5cf6' : 'none'"
                :stroke="player.isLiked(currSong.id) ? '#8b5cf6' : (profileStore.isDarkMode ? '#ffffff' : '#000000')"
              />
            </button>

            <!-- Tombol Watch Music Video -->
            <button v-if="currSong.mv" class="mv-btn" @click="goToMV">
              <MonitorPlay :size="20" /> Watch Music Video
            </button>

            <!-- Tombol Add to Playlist + Dropdown -->
            <div class="playlist-wrapper">
              <button class="add-playlist-btn" @click="toggleDropdown">
                <ListPlus :size="20" />
                Add to Playlist
              </button>

              <!-- Dropdown daftar playlist -->
              <div v-if="showPlaylistDropdown" class="playlist-dropdown">

                <!-- Header dropdown + tombol tutup -->
                <div class="dropdown-header">
                  <span>Add to Playlist</span>
                  <button class="dropdown-close" @click="showPlaylistDropdown = false">
                    <X :size="16" />
                  </button>
                </div>

                <!-- Kalau belum ada playlist sama sekali -->
                <div v-if="playlistStore.playlists.length === 0" class="dropdown-empty">
                  <p>No playlists yet</p>
                  <small>Create a playlist first from the sidebar</small>
                </div>

                <!-- Daftar playlist yang bisa dipilih -->
                <div
                  v-for="playlist in playlistStore.playlists"
                  :key="playlist.id"
                  class="dropdown-item"
                  :class="{ 'already-added': isSongInPlaylist(playlist.id) }"
                  @click="addToPlaylist(playlist.id)"
                >
                  <!-- Cover playlist kecil -->
                  <div class="dropdown-cover">
                    <img v-if="playlist.cover" :src="playlist.cover" alt="cover" />
                    <span v-else>🎵</span>
                  </div>

                  <div class="dropdown-info">
                    <span class="dropdown-name">{{ playlist.name }}</span>
                    <span class="dropdown-count">{{ playlist.songs.length }} songs</span>
                  </div>

                  <!-- Icon centang kalau lagu sudah ada di playlist ini -->
                  <Check v-if="isSongInPlaylist(playlist.id)" :size="16" class="check-icon" />
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.song-detail-page {
  position: relative;
  min-height: 100vh;
  color: #ffffff;
}

.song-detail-page.is-light {
  color: #111111;
}

.bg-blur {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
  transition: background-image 0.5s ease;
}

.is-light .bg-blur {
  opacity: 0.2;
}

.bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%);
  z-index: 1;
  pointer-events: none;
}

.is-light .bg-overlay {
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, var(--bg-base) 100%);
}

.content-wrapper {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.nav-container {
  padding: 0 32px;
}

.detail-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  padding: 48px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  overflow: visible;
}

@media (max-width: 768px) {
  .detail-main {
    flex-direction: column;
    text-align: center;
    gap: 32px;
  }
}

.cover-container {
  flex-shrink: 0;
}

.main-cover {
  width: 400px;
  height: 400px;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.6);
  object-fit: cover;
  transition: transform 0.3s ease;
}

.is-light .main-cover {
  box-shadow: 0 24px 64px rgba(0,0,0,0.2);
}

.main-cover:hover {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .main-cover {
    width: 300px;
    height: 300px;
  }
}

.info-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: visible;
}

@media (max-width: 768px) {
  .info-container {
    align-items: center;
  }
}

.type-label {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  color: var(--text-secondary);
}

.song-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 900;
  margin: 0 0 16px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}

.song-artist {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 40px 0;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  overflow: visible;
  position: relative;
}

.play-btn {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: var(--text-primary);
  color: var(--bg-base);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.play-btn:hover {
  transform: scale(1.05);
}

.play-btn:active {
  transform: scale(0.95);
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.like-btn:hover {
  transform: scale(1.1);
}

.mv-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  color: inherit;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 32px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.is-light .mv-btn {
  background-color: rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.1);
}

.mv-btn:hover {
  background-color: var(--text-primary);
  color: var(--bg-base);
  transform: scale(1.02);
}

.add-playlist-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  color: var(--text-secondary);
  border: none;
  border-radius: 32px;
  padding: 8px 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-playlist-btn:hover {
  color: var(--text-primary);
  transform: scale(1.05);
}

.playlist-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 280px;
  max-height: 320px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--bg-elevated);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  z-index: 999;
}

.dropdown-cover {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  border-radius: 6px;
  background-color: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  font-size: 1.2rem;
}

.dropdown-cover img {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

/* Wrapper harus relative agar dropdown muncul di posisi yang benar */
.playlist-wrapper {
  position: relative;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 12px;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  border-bottom: 1px solid var(--bg-highlight);
}

.dropdown-close {
  background: none;
  border: none;
  color: var(--text-subdued);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.dropdown-close:hover {
  color: var(--text-primary);
}

.dropdown-empty {
  padding: 24px 16px;
  text-align: center;
  color: var(--text-subdued);
}

.dropdown-empty p {
  margin: 0 0 4px;
  font-size: 0.9rem;
  font-weight: 600;
}

.dropdown-empty small {
  font-size: 0.8rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--bg-highlight);
}

.dropdown-item.already-added {
  opacity: 0.5;
  cursor: default;
}

.dropdown-item.already-added:hover {
  background-color: transparent;
}

.dropdown-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-count {
  font-size: 0.78rem;
  color: var(--text-subdued);
}

.check-icon {
  color: var(--accent);
  flex-shrink: 0;
}
</style>
