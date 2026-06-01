export interface MvData {
  id: number
  title: string
  artist: string
  cover: string
  video: string
  songId: number
  duration: string
}

export const musicVideos: MvData[] = [
  {
    id: 1,
    title: "Blinding Lights (Official MV)",
    artist: "The Weeknd",
    cover: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/blindinglights.jpg?updatedAt=1779077422024",
    video: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Video/Blinding%20Lights.mov/ik-video.mp4?tr=f-mp4&updatedAt=1779077716544",
    songId: 1,
    duration: "4:22"
  },
  {
    id: 2,
    title: "Shape of You (Official MV)",
    artist: "Ed Sheeran",
    cover: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/shapeofyou.jpg?updatedAt=1779077422284",
    video: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Video/Shape%20of%20You.mov/ik-video.mp4?tr=f-mp4&updatedAt=1779077715782",
    songId: 2,
    duration: "4:23"
  },
  {
    id: 3,
    title: "It's You (Official MV)",
    artist: "Sezairi x KALEB J",
    cover: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Cover/itsyou.jpg?updatedAt=1779077422145",
    video: "https://ik.imagekit.io/LexInn/Project%20Mulmed/Video/Its%20You.mov/ik-video.mp4?tr=f-mp4&updatedAt=1779077711170",
    songId: 3,
    duration: "3:57"
  }
]
