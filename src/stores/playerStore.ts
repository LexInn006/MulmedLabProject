import { defineStore } from 'pinia'
import type { SongData } from '../data/songs'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    currentSong: null as SongData | null,
    queue: [] as SongData[],
    currentIndex: -1,
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    isMuted: false,
    audioElement: null as HTMLAudioElement | null,
    likedSongs: JSON.parse(localStorage.getItem('spj_likedSongs') || '[]') as number[],
    isDragging: false
  }),

  getters: {
    progress: (state) => {
      if (state.duration === 0) return 0
      return (state.currentTime / state.duration) * 100
    },
    formattedCurrentTime: (state) => {
      const min = Math.floor(state.currentTime / 60)
      const sec = Math.floor(state.currentTime % 60)
      return `${min}:${sec.toString().padStart(2, '0')}`
    },
    formattedDuration: (state) => {
      const min = Math.floor(state.duration / 60)
      const sec = Math.floor(state.duration % 60)
      return `${min}:${sec.toString().padStart(2, '0')}`
    },
    isLiked: (state) => {
      return (songId: number) => state.likedSongs.includes(songId)
    }
  },

  actions: {
    initAudio() {
      if (!this.audioElement) {
        this.audioElement = new Audio()
        this.audioElement.addEventListener('timeupdate', () => {
          if (!this.isDragging) {
            this.currentTime = this.audioElement?.currentTime || 0
          }
        })
        this.audioElement.addEventListener('loadedmetadata', () => {
          this.duration = this.audioElement?.duration || 0
        })
        this.audioElement.addEventListener('ended', () => {
          this.next()
        })
        this.audioElement.volume = this.volume
      }
    },

    playSong(song: SongData, queue?: SongData[]) {
      if (!this.audioElement) this.initAudio()
      
      if (queue) {
        this.queue = queue
        this.currentIndex = queue.findIndex(s => s.id === song.id)
      }
      
      this.currentSong = song
      if (this.audioElement) {
        this.audioElement.src = song.audio
        this.audioElement.load()
        this.audioElement.play()
        this.isPlaying = true
      }
    },

    togglePlay() {
      if (!this.audioElement || !this.currentSong) return
      
      if (this.isPlaying) {
        this.audioElement.pause()
        this.isPlaying = false
      } else {
        this.audioElement.play()
        this.isPlaying = true
      }
    },

    next() {
      if (this.queue.length === 0) return
      this.currentIndex = (this.currentIndex + 1) % this.queue.length
      this.playSong(this.queue[this.currentIndex])
    },

    prev() {
      if (this.queue.length === 0) return
      this.currentIndex = (this.currentIndex - 1 + this.queue.length) % this.queue.length
      this.playSong(this.queue[this.currentIndex])
    },

    seek(time: number) {
      if (this.audioElement) {
        this.audioElement.currentTime = time
        this.currentTime = time
      }
    },

    setVolume(vol: number) {
      this.volume = vol
      if (this.audioElement) {
        this.audioElement.volume = vol
      }
      this.isMuted = vol === 0
    },

    toggleMute() {
      if (!this.audioElement) return
      if (this.isMuted || this.volume === 0) {
        this.isMuted = false
        this.volume = 1 // or restore previous volume
        this.audioElement.volume = this.volume
      } else {
        this.isMuted = true
        this.audioElement.volume = 0
      }
    },

    toggleLike(songId: number) {
      const index = this.likedSongs.indexOf(songId)
      if (index > -1) {
        this.likedSongs.splice(index, 1)
      } else {
        this.likedSongs.push(songId)
      }
      localStorage.setItem('spj_likedSongs', JSON.stringify(this.likedSongs))
    }
  }
})
