<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '../stores/profileStore'
import { usePlayerStore } from '../stores/playerStore'
import NavBar from '../components/NavBar.vue'
import { Sun, Moon, Upload, Check, Camera } from 'lucide-vue-next'

// Inisialisasi store
const store = useProfileStore()
const player = usePlayerStore()

// State lokal untuk input username, status upload foto, dan pesan "Saved"
const newUsername = ref(store.username)
const isUploading = ref(false)
const savedMsg = ref(false)

// Fungsi menyimpan username baru ke store
// Tidak menyimpan jika input kosong, lalu tampilkan pesan "Saved" selama 2 detik
const saveUsername = () => {
  if (!newUsername.value.trim()) return
  store.setUsername(newUsername.value.trim())
  savedMsg.value = true
  setTimeout(() => { savedMsg.value = false }, 2000)
}

// Fungsi menangani upload foto profil
// Mengambil file dari input, set loading minimal 3 detik, lalu simpan ke store
const handleImageUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  isUploading.value = true

  // Jalankan proses upload dan timer 3 detik secara paralel,
  // baru sembunyikan loading setelah keduanya selesai
  const minDelay = new Promise<void>(resolve => setTimeout(resolve, 3000))
  await Promise.all([store.setProfileImage(file), minDelay])

  isUploading.value = false
  // Reset input agar file yang sama bisa diupload ulang
  target.value = ''
}
</script>

<template>
  <div class="profile-page">

    <!-- ===== HEADER PROFIL ===== -->
    <div class="profile-header">
      <!-- Komponen navigasi atas -->
      <NavBar />

      <!-- Hero section: menampilkan foto dan info profil -->
      <div class="profile-hero">

        <!-- Wrapper foto profil dengan tombol upload overlay -->
        <div class="profile-avatar-wrapper">
          <!-- Spinner ditampilkan saat foto sedang diupload (minimal 3 detik) -->
          <div v-if="isUploading" class="avatar-loading">
            <div class="spinner"></div>
            <span class="upload-label">Uploading...</span>
          </div>

          <!-- Tampilkan foto profil jika sudah ada -->
          <img v-else-if="store.profileImage" :src="store.profileImage" class="profile-avatar" />

          <!-- Placeholder inisial huruf pertama username jika belum ada foto -->
          <div v-else class="profile-avatar avatar-placeholder">{{ store.username.charAt(0).toUpperCase() }}</div>
          
          <!-- Overlay kamera yang muncul saat hover, memicu input file -->
          <label class="avatar-upload-overlay" for="imageInput">
            <Camera :size="32" />
            <span>Choose Photo</span>
          </label>

          <!-- Input file tersembunyi untuk upload foto dari avatar -->
          <input id="imageInput" type="file" accept="image/*" class="hidden-input" @change="handleImageUpload" />
        </div>
        
        <!-- Info teks profil: label, nama, dan jumlah liked songs -->
        <div class="profile-info">
          <span class="profile-label">Profile</span>
          <h1 class="profile-name">{{ store.username }}</h1>
          <p class="profile-stats">{{ player.likedSongs.length }} Liked Songs</p>
        </div>
      </div>
    </div>
    
    <!-- ===== KONTEN PENGATURAN ===== -->
    <div class="profile-content">
      <div class="settings-grid">

        <!-- KARTU: Pengaturan Akun -->
        <div class="settings-card">
          <h3>Account Settings</h3>
          
          <!-- Form ganti username -->
          <div class="form-group">
            <label>Username</label>
            <div class="input-row">
              <!-- Input teks terikat ke newUsername -->
              <input v-model="newUsername" type="text" class="text-input" placeholder="Enter username" />

              <!-- Tombol save: ikon centang + teks berubah saat berhasil disimpan -->
              <button class="save-btn" @click="saveUsername">
                <Check v-if="savedMsg" :size="16" /> {{ savedMsg ? 'Saved' : 'Save' }}
              </button>
            </div>
          </div>
          
          <!-- Form upload foto profil (alternatif selain klik avatar) -->
          <div class="form-group">
            <label>Profile Photo</label>
            <div class="input-row">
              <label class="upload-btn" for="imageInput2">
                <Upload :size="16" /> Upload
              </label>

              <!-- Input file tersembunyi untuk upload foto dari tombol Upload -->
              <input id="imageInput2" type="file" accept="image/*" class="hidden-input" @change="handleImageUpload" />
              <p class="upload-note">Max 1 MB · JPEG/PNG</p>
            </div>
          </div>
        </div>
        
        <!-- Pengaturan Tampilan (Dark/Light Mode) -->
        <div class="settings-card">
          <h3>Appearance</h3>
          <p class="settings-desc">Choose how SpoJeDy looks to you.</p>
          
          <!-- Baris toggle tema: ikon + label + toggle switch -->
          <div class="theme-toggle-row">
            <div class="theme-info">
              <!-- Ikon Sun untuk light mode, Moon untuk dark mode -->
              <Sun v-if="!store.isDarkMode" :size="24" class="theme-icon" />
              <Moon v-else :size="24" class="theme-icon" />

              <div>
                <!-- Label teks mode berubah sesuai kondisi isDarkMode -->
                <strong>{{ store.isDarkMode ? 'Dark Mode' : 'Light Mode' }}</strong>
                <p>Enjoy a visually comfortable experience.</p>
              </div>
            </div>
            
            <!-- Toggle switch: kelas "active" ditambahkan saat dark mode aktif -->
            <!-- Klik memanggil toggleDarkMode() di store -->
            <div class="toggle-switch" :class="{ active: store.isDarkMode }" @click="store.toggleDarkMode()">
              <div class="toggle-thumb"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  background: linear-gradient(180deg, rgba(83,83,83,0.6) 0%, var(--bg-base) 100%);
  padding-bottom: 24px;
}

