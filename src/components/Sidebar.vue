<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePlaylistStore } from '../stores/playlistStore'
import { Home, Video, User, Library, Plus, ListMusic, Trash2, Music2 } from 'lucide-vue-next'

const router = useRouter()
const playlistStore = usePlaylistStore()

const showModal = ref(false)
const newPlaylistName = ref('')
const errorMsg = ref('')

const openModal = () => {
  newPlaylistName.value = ''
  errorMsg.value = ''
  showModal.value = true
}
const closeModal = () => { showModal.value = false }
const createPlaylist = () => {
  if (!newPlaylistName.value.trim()) { errorMsg.value = 'Playlist name cannot be empty'; return }
  playlistStore.createPlaylist(newPlaylistName.value.trim())
  showModal.value = false
}
const goToPlaylist = (id: number) => router.push(`/playlist/${id}`)
const handleDelete = (e: Event, id: number) => {
  e.stopPropagation()
  playlistStore.deletePlaylist(id)
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">
      <div class="logo-icon" aria-label="SpoJeDy logo">
        <img
          src="/a6017cf148aa50bf9c7c319878f62fbf5770eebe.png"
          alt="SpoJeDy logo"
          class="logo-image"
        />
      </div>
      <span class="logo-text">SpoJeDy</span>
    </div>

    <!-- Menu label -->
    <span class="nav-label">Menu</span>

    <nav class="sidebar-nav">
      <router-link to="/profile" class="sidebar-link" active-class="active">
        <div class="link-icon"><User :size="18" /></div>
        <span>Profile</span>
      </router-link>
      <router-link to="/" class="sidebar-link" active-class="active">
        <div class="link-icon"><Home :size="18" /></div>
        <span>Home</span>
      </router-link>
      <router-link to="/music-video" class="sidebar-link" active-class="active">
        <div class="link-icon"><Video :size="18" /></div>
        <span>Music Videos</span>
      </router-link>
    </nav>

    <div class="sidebar-divider"></div>

    <!-- Library -->
    <div class="sidebar-section">
      <div class="sidebar-section-header">
        <div class="sidebar-section-title">
          <Library :size="16" /> Your Library
        </div>
        <button class="add-playlist-btn" @click="openModal" title="New Playlist">
          <Plus :size="16" />
        </button>
      </div>

      <div v-if="playlistStore.playlists.length === 0" class="empty-library">
        <div class="empty-icon"><ListMusic :size="22" /></div>
        <p>No playlists yet</p>
        <button class="create-playlist-btn" @click="openModal">
          <Plus :size="14" /> Create Playlist
        </button>
      </div>

      <div
        v-for="playlist in playlistStore.playlists"
        :key="playlist.id"
        class="playlist-item"
        @click="goToPlaylist(playlist.id)"
      >
        <div class="playlist-cover">
          <img v-if="playlist.cover" :src="playlist.cover" alt="cover" />
          <ListMusic v-else :size="16" />
        </div>
        <div class="playlist-info">
          <span class="playlist-name">{{ playlist.name }}</span>
          <span class="playlist-count">{{ playlist.songs.length }} songs</span>
        </div>
        <button class="delete-playlist-btn" @click="handleDelete($event, playlist.id)" title="Delete">
          <Trash2 :size="14" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-box">
      <h3 class="modal-title">New Playlist</h3>
      <input v-model="newPlaylistName" class="modal-input" type="text"
        placeholder="Give it a name..." @keyup.enter="createPlaylist" autofocus />
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
  left: 0; top: 0;
  background: linear-gradient(180deg, var(--sidebar-bg-start) 0%, var(--sidebar-bg-end) 100%);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
  padding-bottom: 24px;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 24px 20px 20px;
  flex-shrink: 0;
}

.logo-icon {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(90deg, #4da3ff 0%, #2f6bff 45%, #1b4fe6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.nav-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-subdued);
  padding: 0 20px 8px;
  flex-shrink: 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
  font-weight: 500;
  font-size: 0.9rem;
}

.link-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background-color: var(--bg-elevated);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition);
}

.sidebar-link:hover {
  color: var(--text-primary);
  background-color: var(--sidebar-hover);
}

.sidebar-link:hover .link-icon {
  background-color: var(--bg-highlight);
}

