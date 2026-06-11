<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { useProfileStore } from '../stores/profileStore'
import { usePlaylistStore } from '../stores/playlistStore'
import { songs } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, Heart, MonitorPlay, ListPlus, Check, ListMusic } from 'lucide-vue-next'
import { onMounted, onUnmounted } from 'vue'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()
const profileStore = useProfileStore()
const playlistStore = usePlaylistStore()

// Ambil ID lagu dari URL dan cari datanya
const songId = computed(() => Number(route.params.id))
const currSong = computed(() => songs.find(s => s.id === songId.value) || songs[0])

// Cek apakah lagu ini sedang diputar
const isCurrentPlaying = computed(() => {
  return player.currentSong?.id === currSong.value.id && player.isPlaying
})

// Toggle play/pause lagu ini
const handlePlay = () => {
  if (player.currentSong?.id === currSong.value.id) {
    player.togglePlay()
  } else {
    player.playSong(currSong.value, songs)
  }
}

// Pergi ke halaman Music Video lagu ini
const goToMV = () => {
  if (currSong.value.mv) {
    router.push(`/music-video/${currSong.value.mv}`)
  }
}

// State buka/tutup dropdown playlist (dibuat sendiri, bukan Bootstrap)
const showDropdown = ref(false)

// Pesan sukses sementara setelah tambah lagu
const successMsg = ref('')

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Tutup dropdown kalau klik di luar area dropdown
const handleClickOutside = (e: MouseEvent) => {
  const wrapper = document.querySelector('.playlist-wrapper')
  if (wrapper && !wrapper.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

// Pasang event listener saat halaman dibuka
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Lepas event listener saat halaman ditutup agar tidak memory leak
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Cek apakah lagu sudah ada di playlist tertentu
const isSongInPlaylist = (playlistId: number) => {
  const playlist = playlistStore.playlists.find(p => p.id === playlistId)
  if (!playlist) return false
  return playlist.songs.some(s => s.id === currSong.value.id)
}

// Tambah lagu ke playlist yang dipilih
const addToPlaylist = (playlistId: number) => {
  if (isSongInPlaylist(playlistId)) return
  playlistStore.addSongToPlaylist(playlistId, currSong.value)

  // Tampilkan pesan sukses selama 2 detik lalu tutup dropdown
  successMsg.value = 'Added to playlist!'
  setTimeout(() => {
    successMsg.value = ''
    showDropdown.value = false
  }, 1500)
}
</script>

<template>
  <div class="song-detail-page" :class="{ 'is-light': !profileStore.isDarkMode }">

    <!-- Background blur dari cover lagu -->
    <div class="bg-blur" :style="{ backgroundImage: `url(${currSong.cover})` }"></div>
    <div class="bg-overlay"></div>


    <div class="content-wrapper">

      <!-- Navbar Bootstrap (1/2) -->
      <div class="nav-container">
        <NavBar />
      </div>

      <div class="detail-main">

        <!-- Cover lagu -->
        <div class="cover-container">
          <img :src="currSong.cover" class="main-cover" />
        </div>

        <!-- Info + tombol aksi -->
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

            <!-- Tombol Add to Playlist + Dropdown Vue murni (bukan Bootstrap) -->
            <div class="playlist-wrapper">
              <button class="add-playlist-btn" @click="toggleDropdown">
                <ListPlus :size="20" />
                Add to Playlist
              </button>

              <!-- Dropdown dibuat dari CSS biasa, bukan Bootstrap -->
              <div v-if="showDropdown" class="spj-dropdown" @click.stop>

                <!-- Pesan sukses setelah tambah lagu -->
                <div v-if="successMsg" class="spj-success-msg">
                  <Check :size="16" />
                  {{ successMsg }}
                </div>

                <!-- Kalau belum ada playlist -->
                <div v-else-if="playlistStore.playlists.length === 0" class="spj-dropdown-empty">
                  <ListMusic :size="24" />
                  <p>No playlists yet</p>
                  <small>Create one from the sidebar first</small>
                </div>

                <!-- Daftar playlist -->
                <template v-else>
                  <p class="spj-dropdown-title">Add to Playlist</p>
                  <div
                    v-for="playlist in playlistStore.playlists"
                    :key="playlist.id"
                    class="spj-dropdown-item"
                    :class="{ 'spj-already-added': isSongInPlaylist(playlist.id) }"
                    @click="addToPlaylist(playlist.id)"
                  >
                    <!-- Cover playlist kecil -->
                    <div class="spj-item-cover">
                      <img v-if="playlist.cover" :src="playlist.cover" alt="cover" />
                      <ListMusic v-else :size="16" />
                    </div>

                    <!-- Nama + jumlah lagu -->
                    <div class="spj-item-info">
                      <span class="spj-item-name">{{ playlist.name }}</span>
                      <span class="spj-item-count">{{ playlist.songs.length }} songs</span>
                    </div>

                    <!-- Centang kalau sudah ditambahkan -->
                    <Check v-if="isSongInPlaylist(playlist.id)" :size="16" class="spj-check" />
                  </div>
                </template>

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

/* Wrapper untuk posisi dropdown */
.playlist-wrapper {
  position: relative;
  z-index: 9999;
}

/* Dropdown murni Vue + CSS, bukan Bootstrap */
.spj-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 260px;
  max-height: 300px;
  overflow-y: auto;
  background-color: var(--bg-elevated);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  z-index: 9999;
  padding: 8px 0;
}

.spj-dropdown-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-subdued);
  padding: 8px 16px 4px;
  margin: 0;
}

/* Pesan sukses setelah tambah lagu */
.spj-success-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}

/* Empty state kalau belum ada playlist */
.spj-dropdown-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 24px 16px;
  text-align: center;
  color: var(--text-subdued);
}

.spj-dropdown-empty p {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.spj-dropdown-empty small {
  font-size: 0.78rem;
}

/* Item setiap playlist di dropdown */
.spj-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.spj-dropdown-item:hover {
  background-color: var(--bg-highlight);
}

/* Style kalau lagu sudah ada di playlist ini */
.spj-already-added {
  opacity: 0.5;
  cursor: default;
}

.spj-already-added:hover {
  background-color: transparent;
}

/* Cover playlist kecil di dalam dropdown */
.spj-item-cover {
  width: 36px;
  height: 36px;
  min-width: 36px;
  border-radius: 6px;
  background-color: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: var(--text-subdued);
  flex-shrink: 0;
}

.spj-item-cover img {
  width: 36px;
  height: 36px;
  object-fit: cover;
  display: block;
}

.spj-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.spj-item-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spj-item-count {
  font-size: 0.75rem;
  color: var(--text-subdued);
}

.spj-check {
  color: var(--accent);
  flex-shrink: 0;
}
</style>