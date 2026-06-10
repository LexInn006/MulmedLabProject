<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { usePlayerStore } from '../stores/playerStore'
import NavBar from '../components/NavBar.vue'
import { Sun, Moon, Upload, Check, Camera } from 'lucide-vue-next'

const store = useProfileStore()
const player = usePlayerStore()
const newUsername = ref(store.username)
const isUploading = ref(false)
const savedMsg = ref(false)

const saveUsername = () => {
  if (!newUsername.value.trim()) return
  store.setUsername(newUsername.value.trim())
  savedMsg.value = true
  setTimeout(() => { savedMsg.value = false }, 2000)
}

const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]
  isUploading.value = true
  const minDelay = new Promise<void>(resolve => setTimeout(resolve, 3000))
  await Promise.all([store.setProfileImage(file), minDelay])
  isUploading.value = false
  target.value = ''
}
</script>

<template>
  <div class="profile-page page-enter">
    <!-- Hero -->
    <div class="profile-hero">
      <div class="hero-bg"></div>
      <NavBar />
      <div class="hero-body">
        <div class="avatar-wrap">
          <div v-if="isUploading" class="avatar-loading">
            <div class="spinner"></div>
            <span>Uploading...</span>
          </div>
          <img v-else-if="store.profileImage" :src="store.profileImage" class="avatar" />
          <div v-else class="avatar avatar-placeholder">
            {{ store.username.charAt(0).toUpperCase() }}
          </div>
          <label class="avatar-overlay" for="img1">
            <Camera :size="26" />
            <span>Change</span>
          </label>
          <input id="img1" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </div>

        <div class="hero-info">
          <span class="hero-eyebrow">Profile</span>
          <h1 class="hero-name">{{ store.username }}</h1>
          <p class="hero-stats">
            <span class="stat">{{ player.likedSongs.length }}</span> Liked Songs
          </p>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="settings-body">
      <div class="settings-grid">
        <!-- Account -->
        <div class="settings-card">
          <h3 class="card-title">Account Settings</h3>
          <div class="form-group">
            <label class="form-label">Username</label>
            <div class="input-row">
              <input v-model="newUsername" type="text" class="text-input" placeholder="Enter username" />
              <button class="save-btn" @click="saveUsername">
                <Check v-if="savedMsg" :size="14" />
                {{ savedMsg ? 'Saved' : 'Save' }}
              </button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Profile Photo</label>
            <div class="input-row">
              <label class="upload-btn" for="img2">
                <Upload :size="14" /> Upload Photo
              </label>
              <input id="img2" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
              <span class="upload-note">Max 1MB · JPEG/PNG</span>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="settings-card">
          <h3 class="card-title">Appearance</h3>
          <p class="card-desc">Customize how the app looks to you.</p>
          <div class="theme-row">
            <div class="theme-left">
              <div class="theme-icon-wrap">
                <Sun v-if="!store.isDarkMode" :size="20" />
                <Moon v-else :size="20" />
              </div>
              <div>
                <strong>{{ store.isDarkMode ? 'Dark Mode' : 'Light Mode' }}</strong>
                <p>{{ store.isDarkMode ? 'Easy on the eyes' : 'Bright and clean' }}</p>
              </div>
            </div>
            <div class="toggle" :class="{ on: store.isDarkMode }" @click="store.toggleDarkMode()">
              <div class="toggle-knob"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page { min-height: 100vh; }

.profile-hero { position: relative; padding-bottom: 32px; overflow: hidden; }
.hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,210,200,0.1), rgba(124,106,255,0.1), transparent);
  pointer-events: none;
}
.hero-bg::after {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 80px;
  background: linear-gradient(to bottom, transparent, var(--bg-base));
}

.hero-body {
  display: flex; align-items: flex-end; gap: 32px;
  padding: 16px 28px 8px; position: relative; z-index: 1;
}

