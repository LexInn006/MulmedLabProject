<script setup lang="ts">
import { useProfileStore } from '../stores/profileStore'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Bell } from 'lucide-vue-next'

const store = useProfileStore()
const router = useRouter()
</script>

<template>
  <nav class="topbar">
    <div class="topbar-left">
      <button class="nav-arrow" @click="router.back()" title="Back">
        <ChevronLeft :size="18" />
      </button>
      <button class="nav-arrow" @click="router.forward()" title="Forward">
        <ChevronRight :size="18" />
      </button>
    </div>

    <div class="topbar-center">
      <slot></slot>
    </div>

    <div class="topbar-right" @click="router.push('/profile')">
      <button class="notif-btn">
        <Bell :size="17" />
      </button>
      <div class="profile-chip">
        <img v-if="store.profileImage" :src="store.profileImage" class="chip-avatar" />
        <div v-else class="chip-avatar chip-placeholder">
          {{ store.username.charAt(0).toUpperCase() }}
        </div>
        <span class="chip-name">{{ store.username }}</span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.topbar {
  height: var(--topbar-height);
  display: flex; align-items: center;
  padding: 0 28px; gap: 16px;
  position: sticky; top: 0; z-index: 10;
  background: transparent;
}

.topbar-left { display: flex; gap: 6px; }

.nav-arrow {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.06);
  color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
}
.nav-arrow:hover { background: var(--bg-highlight); color: var(--text-primary); }

.topbar-center { flex: 1; }

.topbar-right {
  display: flex; align-items: center; gap: 10px; cursor: pointer;
}

.notif-btn {
  width: 34px; height: 34px; border-radius: 10px;
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.06);
  color: var(--text-secondary);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all var(--transition);
}
.notif-btn:hover { color: var(--accent); background: var(--accent-glow); }

.profile-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 14px 4px 4px;
  border-radius: var(--radius-full);
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.06);
  transition: all var(--transition);
}
.profile-chip:hover { background: var(--bg-highlight); }

.chip-avatar {
  width: 28px; height: 28px; border-radius: 50%; object-fit: cover;
}
.chip-placeholder {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.85rem;
}
.chip-name { font-size: 0.82rem; font-weight: 700; }
</style>
