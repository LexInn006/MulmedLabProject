<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { useProfileStore } from '../stores/profileStore'
import { songs } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import { Play, Pause, Heart, MonitorPlay } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()
const profileStore = useProfileStore()

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

const goToMV = () => {
  if (currSong.value.mv) {
    router.push(`/music-video/${currSong.value.mv}`)
  }
}
</script>

<template>
  <div class="song-detail-page" :class="{ 'is-light': !profileStore.isDarkMode }">
    <!-- Blurred Background -->
    <div 
      class="bg-blur"
      :style="{ backgroundImage: `url(${currSong.cover})` }"
    ></div>
    <div class="bg-overlay"></div>
    
    <div class="content-wrapper">
      <div class="nav-container">
        <NavBar />
      </div>
      
      <div class="detail-main">
        <div class="cover-container">
          <img :src="currSong.cover" class="main-cover" />
        </div>
        
        <div class="info-container">
          <span class="type-label">Single</span>
          <h1 class="song-title">{{ currSong.title }}</h1>
          <p class="song-artist">{{ currSong.artist }} • {{ currSong.duration }}</p>
          
          <div class="action-buttons">
            <button class="play-btn" @click="handlePlay">
              <Pause v-if="isCurrentPlaying" :size="32" fill="currentColor" stroke="currentColor" />
              <Play v-else :size="32" fill="currentColor" stroke="currentColor" style="margin-left: 4px;" />
            </button>
            
            <button class="like-btn" @click="player.toggleLike(currSong.id)">
              <Heart :size="40" :fill="player.isLiked(currSong.id) ? '#8b5cf6' : 'none'" :stroke="player.isLiked(currSong.id) ? '#8b5cf6' : (profileStore.isDarkMode ? '#ffffff' : '#000000')" />
            </button>
            
            <button v-if="currSong.mv" class="mv-btn" @click="goToMV">
              <MonitorPlay :size="20" /> Watch Music Video
            </button>
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
  overflow: hidden;
  color: #ffffff;
}

.song-detail-page.is-light {
  color: #111111;
}

.bg-blur {
  position: absolute;
  inset: -10%;
  background-size: cover;
  background-position: center;
  filter: blur(100px);
  z-index: 0;
  opacity: 0.5;
  transition: background-image 0.5s ease;
}

.is-light .bg-blur {
  opacity: 0.2;
}

.bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, var(--bg-base) 100%);
  z-index: 1;
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
</style>
