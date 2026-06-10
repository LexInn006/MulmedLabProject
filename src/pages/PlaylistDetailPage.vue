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

const playlistId = computed(() => Number(route.params.id))
const playlist = computed(() => playlistStore.playlists.find(p => p.id === playlistId.value))
const isPlaylistPlaying = computed(() =>
  player.isPlaying && !!playlist.value?.songs.some(s => s.id === player.currentSong?.id))

const togglePlayAll = () => {
  if (isPlaylistPlaying.value) { player.togglePlay(); return }
  if (!playlist.value?.songs.length) return
  player.playSong(playlist.value.songs[0], playlist.value.songs)
}
const playSong = (songId: number) => {
  if (!playlist.value) return
  const song = playlist.value.songs.find(s => s.id === songId)
  if (song) player.playSong(song, playlist.value.songs)
}
const isSongPlaying = (songId: number) => player.currentSong?.id === songId && player.isPlaying
const removeSong = (songId: number) => playlistStore.removeSongFromPlaylist(playlistId.value, songId)

const isEditingName = ref(false)
const editedName = ref('')
const startEditName = () => { editedName.value = playlist.value?.name || ''; isEditingName.value = true }
const saveEditName = () => {
  if (!editedName.value.trim()) return
  const pl = playlistStore.playlists.find(p => p.id === playlistId.value)
  if (pl) { pl.name = editedName.value.trim(); playlistStore.save() }
  isEditingName.value = false
}
const deletePlaylist = () => { playlistStore.deletePlaylist(playlistId.value); router.push('/') }
</script>

<template>
  <div class="pl-page page-enter">
    <div v-if="!playlist" class="not-found">
      <ListMusic :size="48" class="nf-icon" />
      <p>Playlist not found</p>
      <button class="back-btn" @click="router.push('/')">← Back to Home</button>
    </div>

    <template v-else>
      <div class="pl-bg" :style="{ backgroundImage: playlist.cover ? `url(${playlist.cover})` : 'none' }"></div>
      <div class="pl-overlay"></div>

      <div class="pl-content">
        <NavBar />

        <!-- Header -->
        <div class="pl-header">
          <div class="pl-cover">
            <img v-if="playlist.cover" :src="playlist.cover" />
            <div v-else class="cover-placeholder"><ListMusic :size="56" /></div>
          </div>
          <div class="pl-info">
            <span class="pl-eyebrow">Playlist</span>

            <div class="name-row" v-if="!isEditingName">
              <h1 class="pl-name">{{ playlist.name }}</h1>
              <button class="icon-btn" @click="startEditName"><Pencil :size="18" /></button>
            </div>
            <div class="name-edit" v-else>
              <input v-model="editedName" class="name-input" @keyup.enter="saveEditName" autofocus />
              <button class="icon-btn accent" @click="saveEditName"><Check :size="18" /></button>
              <button class="icon-btn" @click="isEditingName = false"><X :size="18" /></button>
            </div>

            <p class="pl-meta">{{ playlist.songs.length }} {{ playlist.songs.length === 1 ? 'song' : 'songs' }}</p>

            <div class="pl-actions">
              <button class="play-all-btn" :disabled="!playlist.songs.length" @click="togglePlayAll">
                <Pause v-if="isPlaylistPlaying" :size="26" fill="currentColor" stroke="currentColor" />
                <Play v-else :size="26" fill="currentColor" stroke="currentColor" style="margin-left:3px" />
              </button>
              <button class="delete-btn" @click="deletePlaylist">
                <Trash2 :size="16" /> Delete Playlist
              </button>
            </div>
          </div>
        </div>

        <!-- Songs -->
        <div class="songs-section">
          <div v-if="!playlist.songs.length" class="empty-pl">
            <div class="empty-icon"><ListMusic :size="28" /></div>
            <p>This playlist is empty</p>
            <small>Add songs from the song detail page</small>
          </div>

          <div v-else class="songs-table">
            <div class="table-head">
              <span class="col-n">#</span>
              <span class="col-t">Title</span>
              <span class="col-a">Artist</span>
              <span class="col-x"></span>
            </div>
            <div class="table-divider"></div>

            <div
              v-for="(song, idx) in playlist.songs" :key="song.id"
              class="song-row" :class="{ playing: isSongPlaying(song.id) }"
              @click="playSong(song.id)"
            >
              <div class="col-n">
                <span class="row-num">{{ idx + 1 }}</span>
                <span class="row-play">
                  <Pause v-if="isSongPlaying(song.id)" :size="14" fill="currentColor" stroke="currentColor" />
                  <Play v-else :size="14" fill="currentColor" stroke="currentColor" />
                </span>
              </div>
              <div class="col-t">
                <img :src="song.cover" class="row-cover" />
                <span class="row-title" :class="{ accent: isSongPlaying(song.id) }">{{ song.title }}</span>
              </div>
              <span class="col-a row-artist">{{ song.artist }}</span>
              <div class="col-x">
                <button class="remove-btn" @click.stop="removeSong(song.id)"><Trash2 :size="14" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pl-page { position: relative; min-height: 100vh; }

.pl-bg {
  position: fixed; inset: 0;
  background-size: cover; background-position: center;
  filter: blur(80px) saturate(1.3); opacity: 0.2;
  z-index: 0; pointer-events: none; transform: scale(1.2);
}
.pl-overlay {
  position: fixed; inset: 0;
  background: linear-gradient(180deg, var(--playlist-overlay-start) 0%, var(--playlist-overlay-end) 50%);
  z-index: 1; pointer-events: none;
}

