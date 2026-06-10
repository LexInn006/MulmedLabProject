<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '../stores/playerStore'
import type { SongData } from '../data/songs'
import { Play, Pause } from 'lucide-vue-next'

const props = defineProps<{ song: SongData; isDark?: boolean }>()
const emit = defineEmits<{ (e: 'click', id: number): void; (e: 'play', song: SongData): void }>()

const player = usePlayerStore()
const isPlaying = computed(() =>
  player.currentSong?.id === props.song.id && player.isPlaying
)

const onPlay = (e: MouseEvent) => {
  e.stopPropagation()
  emit('play', props.song)
}
</script>

<template>
  <div class="song-card" @click="emit('click', song.id)">
    <div class="card-cover-wrap">
      <img :src="song.cover" class="card-cover" :alt="song.title" loading="lazy" />
      <div class="card-overlay">
        <button class="card-play-btn" @click="onPlay">
          <div class="eq-bars" v-if="isPlaying">
            <div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>
          </div>
          <Pause v-else-if="false" :size="20" fill="currentColor" stroke="currentColor" />
          <Play v-else :size="20" fill="currentColor" stroke="currentColor" style="margin-left:2px" />
        </button>
      </div>
      <div v-if="isPlaying" class="playing-badge">
        <div class="eq-bars">
          <div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div>
        </div>
      </div>
    </div>
    <div class="card-info">
      <span class="card-title" :class="{ 'is-playing': isPlaying }">{{ song.title }}</span>
      <span class="card-artist">{{ song.artist }}</span>
    </div>
  </div>
</template>

<style scoped>
.song-card {
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: 14px;
  cursor: pointer;
  transition: all var(--transition);
  border: 1px solid rgba(255,255,255,0.04);
  position: relative;
  overflow: hidden;
}

.song-card::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,210,200,0.04), transparent);
  opacity: 0; transition: opacity var(--transition);
}

.song-card:hover {
  background: var(--bg-elevated);
  transform: translateY(-3px);
  border-color: rgba(255,255,255,0.08);
  box-shadow: 0 12px 28px rgba(0,0,0,0.4);
}
.song-card:hover::before { opacity: 1; }

.card-cover-wrap {
  position: relative; aspect-ratio: 1;
  border-radius: var(--radius-sm); overflow: hidden; margin-bottom: 14px;
}

.card-cover {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s ease;
}
.song-card:hover .card-cover { transform: scale(1.06); }

.card-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: flex-end; justify-content: flex-end;
  padding: 10px;
  opacity: 0; transition: opacity var(--transition);
}
.song-card:hover .card-overlay { opacity: 1; }

.card-play-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
  box-shadow: 0 4px 16px rgba(0,210,200,0.4);
  transform: translateY(6px);
}
.song-card:hover .card-play-btn { transform: translateY(0); }
.card-play-btn:hover { transform: scale(1.1) translateY(0) !important; }

.playing-badge {
  position: absolute; top: 8px; left: 8px;
  background: rgba(0,0,0,0.65); backdrop-filter: blur(4px);
  border-radius: 6px; padding: 5px 7px;
}

.card-info { display: flex; flex-direction: column; gap: 3px; }
.card-title {
  font-size: 0.88rem; font-weight: 700; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color var(--transition);
}
.card-title.is-playing { color: var(--accent); }
.card-artist { font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
