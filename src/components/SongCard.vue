<script setup lang="ts">
import type { SongData } from '../data/songs'
import { Play } from 'lucide-vue-next'

const props = defineProps<{
  song: SongData | any // any so it accepts MvData too
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'click', id: number): void
  (e: 'play', song: any): void
}>()
</script>

<template>
  <!-- Keep Bootstrap card class technically -->
  <div class="card song-card" @click="emit('click', song.id)">
    <div class="card-cover-wrapper">
      <img :src="song.cover" class="card-cover" :alt="song.title" />
      <button class="card-play-btn" @click.stop="emit('play', song)">
        <Play :size="24" fill="currentColor" stroke="currentColor" style="margin-left: 4px;" />
      </button>
    </div>
    <div class="card-info">
      <h6 class="card-title">{{ song.title }}</h6>
      <p class="card-artist">{{ song.artist }}</p>
    </div>
  </div>
</template>

<style scoped>
.song-card {
  padding: 16px;
  border-radius: var(--radius-md);
  background-color: var(--bg-surface);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  height: 100%;
}

.song-card:hover {
  background-color: var(--bg-elevated);
}

.card-cover-wrapper {
  position: relative;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  border-radius: var(--radius-sm);
}

.card-cover {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-sm);
  display: block;
}

.card-play-btn {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--accent);
  color: #000000;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(8px);
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.song-card:hover .card-play-btn {
  opacity: 1;
  transform: translateY(0);
}

.card-play-btn:hover {
  background-color: var(--accent-hover);
  transform: scale(1.05) translateY(0) !important;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-artist {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