.pl-content { position: relative; z-index: 2; min-height: 100vh; }

.pl-header {
  display: flex; align-items: flex-end; gap: 36px;
  padding: 16px 28px 36px;
}

.pl-cover {
  width: 200px; height: 200px; border-radius: 16px; overflow: hidden; flex-shrink: 0;
  box-shadow: 0 20px 56px rgba(0,0,0,0.6);
}
.pl-cover img { width: 100%; height: 100%; object-fit: cover; }
.cover-placeholder {
  width: 100%; height: 100%; background: var(--bg-elevated);
  display: flex; align-items: center; justify-content: center; color: var(--text-subdued);
}

.pl-info { display: flex; flex-direction: column; gap: 8px; }
.pl-eyebrow {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 2.5px;
  text-transform: uppercase; color: var(--accent);
}
.name-row { display: flex; align-items: center; gap: 12px; }
.pl-name { font-size: clamp(2rem, 4.5vw, 3.6rem); font-weight: 900; margin: 0; letter-spacing: -1px; line-height: 1.05; }
.name-edit { display: flex; align-items: center; gap: 8px; }
.name-input {
  font-size: 2rem; font-weight: 700; background: transparent;
  border: none; border-bottom: 2px solid var(--accent);
  color: var(--text-primary); outline: none; padding: 4px 0; width: 260px;
  font-family: var(--font-family);
}

.icon-btn {
  background: var(--bg-elevated); border: 1px solid var(--sidebar-border);
  color: var(--text-secondary); cursor: pointer; padding: 7px; border-radius: 8px;
  display: flex; align-items: center; transition: all var(--transition);
}
.icon-btn:hover { color: var(--text-primary); background: var(--bg-highlight); }
.icon-btn.accent { color: var(--accent); border-color: var(--accent-glow); }
.icon-btn.accent:hover { background: var(--accent-glow); }

.pl-meta { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }
.pl-actions { display: flex; align-items: center; gap: 16px; margin-top: 4px; }

.play-all-btn {
  width: 60px; height: 60px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
  box-shadow: 0 8px 24px rgba(0,210,200,0.35);
}
.play-all-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 12px 32px rgba(0,210,200,0.5); }
.play-all-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.delete-btn {
  display: flex; align-items: center; gap: 8px;
  background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2);
  color: #fca5a5; border-radius: var(--radius-full);
  padding: 10px 20px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all var(--transition); font-family: var(--font-family);
}
.delete-btn:hover { background: rgba(248,113,113,0.18); border-color: #f87171; color: #fca5a5; }

/* Songs table */
.songs-section { padding: 0 28px 80px; }
.empty-pl {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 64px 0; color: var(--text-subdued); text-align: center;
}
.empty-icon {
  width: 64px; height: 64px; border-radius: 16px;
  background: var(--bg-elevated); display: flex; align-items: center; justify-content: center;
}
.empty-pl p { font-size: 1rem; font-weight: 600; color: var(--text-secondary); margin: 0; }
.empty-pl small { font-size: 0.85rem; }

.songs-table { display: flex; flex-direction: column; }
.table-head {
  display: grid; grid-template-columns: 44px 1fr 1fr 44px;
  padding: 0 12px 10px;
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; color: var(--text-subdued);
}
.table-divider { height: 1px; background: var(--sidebar-border); margin-bottom: 6px; }

.song-row {
  display: grid; grid-template-columns: 44px 1fr 1fr 44px;
  align-items: center; padding: 8px 12px;
  border-radius: var(--radius-sm); cursor: pointer;
  transition: all var(--transition);
}
.song-row:hover { background: var(--sidebar-hover); }
.song-row:hover .row-num { opacity: 0; }
.song-row:hover .row-play { opacity: 1; }
.song-row:hover .remove-btn { opacity: 1; }
.song-row.playing { background: rgba(29, 185, 84, 0.12); }
.song-row.playing .row-num { opacity: 0; }
.song-row.playing .row-play { opacity: 1; color: var(--accent); }

.col-n { position: relative; display: flex; align-items: center; justify-content: center; }
.row-num { font-size: 0.88rem; color: var(--text-subdued); transition: opacity var(--transition); }
.row-play { position: absolute; opacity: 0; transition: opacity var(--transition); color: var(--text-primary); }

.col-t { display: flex; align-items: center; gap: 12px; overflow: hidden; }
.row-cover { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.row-title { font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row-title.accent { color: var(--accent); }

.col-a { font-size: 0.82rem; }
.row-artist { color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.col-x { display: flex; justify-content: center; }
.remove-btn {
  background: none; border: none; color: var(--text-subdued);
  cursor: pointer; padding: 6px; border-radius: 6px;
  display: flex; align-items: center; opacity: 0; transition: all var(--transition);
}
.remove-btn:hover { color: #f87171; background: rgba(248,113,113,0.1); }

/* Not found */
.not-found {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 100vh; gap: 16px; color: var(--text-secondary);
}
.nf-icon { color: var(--text-subdued); }
.not-found p { font-size: 1.1rem; font-weight: 600; margin: 0; }
.back-btn {
  background: var(--bg-elevated); border: 1px solid var(--sidebar-border);
  color: var(--text-secondary); border-radius: var(--radius-full);
  padding: 10px 24px; cursor: pointer; font-size: 0.9rem;
  transition: all var(--transition); font-family: var(--font-family);
}
.back-btn:hover { border-color: var(--accent); color: var(--accent); }

@media (max-width: 600px) {
  .pl-header { flex-direction: column; align-items: center; text-align: center; }
  .pl-actions { justify-content: center; }
}
</style>
