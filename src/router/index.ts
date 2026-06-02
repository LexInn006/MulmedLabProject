import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import SongDetailPage from '../pages/SongDetailPage.vue'
import MusicVideoPage from '../pages/MusicVideoPage.vue'
import MusicVideoDetailPage from '../pages/MusicVideoDetailPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import PlaylistDetailPage from '../pages/PlaylistDetailPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/song/:id', name: 'song-detail', component: SongDetailPage },
    { path: '/music-video', name: 'music-video', component: MusicVideoPage },
    { path: '/music-video/:id', name: 'music-video-detail', component: MusicVideoDetailPage },
    { path: '/profile', name: 'profile', component: ProfilePage },
    { path: '/playlist/:id', component: PlaylistDetailPage },
  ]
})

export default router