.profile-hero {
  display: flex;
  align-items: flex-end;
  gap: 32px;
  padding: 32px 32px 24px;
}

@media (max-width: 600px) {
  .profile-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

.profile-avatar-wrapper {
  position: relative;
  width: 192px;
  height: 192px;
  border-radius: 50%;
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: none;
}

.avatar-placeholder {
  background-color: var(--accent);
  color: #000;
  font-size: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.avatar-upload-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.3s;
}

.avatar-upload-overlay span {
  font-size: 0.85rem;
  font-weight: 600;
}

.profile-avatar-wrapper:hover .avatar-upload-overlay {
  opacity: 1;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.profile-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.profile-name {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 900;
  margin: 4px 0 12px;
  line-height: 1.1;
}

.profile-stats {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

.profile-content {
  padding: 32px;
  max-width: 1000px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

@media (max-width: 600px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

.settings-card {
  background-color: var(--bg-surface);
  border-radius: var(--radius-lg);
  padding: 32px;
}

.settings-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 24px;
}

.settings-desc {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: -16px 0 24px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.text-input {
  flex: 1;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--bg-highlight);
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s;
}

.text-input:focus {
  border-color: var(--text-secondary);
  background-color: var(--bg-highlight);
}

.save-btn {
  padding: 12px 24px;
  border-radius: var(--radius-full);
  background-color: var(--accent);
  color: #000;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  transition: transform 0.2s, background-color 0.2s;
  min-width: 100px;
  justify-content: center;
}

.save-btn:hover {
  background-color: var(--accent-hover);
  transform: scale(1.04);
}

.save-btn:active {
  transform: scale(0.96);
}

.upload-btn {
  padding: 10px 20px;
  border-radius: var(--radius-full);
  background-color: var(--bg-elevated);
  border: 1px solid var(--text-subdued);
  color: var(--text-primary);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.upload-btn:hover {
  background-color: var(--bg-highlight);
  border-color: var(--text-primary);
}

.hidden-input {
  display: none;
}

.upload-note {
  font-size: 0.8rem;
  color: var(--text-subdued);
  margin: 0;
}

.theme-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--bg-elevated);
  padding: 20px;
  border-radius: var(--radius-md);
}

.theme-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-icon {
  color: var(--text-primary);
}

.theme-info strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 4px;
}

.theme-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.toggle-switch {
  width: 52px;
  height: 28px;
  border-radius: var(--radius-full);
  background-color: var(--text-subdued);
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-switch.active {
  background-color: var(--accent);
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: left 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.toggle-switch.active .toggle-thumb {
  left: 27px;
}

/* ===== LOADING SPINNER ===== */

.avatar-loading {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--bg-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.upload-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--bg-highlight);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>