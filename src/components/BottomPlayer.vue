<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/playerStore'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart } from 'lucide-vue-next'

const router = useRouter()
const player = usePlayerStore()

const goToSong = () => { if (player.currentSong) router.push(`/song/${player.currentSong.id}`) }
const onSeek = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value)
  player.seek(val); player.isDragging = false
}
const onVolume = (e: Event) => {
  player.setVolume(Number((e.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="player-bar" v-if="player.currentSong">
    <!-- Ambient glow from cover -->
    <div class="player-glow" :style="{ backgroundImage: `url(${player.currentSong.cover})` }"></div>

    <!-- Left: Song info -->
    <div class="player-left" @click="goToSong">
      <div class="cover-wrap">
        <img :src="player.currentSong.cover" class="player-cover" />
        <div class="cover-overlay">
          <div class="eq-bars" v-if="player.isPlaying">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
        </div>
      </div>
      <div class="song-text">
        <span class="song-title">{{ player.currentSong.title }}</span>
        <span class="song-artist">{{ player.currentSong.artist }}</span>
      </div>
      <button class="like-btn" @click.stop="player.toggleLike(player.currentSong.id)">
        <Heart :size="15"
          :fill="player.isLiked(player.currentSong.id) ? 'var(--accent)' : 'none'"
          :stroke="player.isLiked(player.currentSong.id) ? 'var(--accent)' : 'currentColor'" />
      </button>
    </div>

    <!-- Center: Controls -->
    <div class="player-center">
      <div class="ctrl-row">
        <button class="ctrl-btn" @click="player.prev()"><SkipBack :size="18" /></button>
        <button class="play-btn" @click="player.togglePlay()">
          <Pause v-if="player.isPlaying" :size="18" fill="currentColor" stroke="currentColor" />
          <Play v-else :size="18" fill="currentColor" stroke="currentColor" style="margin-left:2px" />
        </button>
        <button class="ctrl-btn" @click="player.next()"><SkipForward :size="18" /></button>
      </div>
      <div class="progress-row">
        <span class="time-label">{{ player.formattedCurrentTime }}</span>
        <input type="range" class="progress-slider" min="0" :max="player.duration" step="0.1"
          :value="player.currentTime"
          @mousedown="player.isDragging = true"
          @change="onSeek"
          @input="player.currentTime = Number(($event.target as HTMLInputElement).value)"
          :style="{ '--progress': (player.duration ? (player.currentTime/player.duration)*100 : 0)+'%' }" />
        <span class="time-label">{{ player.formattedDuration }}</span>
      </div>
    </div>

    <!-- Right: Volume -->
    <div class="player-right">
      <button class="ctrl-btn" @click="player.toggleMute()">
        <VolumeX v-if="player.isMuted || player.volume === 0" :size="16" />
        <Volume2 v-else :size="16" />
      </button>
      <input type="range" class="vol-slider" min="0" max="1" step="0.01"
        :value="player.volume" @input="onVolume"
        :style="{ '--progress': (player.volume*100)+'%' }" />
    </div>
  </div>
</template>

<style scoped>
.player-bar {
  height: var(--player-height);
  background: var(--player-bar-bg);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--player-bar-border);
  position: fixed; bottom: 0; left: 0; right: 0;
  display: flex; align-items: center;
  padding: 0 20px; z-index: 1000;
  overflow: hidden;
}

.player-glow {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: blur(60px); opacity: 0.07;
  pointer-events: none; z-index: 0;
  transform: scale(1.5);
}

.player-left {
  flex: 1; min-width: 0; max-width: 280px;
  display: flex; align-items: center; gap: 12px;
  cursor: pointer; position: relative; z-index: 1;
}

.cover-wrap {
  position: relative; width: 52px; height: 52px; flex-shrink: 0;
}

.player-cover {
  width: 52px; height: 52px; border-radius: 10px; object-fit: cover;
  box-shadow: 0 4px 14px rgba(0,0,0,0.5);
}

.cover-overlay {
  position: absolute; inset: 0; border-radius: 10px;
  background: var(--player-cover-overlay);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity var(--transition);
}
.player-left:hover .cover-overlay { opacity: 1; }

.song-text { flex: 1; min-width: 0; }
.song-title {
  display: block; font-size: 0.88rem; font-weight: 700;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  color: var(--text-primary); margin-bottom: 2px;
}
.song-artist { font-size: 0.73rem; color: var(--text-secondary); }

.like-btn {
  background: none; border: none; color: var(--text-secondary);
  cursor: pointer; padding: 6px; transition: all var(--transition);
  display: flex; align-items: center; flex-shrink: 0;
}
.like-btn:hover { color: var(--accent); transform: scale(1.15); }

/* Center */
.player-center {
  flex: 1.4; max-width: 540px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  position: relative; z-index: 1;
}

.ctrl-row { display: flex; align-items: center; gap: 20px; }

.ctrl-btn {
  background: none; border: none; color: var(--text-secondary); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition); padding: 4px; border-radius: 6px;
}
.ctrl-btn:hover { color: var(--text-primary); background: var(--player-control-hover); }

.play-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
  box-shadow: 0 0 0 0 var(--accent-glow);
}
.play-btn:hover { transform: scale(1.1); box-shadow: 0 0 16px rgba(0,210,200,0.4); }
.play-btn:active { transform: scale(0.94); }

.progress-row {
  display: flex; align-items: center; gap: 8px; width: 100%;
}
.time-label { font-size: 0.68rem; color: var(--text-subdued); min-width: 36px; text-align: center; }
.progress-slider { flex: 1; }

/* Right */
.player-right {
  flex: 1; min-width: 0; max-width: 200px;
  display: flex; align-items: center; justify-content: flex-end; gap: 10px;
  position: relative; z-index: 1;
}
.vol-slider { width: 90px; }
</style>
