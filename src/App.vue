<script setup lang="ts">
import { onMounted } from 'vue'
import { useProfileStore } from './stores/profileStore'
import { usePlayerStore } from './stores/playerStore'
import Sidebar from './components/Sidebar.vue'
import BottomPlayer from './components/BottomPlayer.vue'

const profile = useProfileStore()
const player = usePlayerStore()

onMounted(() => {
  profile.initTheme()
  player.initAudio()
})
</script>

<template>
  <div class="app-layout" :data-theme="profile.isDarkMode ? 'dark' : 'light'">
    <Sidebar />
    <div class="app-main">
      <div class="app-content">
        <RouterView />
      </div>
    </div>
    <BottomPlayer />
  </div>
</template>

<style>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-family);
  transition: background 0.4s ease, color 0.4s ease;
}

.app-main {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding-bottom: var(--player-height);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Router transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-leave-to   { opacity: 0; transform: translateY(-6px); }

@media (max-width: 768px) {
  .app-main { margin-left: 0; }
}
</style>
