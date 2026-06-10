<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { musicVideos } from '../data/musicVideos'
import { songs } from '../data/songs'
import { usePlayerStore } from '../stores/playerStore'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize, Music, Volume2, VolumeX } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()

const video = ref<HTMLVideoElement | null>(null)
const videoContainer = ref<HTMLElement | null>(null)
const videoReady = ref(false)
const isVideoPlaying = ref(false)
const isFullscreen = ref(false)

// Volume
const videoVolume = ref(1)
const videoMuted = ref(false)
const prevVideoVolume = ref(1)

const setVideoVolume = (val: number) => {
  videoVolume.value = val
  videoMuted.value = val === 0
  if (video.value) video.value.volume = val
}
const onVolumeInput = (e: Event) => setVideoVolume(Number((e.target as HTMLInputElement).value))
const toggleVideoMute = () => {
  if (videoMuted.value) {
    videoMuted.value = false
    videoVolume.value = prevVideoVolume.value || 1
    if (video.value) video.value.volume = videoVolume.value
  } else {
    prevVideoVolume.value = videoVolume.value
    videoMuted.value = true
    videoVolume.value = 0
    if (video.value) video.value.volume = 0
  }
}

const mvId = computed(() => Number(route.params.id))
const currIdx = ref(musicVideos.findIndex(mv => mv.id === mvId.value))
const currMV = computed(() => musicVideos[currIdx.value] || musicVideos[0])
const currSong = computed(() => songs.find(s => s.id === currMV.value.songId) || songs[0])

const playVideo = () => {
  if (isVideoPlaying.value) {
    video.value?.pause()
    isVideoPlaying.value = false
    if (!player.isPlaying && player.currentSong?.id === currSong.value.id) player.togglePlay()
  } else {
    if (player.isPlaying) player.togglePlay()
    if (videoReady.value) {
      if (video.value) { video.value.volume = videoVolume.value; video.value.play().catch(() => {}) }
      isVideoPlaying.value = true
    }
  }
}

const onVideoCanPlay = () => { videoReady.value = true }
const onVideoPause  = () => { isVideoPlaying.value = false }
const onVideoPlay   = () => { isVideoPlaying.value = true }
const onVideoEnded  = () => { isVideoPlaying.value = false }

watch(currMV, () => {
  videoReady.value = false; isVideoPlaying.value = false
  nextTick(() => video.value?.load())
})

watch(() => player.currentSong, (s) => {
  if (!s) return
  const idx = musicVideos.findIndex(mv => mv.songId === s.id)
  if (idx !== -1 && idx !== currIdx.value) {
    currIdx.value = idx
    router.replace(`/music-video/${musicVideos[idx].id}`)
  }
})

const nextMV = () => { currIdx.value = (currIdx.value + 1) % musicVideos.length }
const prevMV = () => { currIdx.value = (currIdx.value - 1 + musicVideos.length) % musicVideos.length }

const onFSChange = () => { isFullscreen.value = !!(document.fullscreenElement || (document as any).webkitFullscreenElement) }
onMounted(() => {
  document.addEventListener('fullscreenchange', onFSChange)
  document.addEventListener('webkitfullscreenchange', onFSChange)
})
onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFSChange)
  document.removeEventListener('webkitfullscreenchange', onFSChange)
  if (isVideoPlaying.value && !player.isPlaying && player.currentSong) player.togglePlay()
})

const goFullscreen = () => {
  const el = videoContainer.value
  if (!el) return
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
  else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen()
}
const exitFullscreen = () => {
  if (document.exitFullscreen) document.exitFullscreen()
  else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
}
const goToSong = () => router.push(`/song/${currMV.value.songId}`)
</script>

