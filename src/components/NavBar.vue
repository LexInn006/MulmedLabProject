<script setup lang="ts">
import { useProfileStore } from '../stores/profileStore'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const store = useProfileStore()
const router = useRouter()
</script>

<template>
  <!-- Bootstrap Navbar Component -->
  <nav class="navbar spj-topbar">
    <!-- Kiri: tombol navigasi back/forward -->
    <div class="spj-topbar-left">
      <button class="spj-topbar-arrow" @click="router.back()" title="Go back">
        <ChevronLeft :size="22" />
      </button>
      <button class="spj-topbar-arrow" @click="router.forward()" title="Go forward">
        <ChevronRight :size="22" />
      </button>
    </div>

    <!-- Tengah: slot untuk search bar atau konten lain -->
    <div class="spj-topbar-center">
      <slot></slot>
    </div>

    <!-- Kanan: foto profil + username, klik untuk ke halaman profile -->
    <div class="spj-topbar-right" @click="router.push('/profile')">
      <img v-if="store.profileImage" :src="store.profileImage" class="spj-topbar-avatar" />
      <div v-else class="spj-topbar-avatar spj-topbar-avatar-placeholder">
        {{ store.username.charAt(0).toUpperCase() }}
      </div>
      <span class="spj-topbar-username">{{ store.username }}</span>
    </div>
  </nav>
</template>

<style scoped>
.spj-topbar {
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

.spj-topbar-left {
  display: flex;
  gap: 8px;
}

.spj-topbar-arrow {
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

.spj-topbar-arrow:hover {
  background-color: var(--bg-highlight);
}

.spj-topbar-center {
  flex: 1;
}

.spj-topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: var(--radius-full);
  background-color: var(--bg-base);
  transition: background-color 0.2s;
}

.spj-topbar-right:hover {
  background-color: var(--bg-highlight);
}

.spj-topbar-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.spj-topbar-avatar-placeholder {
  background-color: var(--accent);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.spj-topbar-username {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
}
</style>