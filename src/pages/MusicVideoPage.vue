<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profileStore'
import { musicVideos } from '../data/musicVideos'
import type { SongData } from '../data/songs'
import NavBar from '../components/NavBar.vue'
import SearchBar from '../components/SearchBar.vue'
import SongCard from '../components/SongCard.vue'
import { Video } from 'lucide-vue-next'

const router = useRouter()
const profile = useProfileStore()

const searchQuery = ref('')

// Mengubah format data 'musicVideos' menjadi mirip format 'SongData'
// Ini dilakukan agar komponen 'SongCard' (yang awalnya dibuat untuk lagu) bisa menampilkan data video ini
const mvAsSongs = computed(() => {
  return musicVideos.map(mv => ({
    id: mv.id,
    title: mv.title,
    artist: mv.artist,
    cover: mv.cover,
    audio: '',
    mv: mv.id,
    duration: mv.duration
  } as unknown as SongData))
})

// Fitur pencarian/filter otomatis
const filteredMVs = computed(() => {
  if (!searchQuery.value) return mvAsSongs.value
  const query = searchQuery.value.toLowerCase()
  return mvAsSongs.value.filter(mv => 
    mv.title.toLowerCase().includes(query) || 
    mv.artist.toLowerCase().includes(query)
  )
})

// Fungsi untuk pindah ke halaman detail video musik saat sebuah video diklik
const goToMVDetail = (payload: any) => {
  const id = typeof payload === 'number' ? payload : payload.id;
  router.push(`/music-video/${id}`)
}
</script>

<template>
  <div class="mv-page">
    <div class="mv-header">
      <NavBar>
        <SearchBar v-model="searchQuery" />
      </NavBar>
      <div class="mv-heading">
        <Video :size="48" class="heading-icon" />
        <div class="heading-text">
          <h1>Music Videos</h1>
          <p>Watch music videos from your favorite artists</p>
        </div>
      </div>
    </div>
    
    <div class="mv-content">
      <div class="card-grid">
        <SongCard
          v-for="(mv, index) in filteredMVs"
          :key="mv.id"
          :song="mv"
          :isDark="profile.isDarkMode"
          :style="{ animationDelay: `${index * 0.05}s` }"
          class="fade-in"
          @click="goToMVDetail"
          @play="goToMVDetail"
        />
      </div>
      <p v-if="filteredMVs.length === 0" class="no-results">No music videos found</p>
    </div>
  </div>
</template>

<style scoped>
.mv-header {
  background: linear-gradient(180deg, rgba(236,72,153,0.3) 0%, var(--bg-base) 100%);
  padding-bottom: 32px;
}

.mv-heading {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px 32px 0;
}

.heading-icon {
  background: var(--bg-elevated);
  padding: 12px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.heading-text h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 4px;
}

.heading-text p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

.mv-content {
  padding: 0 32px 32px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
}

.no-results {
  color: var(--text-subdued);
  text-align: center;
  padding: 40px;
  font-size: 1.1rem;
}
</style>
