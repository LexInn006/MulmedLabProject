<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { musicVideos } from '../data/musicVideos'
import type { SongData } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import SearchBar from '../components/SearchBar.vue'
import SongCard from '../components/SongCard.vue'
import { Clapperboard } from 'lucide-vue-next'

const router = useRouter()
const profile = useProfileStore()
const searchQuery = ref('')

const mvAsSongs = computed(() => musicVideos.map(mv => ({
  id: mv.id, title: mv.title, artist: mv.artist,
  cover: mv.cover, audio: '', mv: mv.id, duration: mv.duration
} as unknown as SongData)))

const filteredMVs = computed(() => {
  if (!searchQuery.value) return mvAsSongs.value
  const q = searchQuery.value.toLowerCase()
  return mvAsSongs.value.filter(mv =>
    mv.title.toLowerCase().includes(q) || mv.artist.toLowerCase().includes(q))
})

const goToMVDetail = (payload: any) => {
  const id = typeof payload === 'number' ? payload : payload.id
  router.push(`/music-video/${id}`)
}
</script>

<template>
  <div class="mv-page page-enter">
    <div class="mv-hero">
      <div class="hero-bg"></div>
      <NavBar><SearchBar v-model="searchQuery" /></NavBar>
      <div class="mv-heading">
        <div class="heading-icon-wrap">
          <Clapperboard :size="22" />
        </div>
        <div>
          <h1 class="mv-title">Music Videos</h1>
          <p class="mv-sub">Watch your favorite artists in action</p>
        </div>
      </div>
    </div>

    <div class="mv-body">
      <div class="card-grid">
        <SongCard
          v-for="(mv, i) in filteredMVs"
          :key="mv.id"
          :song="mv"
          :isDark="profile.isDarkMode"
          :style="{ animationDelay: `${i * 0.05}s` }"
          class="fade-in"
          @click="goToMVDetail"
          @play="goToMVDetail"
        />
      </div>
      <p v-if="filteredMVs.length === 0" class="empty-msg">No music videos found</p>
    </div>
  </div>
</template>

<style scoped>
.mv-hero {
  position: relative; padding-bottom: 32px; overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(236,72,153,0.12), rgba(124,106,255,0.1), transparent);
  pointer-events: none;
}
.hero-bg::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-base));
}

.mv-heading {
  display: flex; align-items: center; gap: 18px;
  padding: 12px 28px 0; position: relative; z-index: 1;
}
.heading-icon-wrap {
  width: 52px; height: 52px; border-radius: 14px;
  background: linear-gradient(135deg, rgba(236,72,153,0.3), rgba(124,106,255,0.3));
  border: 1px solid rgba(236,72,153,0.25);
  display: flex; align-items: center; justify-content: center;
  color: #f472b6;
}
.mv-title { font-size: 2rem; font-weight: 900; margin: 0 0 4px; letter-spacing: -0.5px; }
.mv-sub { color: var(--text-secondary); margin: 0; font-size: 0.9rem; }

.mv-body { padding: 0 28px 80px; }
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 18px;
}
.empty-msg { color: var(--text-subdued); text-align: center; padding: 48px; }
</style>
