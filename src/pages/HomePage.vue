<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { usePlayerStore } from '../stores/playerStore'
import { songs } from '../data/songs'
import type { SongData } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import SearchBar from '../components/SearchBar.vue'
import SongCard from '../components/SongCard.vue'
import { Play } from 'lucide-vue-next'

const router = useRouter()
const profile = useProfileStore()
const player = usePlayerStore()

const searchQuery = ref('')

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return `Good Morning, ${profile.username}`
  if (hour < 18) return `Good Afternoon, ${profile.username}`
  return `Good Evening, ${profile.username}`
})

const timeGradient = computed(() => {
  if (hour < 12) return 'gradient-morning'
  if (hour < 18) return 'gradient-afternoon'
  return 'gradient-evening'
})

const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs
  const query = searchQuery.value.toLowerCase()
  return songs.filter(s => 
    s.title.toLowerCase().includes(query) || 
    s.artist.toLowerCase().includes(query)
  )
})

const handlePlay = (song: SongData) => {
  player.playSong(song, songs)
}

const playSongAndGo = (song: SongData) => {
  handlePlay(song)
}

const goToSongDetail = (id: number) => {
  router.push(`/song/${id}`)
}
</script>

<template>
  <div class="home-page">
    <!-- Gradient Header -->
    <div class="home-header" :class="timeGradient">
      <NavBar>
        <SearchBar v-model="searchQuery" />
      </NavBar>
      <div class="home-greeting">
        <h1>{{ greeting }}</h1>
      </div>
    </div>
    
    <div class="home-content">
      <!-- Quick Play Grid -->
      <div class="quick-grid" v-if="!searchQuery">
        <div v-for="song in songs.slice(0, 6)" :key="song.id" class="quick-card" @click="playSongAndGo(song)">
          <img :src="song.cover" class="quick-cover" />
          <span class="quick-title">{{ song.title }}</span>
          <button class="quick-play-btn"><Play :size="20" fill="currentColor" stroke="currentColor" style="margin-left: 2px;" /></button>
        </div>
      </div>
      
      <!-- Songs Section -->
      <section class="section">
        <h2 class="section-title">{{ searchQuery ? 'Search Results' : 'Songs For You' }}</h2>
        <p class="section-sub">{{ searchQuery ? `Results for "${searchQuery}"` : 'Click a song to start listening' }}</p>
        
        <div class="card-grid">
          <SongCard
            v-for="(song, index) in filteredSongs"
            :key="song.id"
            :song="song"
            :isDark="profile.isDarkMode"
            :style="{ animationDelay: `${index * 0.05}s` }"
            class="fade-in"
            @click="goToSongDetail"
            @play="handlePlay"
          />
        </div>
        <p v-if="filteredSongs.length === 0" class="no-results">No songs found</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-header {
  padding: 0 0 40px;
  position: relative;
}

.gradient-morning { background: linear-gradient(180deg, #e8795a 0%, var(--bg-base) 100%); }
.gradient-afternoon { background: linear-gradient(180deg, #4a8fe7 0%, var(--bg-base) 100%); }
.gradient-evening { background: linear-gradient(180deg, #5b3a8c 0%, var(--bg-base) 100%); }

.home-greeting h1 {
  font-size: 2rem;
  font-weight: 700;
  padding: 20px 32px 0;
  margin: 0;
}

.home-content {
  padding: 0 32px 32px;
}

/* Quick Play Grid */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 40px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

[data-theme='light'] .quick-card {
  background-color: rgba(0, 0, 0, 0.05);
}

.quick-card:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

[data-theme='light'] .quick-card:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.quick-cover {
  width: 64px;
  height: 64px;
  object-fit: cover;
}

.quick-title {
  font-size: 0.95rem;
  font-weight: 700;
  flex: 1;
}

.quick-play-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--accent);
  color: #000000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 16px;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.quick-card:hover .quick-play-btn {
  opacity: 1;
}

.quick-play-btn:hover {
  background-color: var(--accent-hover);
  transform: scale(1.05);
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.section-sub {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 20px;
}

.no-results {
  color: var(--text-subdued);
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
}
</style>
