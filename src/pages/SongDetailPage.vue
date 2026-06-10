<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { useProfileStore } from '../stores/profileStore'
import { usePlaylistStore } from '../stores/playlistStore'
import { songs } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, Heart, MonitorPlay, ListPlus, Check, ListMusic } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()
const profileStore = useProfileStore()
const playlistStore = usePlaylistStore()

const songId = computed(() => Number(route.params.id))
const currSong = computed(() => songs.find(s => s.id === songId.value) || songs[0])
const isCurrentPlaying = computed(() =>
  player.currentSong?.id === currSong.value.id && player.isPlaying)

const handlePlay = () => {
  if (player.currentSong?.id === currSong.value.id) player.togglePlay()
  else player.playSong(currSong.value, songs)
}
const goToMV = () => { if (currSong.value.mv) router.push(`/music-video/${currSong.value.mv}`) }

const showDropdown = ref(false)
const successMsg = ref('')
const toggleDropdown = () => { showDropdown.value = !showDropdown.value }
const handleClickOutside = (e: MouseEvent) => {
  const w = document.querySelector('.pl-wrapper')
  if (w && !w.contains(e.target as Node)) showDropdown.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

const isSongInPlaylist = (pid: number) =>
  playlistStore.playlists.find(p => p.id === pid)?.songs.some(s => s.id === currSong.value.id) ?? false

const addToPlaylist = (pid: number) => {
  if (isSongInPlaylist(pid)) return
  playlistStore.addSongToPlaylist(pid, currSong.value)
  successMsg.value = 'Added!'
  setTimeout(() => { successMsg.value = ''; showDropdown.value = false }, 1500)
}
</script>

<template>
  <div class="detail-page page-enter">
    <!-- Blurred background -->
    <div class="detail-bg" :style="{ backgroundImage: `url(${currSong.cover})` }"></div>
    <div class="detail-overlay"></div>

    <div class="detail-content">
      <NavBar />

      <div class="detail-main">
        <!-- Cover -->
        <div class="cover-area">
          <div class="cover-shadow"></div>
          <img :src="currSong.cover" class="main-cover"
            :class="{ 'is-spinning': isCurrentPlaying }" />
        </div>

        <!-- Info -->
        <div class="info-area">
          <span class="type-badge">Single</span>
          <h1 class="song-title">{{ currSong.title }}</h1>
          <p class="song-meta">{{ currSong.artist }} · {{ currSong.duration }}</p>

          <div class="actions">
            <button class="play-btn" @click="handlePlay">
              <Pause v-if="isCurrentPlaying" :size="28" fill="currentColor" stroke="currentColor" />
              <Play v-else :size="28" fill="currentColor" stroke="currentColor" style="margin-left:3px" />
            </button>

            <button class="like-btn" @click="player.toggleLike(currSong.id)"
              :class="{ liked: player.isLiked(currSong.id) }">
              <Heart :size="22"
                :fill="player.isLiked(currSong.id) ? 'var(--accent)' : 'none'"
                :stroke="player.isLiked(currSong.id) ? 'var(--accent)' : 'currentColor'" />
            </button>

            <button v-if="currSong.mv" class="action-pill mv-pill" @click="goToMV">
              <MonitorPlay :size="16" /> Watch MV
            </button>

            <div class="pl-wrapper">
              <button class="action-pill" @click="toggleDropdown">
                <ListPlus :size="16" /> Add to Playlist
              </button>
              <div v-if="showDropdown" class="pl-dropdown" @click.stop>
                <div v-if="successMsg" class="pl-success"><Check :size="15" /> {{ successMsg }}</div>
                <div v-else-if="playlistStore.playlists.length === 0" class="pl-empty">
                  <ListMusic :size="20" />
                  <p>No playlists yet</p>
                  <small>Create one from the sidebar</small>
                </div>
                <template v-else>
                  <p class="pl-label">Add to Playlist</p>
                  <div v-for="pl in playlistStore.playlists" :key="pl.id"
                    class="pl-item" :class="{ done: isSongInPlaylist(pl.id) }"
                    @click="addToPlaylist(pl.id)">
                    <div class="pl-item-cover">
                      <img v-if="pl.cover" :src="pl.cover" /><ListMusic v-else :size="14" />
                    </div>
                    <div class="pl-item-info">
                      <span class="pl-item-name">{{ pl.name }}</span>
                      <span class="pl-item-count">{{ pl.songs.length }} songs</span>
                    </div>
                    <Check v-if="isSongInPlaylist(pl.id)" :size="14" class="pl-check" />
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
.detail-page { position: relative; min-height: 100vh; overflow: hidden; }

.detail-bg {
  position: fixed; inset: 0;
  background-size: cover; background-position: center;
  filter: blur(80px) saturate(1.4); opacity: 0.25;
  z-index: 0; pointer-events: none; transform: scale(1.2);
  transition: background-image 0.6s ease;
}
.detail-overlay {
  position: fixed; inset: 0;
  background: linear-gradient(180deg, rgba(13,17,23,0.55) 0%, rgba(13,17,23,0.9) 100%);
  z-index: 1; pointer-events: none;
}
.detail-content { position: relative; z-index: 2; min-height: 100vh; display: flex; flex-direction: column; }

.detail-main {
  flex: 1; display: flex; align-items: center; justify-content: center;
  gap: 72px; padding: 32px 48px 80px;
  max-width: 1100px; margin: 0 auto; width: 100%;
}

.cover-area { flex-shrink: 0; position: relative; }
.cover-shadow {
  position: absolute; inset: 20px; border-radius: 20px;
  background: var(--accent); filter: blur(40px); opacity: 0.15;
  animation: shadowPulse 3s ease-in-out infinite;
}
@keyframes shadowPulse { 0%,100%{opacity:0.15} 50%{opacity:0.28} }

.main-cover {
  width: 340px; height: 340px; border-radius: 20px; object-fit: cover;
  position: relative; box-shadow: 0 32px 72px rgba(0,0,0,0.7);
  transition: transform 0.5s ease;
}
.main-cover:hover { transform: scale(1.02) rotate(0.5deg); }
.main-cover.is-spinning {
  animation: subtleBob 3s ease-in-out infinite;
}
@keyframes subtleBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

.info-area { display: flex; flex-direction: column; }

.type-badge {
  display: inline-block; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  color: var(--accent); background: var(--accent-glow);
  padding: 4px 10px; border-radius: var(--radius-full);
  border: 1px solid rgba(0,210,200,0.25); margin-bottom: 16px;
  width: fit-content;
}
.song-title {
  font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 900;
  margin: 0 0 12px; letter-spacing: -1.5px; line-height: 1.05;
}
.song-meta { font-size: 1.1rem; color: var(--text-secondary); margin: 0 0 36px; font-weight: 500; }

.actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

.play-btn {
  width: 64px; height: 64px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
  box-shadow: 0 8px 24px rgba(0,210,200,0.4);
}
.play-btn:hover { transform: scale(1.08); box-shadow: 0 12px 32px rgba(0,210,200,0.55); }
.play-btn:active { transform: scale(0.95); }

.like-btn {
  width: 48px; height: 48px; border-radius: 50%;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  cursor: pointer; transition: all var(--transition);
  display: flex; align-items: center; justify-content: center; color: var(--text-secondary);
}
.like-btn:hover { border-color: var(--accent); background: var(--accent-glow); }
.like-btn.liked { border-color: var(--accent); background: var(--accent-glow); color: var(--accent); }

.action-pill {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.07); color: var(--text-primary);
  border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-full);
  padding: 10px 20px; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; transition: all var(--transition); font-family: var(--font-family);
}
.action-pill:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); }
.mv-pill { border-color: rgba(124,106,255,0.3); }
.mv-pill:hover { background: rgba(124,106,255,0.12); border-color: var(--accent2); color: #a78bfa; }

/* Dropdown */
.pl-wrapper { position: relative; z-index: 9999; }
.pl-dropdown {
  position: absolute; top: calc(100% + 8px); left: 0;
  width: 260px; max-height: 280px; overflow-y: auto;
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md); box-shadow: 0 16px 48px rgba(0,0,0,0.5);
  z-index: 9999; padding: 8px 0;
  animation: dropDown 0.18s cubic-bezier(0.4,0,0.2,1);
}
@keyframes dropDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:none } }
.pl-label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-subdued); padding: 6px 16px; margin: 0; }
.pl-success { display: flex; align-items: center; gap: 8px; padding: 18px 16px; color: var(--accent); font-weight: 600; font-size: 0.88rem; }
.pl-empty { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 22px 16px; text-align: center; color: var(--text-subdued); }
.pl-empty p { margin: 0; font-size: 0.88rem; color: var(--text-secondary); font-weight: 600; }
.pl-empty small { font-size: 0.75rem; }
.pl-item { display: flex; align-items: center; gap: 10px; padding: 8px 16px; cursor: pointer; transition: background var(--transition); }
.pl-item:hover { background: var(--bg-highlight); }
.pl-item.done { opacity: 0.45; cursor: default; }
.pl-item.done:hover { background: transparent; }
.pl-item-cover { width: 34px; height: 34px; border-radius: 6px; background: var(--bg-surface); display: flex; align-items: center; justify-content: center; color: var(--text-subdued); overflow: hidden; flex-shrink: 0; }
.pl-item-cover img { width: 100%; height: 100%; object-fit: cover; }
.pl-item-info { flex: 1; min-width: 0; }
.pl-item-name { display: block; font-size: 0.85rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pl-item-count { font-size: 0.72rem; color: var(--text-subdued); }
.pl-check { color: var(--accent); flex-shrink: 0; }

@media (max-width: 768px) {
  .detail-main { flex-direction: column; text-align: center; gap: 28px; padding: 24px 24px 80px; }
  .main-cover { width: 260px; height: 260px; }
  .actions { justify-content: center; }
}
</style>
