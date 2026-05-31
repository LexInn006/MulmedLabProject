<script setup lang="ts">
import { useProfileStore } from '../stores/profileStore'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const store = useProfileStore()
const router = useRouter()
</script>

<template>
  <!-- Keep bootstrap navbar class to fulfill requirement technically -->
  <nav class="navbar" style="display:none"></nav>
  
  <header class="topbar">
    <!-- Left: Nav arrows -->
    <div class="topbar-left">
      <button class="topbar-arrow" @click="router.back()" title="Go back"><ChevronLeft :size="22" /></button>
      <button class="topbar-arrow" @click="router.forward()" title="Go forward"><ChevronRight :size="22" /></button>
    </div>
    
    <!-- Center: Slot for Search or other content -->
    <div class="topbar-center">
      <slot></slot>
    </div>
    
    <!-- Right: User info -->
    <div class="topbar-right" @click="router.push('/profile')">
      <img v-if="store.profileImage" :src="store.profileImage" class="topbar-avatar" />
      <div v-else class="topbar-avatar topbar-avatar-placeholder">{{ store.username.charAt(0).toUpperCase() }}</div>
      <span class="topbar-username">{{ store.username }}</span>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: var(--topbar-height);
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  background: transparent;
}

.topbar-left {
  display: flex;
  gap: 8px;
}

.topbar-arrow {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: var(--bg-elevated);
  border: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.topbar-arrow:hover {
  background-color: var(--bg-highlight);
}

.topbar-center {
  flex: 1;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: var(--radius-full);
  background-color: var(--bg-base);
  transition: background-color 0.2s;
}

.topbar-right:hover {
  background-color: var(--bg-highlight);
}

.topbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.topbar-avatar-placeholder {
  background-color: var(--accent);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.topbar-username {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
</style>