.sidebar-link.active {
  color: var(--text-primary);
  font-weight: 700;
  background-color: var(--sidebar-active);
}

.sidebar-link.active .link-icon {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 210, 200, 0.3);
}

.sidebar-divider {
  height: 1px;
  background: var(--sidebar-border);
  margin: 16px 20px;
  flex-shrink: 0;
}

.sidebar-section { display: flex; flex-direction: column; gap: 2px; padding: 0 10px; flex: 1; }

.sidebar-section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 4px 6px;
}

.sidebar-section-title {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--text-subdued);
  padding: 4px 8px; display: flex; gap: 8px; align-items: center;
}

.add-playlist-btn {
  background: var(--bg-elevated); border: none; color: var(--text-secondary);
  cursor: pointer; padding: 5px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.add-playlist-btn:hover { color: var(--accent); background: var(--accent-glow); }

.empty-library {
  display: flex; flex-direction: column; align-items: center;
  gap: 10px; padding: 24px 16px; text-align: center;
}
.empty-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--bg-elevated); display: flex; align-items: center; justify-content: center;
  color: var(--text-subdued);
}
.empty-library p { font-size: 0.82rem; color: var(--text-subdued); margin: 0; }
.create-playlist-btn {
  display: flex; align-items: center; gap: 5px;
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.08);
  color: var(--text-secondary); border-radius: var(--radius-full);
  padding: 7px 14px; font-size: 0.8rem; font-weight: 600; cursor: pointer;
  transition: all var(--transition);
}
.create-playlist-btn:hover { border-color: var(--accent); color: var(--accent); }

.playlist-item {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 10px; border-radius: var(--radius-sm);
  cursor: pointer; transition: background-color var(--transition);
}
.playlist-item:hover { background-color: rgba(255,255,255,0.04); }
.playlist-item:hover .delete-playlist-btn { opacity: 1; }

.playlist-cover {
  width: 38px; height: 38px; border-radius: 8px;
  background-color: var(--bg-elevated); flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-subdued); overflow: hidden;
}
.playlist-cover img { width: 100%; height: 100%; object-fit: cover; }

.playlist-info { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.playlist-name {
  font-size: 0.85rem; font-weight: 600; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.playlist-count { font-size: 0.72rem; color: var(--text-subdued); }

.delete-playlist-btn {
  background: none; border: none; color: var(--text-subdued);
  cursor: pointer; padding: 4px; border-radius: 4px;
  display: flex; align-items: center; opacity: 0; transition: all var(--transition);
}
.delete-playlist-btn:hover { color: #f87171; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center; z-index: 9999;
  backdrop-filter: blur(6px);
  animation: fadeOverlay 0.2s ease;
}
@keyframes fadeOverlay { from { opacity:0 } to { opacity:1 } }
.modal-box {
  background: var(--bg-elevated);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-lg); padding: 32px;
  width: 100%; max-width: 400px;
  display: flex; flex-direction: column; gap: 16px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.6);
  animation: modalSlide 0.25s cubic-bezier(0.4,0,0.2,1);
}
@keyframes modalSlide { from { opacity:0; transform:translateY(20px) scale(0.96) } to { opacity:1; transform:none } }
.modal-title { font-size: 1.2rem; font-weight: 800; margin: 0; }
.modal-input {
  width: 100%; padding: 12px 16px;
  border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1);
  background: var(--bg-surface); color: var(--text-primary); font-size: 0.95rem;
  outline: none; transition: border-color var(--transition); font-family: var(--font-family);
}
.modal-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
.modal-error { color: #f87171; font-size: 0.82rem; margin: 0; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.modal-cancel-btn {
  padding: 10px 22px; border-radius: var(--radius-full);
  background: none; border: 1px solid rgba(255,255,255,0.12);
  color: var(--text-secondary); font-weight: 600; cursor: pointer; transition: all var(--transition);
  font-family: var(--font-family);
}
.modal-cancel-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }
.modal-create-btn {
  padding: 10px 22px; border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; font-weight: 700; border: none; cursor: pointer;
  transition: all var(--transition); font-family: var(--font-family);
}
.modal-create-btn:hover { opacity: 0.88; transform: scale(1.03); }

@media (max-width: 768px) { .sidebar { display: none; } }
</style>
