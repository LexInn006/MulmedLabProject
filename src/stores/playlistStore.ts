import { defineStore } from 'pinia'
import type { SongData } from '../data/songs'

// Interface untuk struktur data satu playlist
export interface Playlist {
  id: number        // ID unik playlist
  name: string      // Nama playlist
  songs: SongData[] // Daftar lagu di dalam playlist
  cover: string     // Cover playlist (pakai cover lagu pertama otomatis)
  createdAt: number // Timestamp kapan dibuat
}

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    // Ambil data playlist dari localStorage kalau ada, kalau tidak mulai dari array kosong
    playlists: JSON.parse(localStorage.getItem('spj_playlists') || '[]') as Playlist[]
  }),

  actions: {
    // Buat playlist baru dengan nama yang diberikan
    createPlaylist(name: string) {
      const newPlaylist: Playlist = {
        id: Date.now(),     // pakai timestamp sebagai ID unik
        name: name,
        songs: [],
        cover: '',
        createdAt: Date.now()
      }
      this.playlists.push(newPlaylist)
      this.save()
    },

    // Tambah lagu ke playlist tertentu berdasarkan playlistId
    addSongToPlaylist(playlistId: number, song: SongData) {
      const playlist = this.playlists.find(p => p.id === playlistId)
      if (!playlist) return

      // Cegah lagu duplikat di playlist yang sama
      const alreadyExists = playlist.songs.some(s => s.id === song.id)
      if (alreadyExists) return

      playlist.songs.push(song)

      // Update cover playlist pakai cover lagu pertama
      if (playlist.songs.length === 1) {
        playlist.cover = song.cover
      }

      this.save()
    },

    // Hapus lagu dari playlist tertentu
    removeSongFromPlaylist(playlistId: number, songId: number) {
      const playlist = this.playlists.find(p => p.id === playlistId)
      if (!playlist) return

      playlist.songs = playlist.songs.filter(s => s.id !== songId)

      // Update cover kalau lagu pertama dihapus
      playlist.cover = playlist.songs[0]?.cover || ''

      this.save()
    },

    // Hapus seluruh playlist
    deletePlaylist(playlistId: number) {
      this.playlists = this.playlists.filter(p => p.id !== playlistId)
      this.save()
    },

    // Simpan semua perubahan ke localStorage
    save() {
      localStorage.setItem('spj_playlists', JSON.stringify(this.playlists))
    }
  }
})