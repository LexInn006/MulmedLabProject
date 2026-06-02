<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Import store playlist yang tadi sudah kita buat
import { usePlaylistStore } from '../stores/playlistStore'
import { Home, Video, User, Library, Plus, ListMusic, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const playlistStore = usePlaylistStore()

// State untuk modal "Buat Playlist"
const showModal = ref(false)
const newPlaylistName = ref('')
const errorMsg = ref('')

// Buka modal buat playlist baru
const openModal = () => {
  newPlaylistName.value = ''
  errorMsg.value = ''
  showModal.value = true
}

// Tutup modal
const closeModal = () => {
  showModal.value = false
}

// Buat playlist baru lalu tutup modal
const createPlaylist = () => {
  // Validasi: nama tidak boleh kosong
  if (!newPlaylistName.value.trim()) {
    errorMsg.value = 'Playlist name cannot be empty'
    return
  }
  playlistStore.createPlaylist(newPlaylistName.value.trim())
  showModal.value = false
}

// Navigasi ke halaman detail playlist
const goToPlaylist = (id: number) => {
  router.push(`/playlist/${id}`)
}

// Hapus playlist
const handleDelete = (e: Event, id: number) => {
  // stopPropagation: cegah klik hapus memicu klik navigasi playlist
  e.stopPropagation()
  playlistStore.deletePlaylist(id)
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">SpoJeDy</div>

    <!-- Main Nav -->
    <nav class="sidebar-nav">
      <!-- Profile dipindah ke sini, di atas Home -->
      <router-link to="/profile" class="sidebar-link" active-class="active">
        <User :size="24" /> Profile
      </router-link>
      <router-link to="/" class="sidebar-link" active-class="active">
        <Home :size="24" /> Home
      </router-link>
      <router-link to="/music-video" class="sidebar-link" active-class="active">
        <Video :size="24" /> Music Videos
      </router-link>
    </nav>

    <!-- Divider -->
    <div class="sidebar-divider"></div>

    <!-- Library Section -->
    <div class="sidebar-section">
      <!-- Header "Your Library" + tombol buat playlist -->
      <div class="sidebar-section-header">
        <div class="sidebar-section-title">
          <Library :size="20" /> Your Library
        </div>
        <!-- Tombol + untuk buat playlist baru -->
        <button class="add-playlist-btn" @click="openModal" title="Buat Playlist">
          <Plus :size="20" />
        </button>
      </div>

      <!-- Kalau belum ada playlist, tampilkan pesan kosong -->
      <div v-if="playlistStore.playlists.length === 0" class="empty-library">
        <p>No playlists yet</p>
        <button class="create-playlist-btn" @click="openModal">
          <Plus :size="16" /> Create Playlist
        </button>
      </div>

      <!-- Daftar playlist yang sudah dibuat -->
      <div
        v-for="playlist in playlistStore.playlists"
        :key="playlist.id"
        class="playlist-item"
        @click="goToPlaylist(playlist.id)"
      >
        <!-- Cover playlist (foto lagu pertama atau icon default) -->
        <div class="playlist-cover">
          <img v-if="playlist.cover" :src="playlist.cover" alt="cover" />
          <ListMusic v-else :size="20" />
        </div>

        <!-- Nama playlist dan jumlah lagu -->
        <div class="playlist-info">
          <span class="playlist-name">{{ playlist.name }}</span>
          <span class="playlist-count">{{ playlist.songs.length }} songs</span>
        </div>

        <!-- Tombol hapus playlist -->
        <button class="delete-playlist-btn" @click="handleDelete($event, playlist.id)" title="Hapus Playlist">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Modal Buat Playlist -->
  <!-- Overlay gelap di belakang modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-box">
      <h3 class="modal-title">Create New Playlist</h3>

      <input
        v-model="newPlaylistName"
        class="modal-input"
        type="text"
        placeholder="Playlist name..."
        @keyup.enter="createPlaylist"
        autofocus
      />

      <!-- Pesan error kalau nama kosong -->
      <p v-if="errorMsg" class="modal-error">{{ errorMsg }}</p>

      <div class="modal-actions">
        <button class="modal-cancel-btn" @click="closeModal">Cancel</button>
        <button class="modal-create-btn" @click="createPlaylist">Create</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--bg-base);
  border-right: 1px solid var(--bg-highlight);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent);
  padding: 24px;
  letter-spacing: 1px;
  flex-shrink: 0;
}

.sidebar-nav, .sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.95rem;
}

.sidebar-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-highlight);
}

.sidebar-link.active {
  color: var(--text-primary);
  font-weight: 700;
  position: relative;
  background-color: var(--bg-highlight);
}

.sidebar-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 4px;
  background-color: var(--accent);
  border-radius: 0 4px 4px 0;
}

.sidebar-divider {
  height: 1px;
  background-color: var(--bg-highlight);
  margin: 16px 24px;
  flex-shrink: 0;
}

/* Header "Your Library" + tombol + */
.sidebar-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.sidebar-section-title {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  color: var(--text-subdued);
  padding: 8px 12px;
  font-weight: 700;
  display: flex;
  gap: 12px;
  align-items: center;
}

.add-playlist-btn {
  background: none;
  border: none;
  color: var(--text-subdued);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.add-playlist-btn:hover {
  color: var(--text-primary);
  background-color: var(--bg-highlight);
}

/* Empty state */
.empty-library {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  text-align: center;
}

.empty-library p {
  font-size: 0.85rem;
  color: var(--text-subdued);
  margin: 0;
}

.create-playlist-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 1px solid var(--text-subdued);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.create-playlist-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

/* Playlist item di sidebar */
.playlist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.2s;
}

.playlist-item:hover {
  background-color: var(--bg-highlight);
}

.playlist-item:hover .delete-playlist-btn {
  opacity: 1;
}

.playlist-cover {
  width: 44px;
  height: 44px;
  border-radius: 6px;
  background-color: var(--bg-elevated);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-subdued);
  overflow: hidden;
}

.playlist-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.playlist-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.playlist-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.playlist-count {
  font-size: 0.78rem;
  color: var(--text-subdued);
}

.delete-playlist-btn {
  background: none;
  border: none;
  color: var(--text-subdued);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: all 0.2s;
  flex-shrink: 0;
}

.delete-playlist-btn:hover {
  color: #e53e3e;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background-color: var(--bg-elevated);
  border-radius: var(--radius-lg);
  padding: 32px;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5);
}

.modal-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: var(--text-primary);
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--bg-highlight);
  background-color: var(--bg-surface);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus {
  border-color: var(--accent);
}

.modal-error {
  color: #e53e3e;
  font-size: 0.85rem;
  margin: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-cancel-btn {
  padding: 10px 24px;
  border-radius: var(--radius-full);
  background: none;
  border: 1px solid var(--text-subdued);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-cancel-btn:hover {
  border-color: var(--text-primary);
  color: var(--text-primary);
}

.modal-create-btn {
  padding: 10px 24px;
  border-radius: var(--radius-full);
  background-color: var(--accent);
  color: #000;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-create-btn:hover {
  background-color: var(--accent-hover);
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>