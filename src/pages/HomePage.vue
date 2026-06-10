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
import { Play, TrendingUp, Headphones } from 'lucide-vue-next'

const router = useRouter()
const profile = useProfileStore()
const player = usePlayerStore()
const searchQuery = ref('')

const hour = new Date().getHours()
const greeting = computed(() => {
  if (hour < 12) return `Good Morning`
  if (hour < 18) return `Good Afternoon`
  return `Good Evening`
})
const greetingSub = computed(() => `Welcome back, ${profile.username}`)

const filteredSongs = computed(() => {
  if (!searchQuery.value) return songs
  const q = searchQuery.value.toLowerCase()
  return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
})

const trendingSongs = computed(() => songs.slice(0, 6))

const handlePlay = (song: SongData) => player.playSong(song, songs)
const goToSongDetail = (id: number) => router.push(`/song/${id}`)
</script>

<template>
  <div class="home page-enter">
    <!-- Hero Header -->
    <div class="home-hero">
      <div class="hero-bg"></div>
      <NavBar><SearchBar v-model="searchQuery" /></NavBar>

      <div class="hero-content" v-if="!searchQuery">
        <div class="hero-text">
          <p class="hero-eyebrow">{{ greeting }}</p>
          <h1 class="hero-title">{{ greetingSub }}</h1>
          <p class="hero-sub">Discover and enjoy your music today</p>
        </div>
      </div>
    </div>

    <div class="home-body">
      <!-- Quick-play strip (trending) -->
      <section v-if="!searchQuery" class="section">
        <div class="section-head">
          <div class="section-title-wrap">
            <TrendingUp :size="18" class="section-icon" />
            <h2 class="section-title">Trending Now</h2>
          </div>
        </div>
        <div class="quick-strip">
          <div
            v-for="song in trendingSongs"
            :key="song.id"
            class="quick-tile"
            @click="handlePlay(song)"
          >
            <img :src="song.cover" class="quick-cover" />
            <div class="quick-info">
              <span class="quick-name">{{ song.title }}</span>
              <span class="quick-artist">{{ song.artist }}</span>
            </div>
            <button class="quick-play">
              <Play :size="14" fill="currentColor" stroke="currentColor" style="margin-left:1px" />
            </button>
          </div>
        </div>
      </section>

      <!-- All Songs -->
      <section class="section">
        <div class="section-head">
          <div class="section-title-wrap">
            <Headphones :size="18" class="section-icon" />
            <h2 class="section-title">{{ searchQuery ? `Results for "${searchQuery}"` : 'All Songs' }}</h2>
          </div>
        </div>
        <div class="card-grid">
          <SongCard
            v-for="(song, i) in filteredSongs"
            :key="song.id"
            :song="song"
            :isDark="profile.isDarkMode"
            :style="{ animationDelay: `${i * 0.04}s` }"
            class="fade-in"
            @click="goToSongDetail"
            @play="handlePlay"
          />
        </div>
        <p v-if="filteredSongs.length === 0" class="empty-msg">No songs found for "{{ searchQuery }}"</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home { min-height: 100vh; }

.home-hero {
  position: relative;
  padding-bottom: 32px;
  overflow: hidden;
}

.hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg,
    rgba(0, 210, 200, 0.12) 0%,
    rgba(124, 106, 255, 0.1) 50%,
    transparent 100%);
  pointer-events: none;
}
.hero-bg::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-base));
}

.hero-content {
  padding: 8px 28px 0;
  position: relative; z-index: 1;
}
.hero-eyebrow {
  font-size: 0.8rem; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--accent); margin: 0 0 8px;
}
.hero-title {
  font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 900;
  margin: 0 0 6px; letter-spacing: -0.5px;
  line-height: 1.15;
}
.hero-sub { color: var(--text-secondary); font-size: 0.95rem; margin: 0; }

.home-body { padding: 0 28px 80px; }

.section { margin-bottom: 40px; }

.section-head { margin-bottom: 18px; }
.section-title-wrap {
  display: flex; align-items: center; gap: 10px;
}
.section-icon { color: var(--accent); }
.section-title { font-size: 1.15rem; font-weight: 800; margin: 0; }

/* Quick-play strip */
.quick-strip {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 10px;
}

.quick-tile {
  display: flex; align-items: center; gap: 12px;
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: var(--radius-md); overflow: hidden;
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
}
.quick-tile:hover {
  background: var(--bg-elevated);
  border-color: rgba(0,210,200,0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.35);
}
.quick-tile:hover .quick-play { opacity: 1; transform: scale(1); }

.quick-cover {
  width: 60px; height: 60px; object-fit: cover; flex-shrink: 0;
}
.quick-info {
  flex: 1; min-width: 0;
}
.quick-name {
  display: block; font-size: 0.87rem; font-weight: 700;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 2px;
}
.quick-artist { font-size: 0.74rem; color: var(--text-secondary); }

.quick-play {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  border: none; color: #000;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; margin-right: 12px;
  opacity: 0; transform: scale(0.8);
  transition: all var(--transition);
  box-shadow: 0 4px 12px rgba(0,210,200,0.4);
}

/* Song grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 18px;
}

.empty-msg { color: var(--text-subdued); text-align: center; padding: 48px; font-size: 1rem; }
</style>
