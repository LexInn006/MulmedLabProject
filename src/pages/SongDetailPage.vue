<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { songs } from '../data/songs'
import type { SongData } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, Maximize, X, ZoomIn, ZoomOut, Heart } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()

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

const playListSong = (song: SongData) => {
  if (player.currentSong?.id === song.id) {
    player.togglePlay()
  } else {
    player.playSong(song, songs)
  }
}

const goToMV = () => {
  if (currSong.value.mv) {
    router.push(`/music-video/${currSong.value.mv}`)
  }
}

// Fullscreen logic
const isFullscreen = ref(false)
const zoomLevel = ref(1)

const openFullscreen = () => {
  isFullscreen.value = true
  zoomLevel.value = 1
}

const closeFullscreen = () => {
  isFullscreen.value = false
  zoomLevel.value = 1
}

const zoomIn = () => {
  if (zoomLevel.value < 3) zoomLevel.value += 0.3
}

const zoomOut = () => {
  if (zoomLevel.value > 0.5) zoomLevel.value -= 0.3
}
</script>

<template>
  <div class="song-detail">
    <!-- Header -->
    <div class="detail-header">
      <NavBar />
      <div class="detail-hero">
        <img :src="currSong.cover" class="detail-cover" @click="openFullscreen" title="Click to fullscreen" />
        <div class="detail-info">
          <span class="detail-type">Song</span>
          <h1 class="detail-title">{{ currSong.title }}</h1>
          <p class="detail-artist">{{ currSong.artist }} • {{ currSong.duration }}</p>
        </div>
      </div>
    </div>
    
    <!-- Action Bar -->
    <div class="detail-actions">
      <button class="play-big-btn" @click="handlePlay">
        <Pause v-if="isCurrentPlaying" :size="24" fill="currentColor" stroke="currentColor" />
        <Play v-else :size="24" fill="currentColor" stroke="currentColor" style="margin-left: 2px;" />
      </button>
      <button class="like-btn" @click="player.toggleLike(currSong.id)">
        <Heart :size="32" :fill="player.isLiked(currSong.id) ? '#8b5cf6' : 'none'" :stroke="player.isLiked(currSong.id) ? '#8b5cf6' : 'var(--text-secondary)'" />
      </button>
      <button class="mv-btn" @click="goToMV" v-if="currSong.mv">
        <Maximize :size="16" /> Watch Music Video
      </button>
    </div>
    
    <!-- Tracklist -->
    <div class="tracklist">
      <div class="track-header">
        <span>#</span>
        <span>Title</span>
        <span style="margin-left: auto;">Duration</span>
      </div>
      <div class="track-divider"></div>
      
      <div 
        v-for="(song, index) in songs" 
        :key="song.id" 
        class="track-row" 
        :class="{ active: player.currentSong?.id === song.id }" 
        @click="playListSong(song)"
      >
        <div class="track-num">
          <Play v-if="player.currentSong?.id === song.id && player.isPlaying" :size="14" fill="var(--accent)" stroke="var(--accent)" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <img :src="song.cover" class="track-cover" />
        <div class="track-info">
          <span class="track-title" :style="{ color: player.currentSong?.id === song.id ? 'var(--accent)' : 'var(--text-primary)' }">{{ song.title }}</span>
          <span class="track-artist">{{ song.artist }}</span>
        </div>
        <span class="track-duration">{{ song.duration }}</span>
      </div>
    </div>
    
    <!-- Fullscreen Overlay -->
    <div v-if="isFullscreen" class="fullscreen-overlay" @click.self="closeFullscreen">
      <div class="fullscreen-controls">
        <button class="fs-btn" @click="zoomIn"><ZoomIn :size="22" /></button>
        <button class="fs-btn" @click="zoomOut"><ZoomOut :size="22" /></button>
        <button class="fs-btn" @click="closeFullscreen"><X :size="22" /></button>
      </div>
      <img :src="currSong.cover" class="fullscreen-img" :style="{ transform: `scale(${zoomLevel})` }" />
    </div>
  </div>
</template>

<style scoped>
.song-detail {
  min-height: 100vh;
}

.detail-header {
  background: linear-gradient(180deg, rgba(139,92,246,0.25) 0%, var(--bg-base) 100%);
  padding-bottom: 24px;
}

.detail-hero {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  padding: 24px 32px;
}

@media (max-width: 600px) {
  .detail-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.detail-cover {
  width: 232px;
  height: 232px;
  border-radius: var(--radius-sm);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  cursor: pointer;
  transition: transform 0.2s;
  object-fit: cover;
}

.detail-cover:hover {
  transform: scale(1.02);
}

.detail-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.detail-type {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.detail-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 900;
  margin: 8px 0;
  line-height: 1.1;
}

.detail-artist {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 24px 32px;
}

.play-big-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--accent);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, background-color 0.2s;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.play-big-btn:hover {
  transform: scale(1.05);
  background-color: var(--accent-hover);
}

.play-big-btn:active {
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
}

.like-btn:hover {
  transform: scale(1.1);
}

.mv-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--text-subdued);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
}

.mv-btn:hover {
  background-color: var(--bg-highlight);
  border-color: var(--text-primary);
  transform: scale(1.02);
}

/* Tracklist */
.tracklist {
  padding: 0 32px 32px;
}

.track-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.track-header span:first-child {
  width: 24px;
  text-align: center;
}

.track-divider {
  height: 1px;
  background-color: var(--bg-highlight);
  margin: 0 0 16px 0;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
  cursor: pointer;
}

.track-row:hover {
  background-color: var(--bg-highlight);
}

.track-row.active {
  background-color: rgba(255,255,255,0.05);
}

[data-theme='light'] .track-row.active {
  background-color: rgba(0,0,0,0.05);
}

.track-num {
  width: 24px;
  color: var(--text-secondary);
  font-size: 0.95rem;
  text-align: center;
}

.track-cover {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.track-info {
  display: flex;
  flex-direction: column;
}

.track-title {
  font-size: 0.95rem;
  font-weight: 600;
}

.track-artist {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.track-duration {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin-left: auto;
}

/* Fullscreen Overlay */
.fullscreen-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.fullscreen-controls {
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 12px;
}

.fs-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.fs-btn:hover {
  background: rgba(255,255,255,0.2);
}

.fullscreen-img {
  max-width: 90vw;
  max-height: 85vh;
  border-radius: 12px;
  object-fit: contain;
  transition: transform 0.3s ease;
}
</style>
