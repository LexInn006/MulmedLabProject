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
    duration: "3:53"
  },
  {
    id: 3,
    title: "It's You",
    artist: "Sezairi x KALEB J",
    cover: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/itsyou.jpg?updatedAt=1779077422145",
    audio: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Songs/Sezairi%20x%20KALEB%20J%20-%20Its%20You%20(Live%20Session).mp3?updatedAt=1779077800943",
    mv: 3,
    duration: "4:15"
  }
]
