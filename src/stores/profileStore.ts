import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    username: localStorage.getItem('spj_username') || 'Guest',
    profileImage: localStorage.getItem('spj_profileImage') || '',
    isDarkMode: localStorage.getItem('spj_darkMode') !== 'false' // default to true if null
  }),

  actions: {
    setUsername(name: string) {
      this.username = name
      localStorage.setItem('spj_username', name)
    },

    async setProfileImage(file: File) {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            let { width, height } = img

            const MAX_SIZE = 800
            if (width > MAX_SIZE || height > MAX_SIZE) {
              if (width > height) {
                height = Math.round((height * MAX_SIZE) / width)
                width = MAX_SIZE
              } else {
                width = Math.round((width * MAX_SIZE) / height)
                height = MAX_SIZE
              }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(img, 0, 0, width, height)

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)
            const sizeInBytes = compressedBase64.length * 0.75
            const finalBase64 = sizeInBytes > 1_000_000 ? canvas.toDataURL('image/jpeg', 0.5) : compressedBase64

            this.profileImage = finalBase64
            localStorage.setItem('spj_profileImage', finalBase64)
            resolve()
          }
          img.onerror = reject
          img.src = e.target?.result as string
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('spj_darkMode', String(this.isDarkMode))
      document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light')
    },
    
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light')
    }
  }
})