<template>
  <div class="mvd-page page-enter">
    <NavBar />

    <div class="mvd-body">
      <!-- Video -->
      <div class="video-wrap" ref="videoContainer">
        <video ref="video" class="video-el" :src="currMV.video" :poster="currMV.cover"
          preload="auto" loop playsinline
          @canplay="onVideoCanPlay" @click="playVideo"
          @pause="onVideoPause" @play="onVideoPlay" @ended="onVideoEnded">
        </video>

        <!-- Play overlay -->
        <transition name="overlay-fade">
          <div v-if="!isVideoPlaying" class="video-overlay" @click="playVideo">
            <div class="big-play-btn">
              <Play :size="52" fill="currentColor" stroke="currentColor" />
            </div>
          </div>
        </transition>

        <!-- Exit fullscreen -->
        <button v-if="isFullscreen" class="exit-fs-btn" @click.stop="exitFullscreen">
          <Minimize :size="20" />
        </button>
      </div>

      <!-- Info row -->
      <div class="mvd-info-row">
        <div class="mvd-text">
          <h2 class="mvd-title">{{ currMV.title }}</h2>
          <p class="mvd-artist">{{ currMV.artist }}</p>
        </div>
        <button class="song-pill" @click="goToSong">
          <Music :size="14" /> Listen to Song
        </button>
      </div>

      <!-- Controls panel -->
      <div class="controls-panel">
        <button class="ctrl-btn" @click="prevMV"><SkipBack :size="22" /></button>

        <button class="main-play-btn" @click="playVideo">
          <Pause v-if="isVideoPlaying" :size="24" fill="currentColor" stroke="currentColor" />
          <Play v-else :size="24" fill="currentColor" stroke="currentColor" style="margin-left:3px" />
        </button>

        <button class="ctrl-btn" @click="nextMV"><SkipForward :size="22" /></button>

        <!-- Volume -->
        <div class="vol-group">
          <button class="ctrl-btn" @click="toggleVideoMute">
            <VolumeX v-if="videoMuted || videoVolume === 0" :size="18" />
            <Volume2 v-else :size="18" />
          </button>
          <input type="range" class="vol-slider" min="0" max="1" step="0.01"
            :value="videoVolume" @input="onVolumeInput"
            :style="{ '--progress': (videoVolume * 100) + '%' }" />
        </div>

        <button class="ctrl-btn fs-btn" @click="goFullscreen">
          <Maximize :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mvd-page { min-height: 100vh; background: var(--bg-base); }

.mvd-body {
  max-width: 960px; margin: 0 auto;
  padding: 0 28px 80px;
}

/* Video */
.video-wrap {
  width: 100%; aspect-ratio: 16/9;
  background: #000; border-radius: var(--radius-lg);
  overflow: hidden; position: relative;
  box-shadow: 0 24px 60px rgba(0,0,0,0.7);
  margin-bottom: 20px;
  border: 1px solid rgba(255,255,255,0.05);
}

.video-el { width: 100%; height: 100%; object-fit: contain; display: block; }

.video-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.38);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity 0.25s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

.big-play-btn {
  width: 88px; height: 88px; border-radius: 50%;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(8px);
  border: 2px solid rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center; color: #fff;
  transition: all var(--transition);
}
.big-play-btn:hover { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: #000; border-color: transparent; transform: scale(1.08); }

.exit-fs-btn {
  position: absolute; top: 16px; right: 16px;
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15); color: #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: all var(--transition); z-index: 10;
}
.exit-fs-btn:hover { background: rgba(255,255,255,0.15); }

/* Info */
.mvd-info-row {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 20px;
}
.mvd-title { font-size: 1.7rem; font-weight: 900; margin: 0 0 4px; letter-spacing: -0.5px; }
.mvd-artist { color: var(--text-secondary); margin: 0; font-size: 1rem; }
.song-pill {
  display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.08);
  color: var(--text-primary); border-radius: var(--radius-full);
  padding: 10px 18px; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all var(--transition); font-family: var(--font-family);
}
.song-pill:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }

/* Controls */
.controls-panel {
  background: var(--bg-card); border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-md); padding: 20px 28px;
  display: flex; align-items: center; gap: 16px; justify-content: center;
}

.ctrl-btn {
  background: none; border: none; color: var(--text-secondary); cursor: pointer;
  display: flex; align-items: center; padding: 6px; border-radius: 8px;
  transition: all var(--transition);
}
.ctrl-btn:hover { color: var(--text-primary); background: rgba(255,255,255,0.07); }

.main-play-btn {
  width: 52px; height: 52px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
  box-shadow: 0 6px 20px rgba(0,210,200,0.4);
}
.main-play-btn:hover { transform: scale(1.08); box-shadow: 0 10px 28px rgba(0,210,200,0.55); }
.main-play-btn:active { transform: scale(0.94); }

.vol-group {
  display: flex; align-items: center; gap: 8px;
  margin-left: 8px;
}

.vol-slider {
  width: 88px; -webkit-appearance: none; appearance: none;
  height: 4px; border-radius: 2px; outline: none; cursor: pointer;
  background: linear-gradient(
    to right,
    var(--accent) 0%, var(--accent) var(--progress, 100%),
    var(--bg-highlight) var(--progress, 100%), var(--bg-highlight) 100%
  );
}
.vol-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 12px; height: 12px;
  border-radius: 50%; background: var(--text-primary); cursor: pointer;
  transition: transform 0.15s;
}
.vol-slider::-webkit-slider-thumb:hover { transform: scale(1.3); background: var(--accent); }

.fs-btn { margin-left: auto; }
</style>
