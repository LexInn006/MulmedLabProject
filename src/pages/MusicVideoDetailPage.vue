<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { musicVideos } from '../data/musicVideos'
import { usePlayerStore } from '../stores/playerStore'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Music } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()

const video = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)
const volume = ref(1)
const duration = ref(0)
const currentTime = ref(0)
const isMuted = ref(false)
const showControls = ref(true)
let controlTimeout: number | null = null

const mvId = computed(() => Number(route.params.id))
const currIdx = ref(musicVideos.findIndex(mv => mv.id === mvId.value))
const currMV = computed(() => musicVideos[currIdx.value])

const formatTime = (seconds: number) => {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

const loadDuration = () => {
  if (video.value) duration.value = video.value.duration
}

const isDragging = ref(false)

const updateTime = () => {
  if (video.value && !isDragging.value) {
    currentTime.value = video.value.currentTime
  }
}

const playVideo = () => {
  if (!video.value) return
  if (video.value.ended) {
    video.value.currentTime = 0
  }
  if (video.value.paused) {
    // Pause global audio player if playing
    if (player.isPlaying) {
      player.togglePlay()
    }
    video.value.play()
    isPlaying.value = true
    hideControlsDelay()
  } else {
    video.value.pause()
    isPlaying.value = false
    showControls.value = true
  }
}

const changeVolume = (e: Event) => {
  const vol = parseFloat((e.target as HTMLInputElement).value)
  volume.value = vol
  if (video.value) video.value.volume = vol
  isMuted.value = vol === 0
}

const changeTime = (e: Event) => {
  const time = Number((e.target as HTMLInputElement).value)
  if (video.value) {
    video.value.currentTime = time
    currentTime.value = time
  }
  isDragging.value = false
}

const toggleMute = () => {
  if (isMuted.value || volume.value === 0) {
    isMuted.value = false
    volume.value = 1
    if (video.value) video.value.volume = 1
  } else {
    isMuted.value = true
    if (video.value) video.value.volume = 0
  }
}

const changeTrack = (index: number) => {
  currIdx.value = index
  isPlaying.value = true
  setTimeout(() => {
    video.value?.load()
    video.value?.play()
  }, 50)
}

const nextMV = () => {
  changeTrack((currIdx.value + 1) % musicVideos.length)
}

const prevMV = () => {
  changeTrack((currIdx.value - 1 + musicVideos.length) % musicVideos.length)
}

const goFullscreen = () => {
  video.value?.requestFullscreen()
}

const goToSong = () => {
  router.push(`/song/${currMV.value.songId}`)
}

const handleMouseMove = () => {
  showControls.value = true
  hideControlsDelay()
}

const hideControlsDelay = () => {
  if (controlTimeout) clearTimeout(controlTimeout)
  if (isPlaying.value) {
    controlTimeout = setTimeout(() => {
      showControls.value = false
    }, 3000) as unknown as number
  }
}

onMounted(() => {
  if (video.value) video.value.volume = volume.value
})
</script>

<template>
  <div class="mvd-page">
    <div class="mvd-header">
      <NavBar />
    </div>
    
    <div class="mvd-content">
      <!-- Video Player -->
      <div class="video-container" @mousemove="handleMouseMove" @mouseleave="showControls = false">
        <video
          ref="video"
          class="video-player"
          :src="currMV.video"
          @loadedmetadata="loadDuration"
          @timeupdate="updateTime"
          @click="playVideo"
          @ended="isPlaying = false; showControls = true"
        ></video>
        
        <!-- Center Play Overlay -->
        <div class="video-overlay" :class="{ hidden: isPlaying && !showControls }" @click="playVideo">
          <button class="video-play-overlay" @click.stop="playVideo" :class="{ hidden: isPlaying }">
            <Play :size="64" fill="currentColor" stroke="currentColor" />
          </button>
        </div>
      </div>
      
      <!-- Video Info -->
      <div class="mvd-info">
        <div>
          <h2 class="mvd-title">{{ currMV.title }}</h2>
          <p class="mvd-artist">{{ currMV.artist }}</p>
        </div>
        <button class="song-btn" @click="goToSong">
          <Music :size="16" /> Listen to Song
        </button>
      </div>
      
      <!-- Controls -->
      <div class="mvd-controls">
        <div class="mvd-progress">
          <span>{{ formatTime(currentTime) }}</span>
          <input type="range" class="progress-slider" min="0" :max="duration" step="0.1" :value="currentTime" @mousedown="isDragging = true" @change="changeTime" @input="currentTime = Number($event.target.value)" />
          <span>{{ formatTime(duration) }}</span>
        </div>
        
        <div class="mvd-controls-bottom">
          <div class="mvd-buttons">
            <button class="ctrl-btn" @click="prevMV"><SkipBack :size="24" /></button>
            <button class="play-btn" @click="playVideo">
              <Pause v-if="isPlaying" :size="24" fill="currentColor" stroke="currentColor" />
              <Play v-else :size="24" fill="currentColor" stroke="currentColor" style="margin-left: 2px;" />
            </button>
            <button class="ctrl-btn" @click="nextMV"><SkipForward :size="24" /></button>
          </div>
          
          <div class="mvd-actions">
            <button class="ctrl-btn" @click="toggleMute">
              <VolumeX v-if="isMuted" :size="20" />
              <Volume2 v-else :size="20" />
            </button>
            <input type="range" class="volume-slider" min="0" max="1" step="0.01" :value="volume" @input="changeVolume" />
            <div class="divider"></div>
            <button class="ctrl-btn" @click="goFullscreen" title="Fullscreen"><Maximize :size="20" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mvd-page {
  background: radial-gradient(circle at top, #1a1a1a 0%, var(--bg-base) 100%);
  min-height: 100vh;
}

.mvd-header {
  padding-bottom: 16px;
}

.mvd-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 32px 64px;
}

.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  box-shadow: 0 16px 40px rgba(0,0,0,0.6);
  margin-bottom: 24px;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s;
  cursor: pointer;
}

.video-overlay.hidden {
  opacity: 0;
}

.video-play-overlay {
  background: rgba(0,0,0,0.6);
  border: none;
  border-radius: 50%;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.video-play-overlay:hover {
  transform: scale(1.1);
  background: var(--accent);
}

.video-play-overlay.hidden {
  display: none;
}

.mvd-info {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.mvd-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin: 0 0 4px;
}

.mvd-artist {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
}

.song-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  border: 1px solid var(--text-subdued);
  border-radius: var(--radius-full);
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.song-btn:hover {
  background-color: var(--bg-highlight);
  border-color: var(--text-primary);
}

.mvd-controls {
  background-color: var(--bg-surface);
  padding: 24px;
  border-radius: var(--radius-md);
}

.mvd-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.mvd-progress span {
  font-size: 0.8rem;
  color: var(--text-subdued);
  min-width: 40px;
  text-align: center;
}

.progress-slider {
  flex: 1;
}

.mvd-controls-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mvd-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
}

.ctrl-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

.ctrl-btn:hover {
  color: var(--text-primary);
}

.play-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--text-primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.play-btn:hover {
  transform: scale(1.05);
}

.play-btn:active {
  transform: scale(0.95);
}

.mvd-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.volume-slider {
  width: 100px;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: var(--bg-highlight);
  margin: 0 8px;
}
</style>
