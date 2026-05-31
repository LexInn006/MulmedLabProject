<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Home, Video, User, Heart, Library } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <aside class="sidebar">
    <!-- Logo -->
    <div class="sidebar-logo">SpoJeDy</div>
    
    <!-- Main Nav -->
    <nav class="sidebar-nav">
      <router-link to="/" class="sidebar-link" active-class="active">
        <Home :size="24" /> Home
      </router-link>
      <router-link to="/music-video" class="sidebar-link" active-class="active">
        <Video :size="24" /> Music Videos
      </router-link>
    </nav>
    
    <!-- Divider -->
    <div class="sidebar-divider"></div>
    
    <!-- Library Section -->
    <div class="sidebar-section">
      <div class="sidebar-section-title"><Library :size="20" /> Your Library</div>
      <router-link to="/profile" class="sidebar-link" active-class="active">
        <User :size="24" /> Profile
      </router-link>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: var(--bg-base);
  border-right: 1px solid var(--bg-highlight);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.sidebar-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--accent);
  padding: 24px;
  letter-spacing: 1px;
}

.sidebar-nav, .sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.95rem;
}

.sidebar-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-highlight);
}

.sidebar-link.active {
  color: var(--text-primary);
  font-weight: 700;
  position: relative;
  background-color: var(--bg-highlight);
}

.sidebar-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 20%;
  height: 60%;
  width: 4px;
  background-color: var(--accent);
  border-radius: 0 4px 4px 0;
}

.sidebar-divider {
  height: 1px;
  background-color: var(--bg-highlight);
  margin: 16px 24px;
}

.sidebar-section-title {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  color: var(--text-subdued);
  padding: 8px 16px;
  font-weight: 700;
  display: flex;
  gap: 12px;
  align-items: center;
}

.sidebar-liked {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: var(--radius-sm);
  transition: all 0.2s;
}

.sidebar-liked:hover {
  color: var(--text-primary);
  background-color: var(--bg-highlight);
}

.liked-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: linear-gradient(135deg, #450af5, #c4efd9);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