.avatar-wrap {
  position: relative; width: 160px; height: 160px; border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.avatar {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
}
.avatar-placeholder {
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; font-size: 4rem; font-weight: 900;
  display: flex; align-items: center; justify-content: center; border-radius: 50%;
}
.avatar-overlay {
  position: absolute; inset: 0; border-radius: 50%;
  background: rgba(0,0,0,0.55); display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px; color: white;
  opacity: 0; cursor: pointer; transition: opacity var(--transition);
  font-size: 0.78rem; font-weight: 600;
}
.avatar-wrap:hover .avatar-overlay { opacity: 1; }

.avatar-loading {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--bg-surface);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
}
.avatar-loading span { font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); }

.hero-eyebrow {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; color: var(--accent); margin-bottom: 6px; display: block;
}
.hero-name {
  font-size: clamp(2rem, 5vw, 4rem); font-weight: 900;
  margin: 0 0 8px; letter-spacing: -1px; line-height: 1.1;
}
.hero-stats { color: var(--text-secondary); margin: 0; font-size: 0.95rem; }
.stat { font-weight: 800; color: var(--text-primary); }

.settings-body { padding: 24px 28px 80px; }
.settings-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 20px;
}

.settings-card {
  background: var(--bg-card);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: var(--radius-lg); padding: 28px;
}
.card-title { font-size: 1rem; font-weight: 800; margin: 0 0 22px; }
.card-desc { color: var(--text-secondary); font-size: 0.88rem; margin: -14px 0 22px; }

.form-group { margin-bottom: 20px; }
.form-label { display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }

.input-row { display: flex; align-items: center; gap: 10px; }
.text-input {
  flex: 1; padding: 10px 14px;
  border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.08);
  background: var(--bg-elevated); color: var(--text-primary);
  font-size: 0.9rem; outline: none; transition: all var(--transition);
  font-family: var(--font-family);
}
.text-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

.save-btn {
  padding: 10px 20px; border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--accent), var(--accent2));
  color: #000; font-weight: 700; border: none; cursor: pointer;
  display: flex; align-items: center; gap: 6px; font-size: 0.88rem;
  transition: all var(--transition); min-width: 80px; justify-content: center;
  font-family: var(--font-family);
}
.save-btn:hover { opacity: 0.88; transform: scale(1.04); }

.upload-btn {
  padding: 9px 18px; border-radius: var(--radius-full);
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1);
  color: var(--text-primary); font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 7px; font-size: 0.85rem;
  transition: all var(--transition);
}
.upload-btn:hover { border-color: var(--accent); color: var(--accent); }
.upload-note { font-size: 0.76rem; color: var(--text-subdued); }

.hidden { display: none; }

/* Theme toggle */
.theme-row { display: flex; align-items: center; justify-content: space-between; background: var(--bg-elevated); padding: 18px; border-radius: var(--radius-md); }
.theme-left { display: flex; align-items: center; gap: 14px; }
.theme-icon-wrap {
  width: 40px; height: 40px; border-radius: 10px;
  background: rgba(0,210,200,0.12); border: 1px solid rgba(0,210,200,0.2);
  display: flex; align-items: center; justify-content: center; color: var(--accent);
}
.theme-left strong { display: block; font-size: 0.95rem; margin-bottom: 2px; }
.theme-left p { margin: 0; font-size: 0.8rem; color: var(--text-secondary); }

.toggle {
  width: 50px; height: 26px; border-radius: var(--radius-full);
  background: var(--bg-highlight); position: relative; cursor: pointer;
  transition: background var(--transition);
}
.toggle.on { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
.toggle-knob {
  width: 20px; height: 20px; border-radius: 50%; background: #fff;
  position: absolute; top: 3px; left: 3px; transition: left var(--transition);
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.toggle.on .toggle-knob { left: 27px; }

/* Spinner */
.spinner {
  width: 42px; height: 42px; border: 3px solid var(--bg-highlight);
  border-top-color: var(--accent); border-radius: 50%;
  animation: spin 0.75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .hero-body { flex-direction: column; align-items: center; text-align: center; }
  .settings-grid { grid-template-columns: 1fr; }
}
</style>
