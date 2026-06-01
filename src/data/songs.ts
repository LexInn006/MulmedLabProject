export interface SongData {
  id: number
  title: string
  artist: string
  cover: string
  audio: string
  mv: number
  duration: string
}

export const songs: SongData[] = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    cover: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/blindinglights.jpg?updatedAt=1779077422024",
    audio: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/The%20Weeknd%20-%20Blinding%20Lights%20(Lyrics).mp3?updatedAt=1779077797653",
    mv: 1,
    duration: "3:20"
  },
  {
    id: 2,
    title: "Shape of You",
    artist: "Ed Sheeran",
    cover: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/shapeofyou.jpg?updatedAt=1779077422284",
    audio: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/Ed%20Sheeran%20-%20Shape%20of%20You%20(Lyrics).mp3?updatedAt=1779077800647",
    mv: 2,
    duration: "3:51"
  },
  {
    id: 3,
    title: 'Better',
    artist: 'Bren Joy, Luke Chiang',
    cover: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/better.jpg?updatedAt=1779077422045',
    audio: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/Better.mp3?updatedAt=1779077800092',
    mv: 3,
    duration: "3:15"
  },
  {
    id: 4,
    title: 'Jumping Machine',
    artist: 'LBI',
    cover: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/jumping_machine.jpg?updatedAt=1779077422293',
    audio: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/%E5%88%A9%E6%AF%94_%E8%B7%B3%E6%A5%BC%E6%9C%BA_(%E5%AE%98%E6%96%B9%E6%AD%8C%E8%AF%8DMV)%EF%BD%9CLBI%20-%20Jumping%20Machine%20(Official%20Lyric%20Video).mp3?updatedAt=1779077797724',
    mv: 4,
    duration: "3:21"
  },
  {
    id: 5,
    title: "It's You",
    artist: 'Sezairi, KALEB J',
    cover: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/itsyou.jpg?updatedAt=1779077422145',
    audio: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/Sezairi%20x%20KALEB%20J%20-%20Its%20You%20(Live%20Session).mp3?updatedAt=1779077800943',
    mv: 5,
    duration: "4:34"
  },
  {
    id: 6,
    title: '505',
    artist: 'Arctic Monkey',
    cover: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/505.jpg?updatedAt=1779077933018',
    audio: 'https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/Arctic%20Monkeys%20-%20505.mp3?updatedAt=1779077800877',
    mv: 6,
    duration: "4:11"
  }
]
