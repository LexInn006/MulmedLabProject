<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { musicVideos } from '../data/musicVideos'
import { songs } from '../data/songs'
import { usePlayerStore } from '../stores/playerStore'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize, Music } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()

const video = ref<HTMLVideoElement | null>(null)
const videoReady = ref(false)

const mvId = computed(() => Number(route.params.id))
const currIdx = ref(musicVideos.findIndex(mv => mv.id === mvId.value))
const currMV = computed(() => musicVideos[currIdx.value] || musicVideos[0])
const currAssociatedSong = computed(() => songs.find(s => s.id === currMV.value.songId) || songs[0])

const isThisSongPlaying = computed(() => {
  return player.currentSong?.id === currAssociatedSong.value.id && player.isPlaying
})

const tryPlay = () => {
  if (!video.value) return
  video.value.play().catch(() => {
    // Autoplay blocked — user will click to start
  })
}

const onVideoCanPlay = () => {
  videoReady.value = true
  if (isThisSongPlaying.value) {
    tryPlay()
  }
}
watch(() => isThisSongPlaying.value, (playing) => {
  if (playing) {
    if (videoReady.value) {
      tryPlay()
    }
  } else {
    video.value?.pause()
  }
})

// Auto-switch MV when the bottom player changes to a different song
watch(() => player.currentSong, (newSong) => {
  if (!newSong) return
  const matchingMvIdx = musicVideos.findIndex(mv => mv.songId === newSong.id)
  if (matchingMvIdx !== -1 && matchingMvIdx !== currIdx.value) {
    currIdx.value = matchingMvIdx
    // Update URL to stay in sync
    router.replace(`/music-video/${musicVideos[matchingMvIdx].id}`)
  }
})

watch(currMV, () => {
  videoReady.value = false
  nextTick(() => {
    if (video.value) {
      video.value.load()
    }
  })
})

const playVideo = () => {
  if (player.currentSong?.id === currAssociatedSong.value.id) {
    player.togglePlay()
  } else {
    player.playSong(currAssociatedSong.value, songs)
  }
}

const changeTrack = (index: number) => {
  currIdx.value = index
}

const nextMV = () => {
  changeTrack((currIdx.value + 1) % musicVideos.length)
}

const prevMV = () => {
  changeTrack((currIdx.value - 1 + musicVideos.length) % musicVideos.length)
}

const videoContainer = ref<HTMLElement | null>(null)
const isFullscreen = ref(false)

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement || !!(document as any).webkitFullscreenElement || !!(document as any).msFullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  document.addEventListener('MSFullscreenChange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  document.removeEventListener('MSFullscreenChange', onFullscreenChange)
})

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen().catch(err => console.error(err))
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen()
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen()
  }
}

const goFullscreen = () => {
  const elem = videoContainer.value || video.value
  if (!elem) return
  
  if (elem.requestFullscreen) {
    elem.requestFullscreen().catch(err => console.error("Error attempting to enable fullscreen:", err))
  } else if ((elem as any).webkitRequestFullscreen) { /* Safari */
    (elem as any).webkitRequestFullscreen()
  } else if ((elem as any).msRequestFullscreen) { /* IE11 */
    (elem as any).msRequestFullscreen()
  }
}

const goToSong = () => {
  router.push(`/song/${currMV.value.songId}`)
}
</script>

<template>
  <div class="mvd-page">
    <div class="mvd-header">
      <NavBar />
    </div>
    
    <div class="mvd-content">
      <!-- Video Player -->
      <div class="video-container" ref="videoContainer">
        <video
          ref="video"
          class="video-player"
          :src="currMV.video"
          :poster="currMV.cover"
          preload="auto"
          loop
          muted
          playsinline
          @canplay="onVideoCanPlay"
          @click="playVideo"
        ></video>
        
        <!-- Center Play Overlay -->
        <div class="video-overlay" :class="{ hidden: isThisSongPlaying }" @click="playVideo">
          <button class="video-play-overlay" @click.stop="playVideo">
            <Play :size="64" fill="currentColor" stroke="currentColor" />
          </button>
        </div>
        
        <!-- Exit Fullscreen Button -->
        <button v-if="isFullscreen" class="exit-fs-btn" @click.stop="exitFullscreen" title="Exit Fullscreen">
          <Minimize :size="24" />
        </button>
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
        <div class="mvd-buttons" style="justify-content: center;">
          <button class="ctrl-btn" @click="prevMV" title="Previous Video"><SkipBack :size="24" /></button>
          
          <button class="play-btn" @click="playVideo" style="width: 56px; height: 56px;">
            <Pause v-if="isThisSongPlaying" :size="28" fill="currentColor" stroke="currentColor" />
            <Play v-else :size="28" fill="currentColor" stroke="currentColor" style="margin-left: 2px;" />
          </button>
          
          <button class="ctrl-btn" @click="nextMV" title="Next Video"><SkipForward :size="24" /></button>
          <button class="ctrl-btn" @click="goFullscreen" title="Fullscreen" style="position: absolute; right: 56px;"><Maximize :size="24" /></button>
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
  pointer-events: none;
}

.video-play-overlay {
  background: rgba(0,0,0,0.6);
  color: #ffffff;
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

.mvd-buttons {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
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
  color: var(--bg-base);
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

.exit-fs-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(0,0,0,0.6);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.exit-fs-btn:hover {
  background: var(--accent);
  transform: scale(1.1);
}
</style>
