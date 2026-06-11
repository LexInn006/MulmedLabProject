<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from 'lucide-vue-next'

const router = useRouter()
const player = usePlayerStore()

const goToSong = () => {
  if (player.currentSong) {
    router.push(`/song/${player.currentSong.id}`)
  }
}

const onSeek = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value)
  player.seek(val)
  player.isDragging = false
}

const onVolume = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value)
  player.setVolume(val)
}
</script>

<template>
  <div class="player-bar" v-if="player.currentSong">
    <!-- Left: Song Info -->
    <div class="player-song-info" @click="goToSong">
      <img :src="player.currentSong.cover" class="player-cover" />
      <div class="player-song-text">
        <span class="player-song-title">{{ player.currentSong.title }}</span>
        <span class="player-song-artist">{{ player.currentSong.artist }}</span>
      </div>
      <button class="player-like-btn" @click.stop="player.toggleLike(player.currentSong.id)">
        <Heart :size="16" :fill="player.isLiked(player.currentSong.id) ? '#8b5cf6' : 'none'" :stroke="player.isLiked(player.currentSong.id) ? '#8b5cf6' : 'currentColor'" />
      </button>
    </div>
    
    <!-- Center: Controls + Progress -->
    <div class="player-controls-center">
      <div class="player-buttons">
        <button class="control-btn" @click="player.prev()"><SkipBack :size="20" /></button>
        <button class="play-btn" @click="player.togglePlay()">
          <Pause v-if="player.isPlaying" :size="20" fill="currentColor" stroke="currentColor" />
          <Play v-else :size="20" fill="currentColor" stroke="currentColor" />
        </button>
        <button class="control-btn" @click="player.next()"><SkipForward :size="20" /></button>
      </div>
      <div class="player-progress">
        <span class="player-time">{{ player.formattedCurrentTime }}</span>
        <input type="range" class="progress-slider" min="0" :max="player.duration" step="0.1" :value="player.currentTime" @mousedown="player.isDragging = true" @change="onSeek" @input="player.currentTime = Number(($event.target as HTMLInputElement).value)" :style="{ '--progress': (player.duration ? (player.currentTime / player.duration) * 100 : 0) + '%' }" />
        <span class="player-time">{{ player.formattedDuration }}</span>
      </div>
    </div>
    
    <!-- Right: Volume -->
    <div class="player-volume">
      <button class="control-btn" @click="player.toggleMute()">
        <VolumeX v-if="player.isMuted || player.volume === 0" :size="18" />
        <Volume2 v-else :size="18" />
      </button>
      <input type="range" class="volume-slider" min="0" max="1" step="0.01" :value="player.volume" @input="onVolume" :style="{ '--progress': (player.volume * 100) + '%' }" />
    </div>
  </div>
</template>

<style scoped>
.player-bar {
  height: var(--player-height);
  background-color: var(--bg-surface);
  border-top: 1px solid var(--bg-highlight);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  z-index: 1000;
}

/* Left: Song Info */
.player-song-info {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.player-cover {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.player-song-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.player-song-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.player-song-title:hover {
  text-decoration: underline;
}

.player-song-artist {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.player-song-artist:hover {
  color: var(--text-primary);
  text-decoration: underline;
}

.player-like-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, color 0.2s;
}

.player-like-btn:hover {
  color: var(--text-primary);
  transform: scale(1.1);
}

/* Center: Controls */
.player-controls-center {
  flex: 1.5;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.player-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
}

.control-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.control-btn:hover {
  color: var(--text-primary);
}

.play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--text-primary);
  color: var(--bg-base);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
}

.play-btn:hover {
  transform: scale(1.05);
}

.play-btn:active {
  transform: scale(0.95);
}

/* Progress */
.player-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.player-time {
  font-size: 0.7rem;
  color: var(--text-subdued);
  min-width: 40px;
  text-align: center;
}

.progress-slider {
  flex: 1;
}

/* Right: Volume */
.player-volume {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.volume-slider {
  width: 100px;
}
</style>
