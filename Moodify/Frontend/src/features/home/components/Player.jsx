import { useEffect, useRef, useState } from 'react'
import { useSong } from '../hooks/useSong'
import './Player.scss'

const Player = () => {
  const { song } = useSong()
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)

  useEffect(() => {
    const audio = audioRef.current

    if (!audio) {
      return undefined
    }

    audio.load()
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
  }, [song?.url])

  const togglePlayback = async () => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (audio.paused) {
      await audio.play()
    } else {
      audio.pause()
    }
  }

  const skip = (seconds) => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.currentTime = Math.min(
      Math.max(audio.currentTime + seconds, 0),
      audio.duration || Number.MAX_SAFE_INTEGER,
    )
  }

  const handleSeek = (event) => {
    const audio = audioRef.current

    if (audio) {
      audio.currentTime = Number(event.target.value)
      setCurrentTime(audio.currentTime)
    }
  }

  const handleSpeedChange = (event) => {
    const rate = Number(event.target.value)
    setPlaybackRate(rate)

    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
  }

  const formatTime = (time) => {
    if (!Number.isFinite(time)) {
      return '0:00'
    }

    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
  }

  return (
    <section className="player" aria-label="Music player">
      <audio
        ref={audioRef}
        src={song?.url}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player__song">
        <img className="player__artwork" src={song?.posterUrl} alt="" />
        <div className="player__details">
          <span className="player__eyebrow">Now playing</span>
          <h2>{song?.title || 'No song selected'}</h2>
          <span>{song?.mood ? `${song.mood} mood` : 'Moodify'}</span>
        </div>
      </div>

      <div className="player__main">
        <div className="player__controls">
          <button type="button" className="player__secondary-control" onClick={() => skip(-5)} aria-label="Rewind 5 seconds">
            <span aria-hidden="true">↶</span> 5s
          </button>
          <button type="button" className="player__play" onClick={togglePlayback} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          <button type="button" className="player__secondary-control" onClick={() => skip(5)} aria-label="Forward 5 seconds">
            <span aria-hidden="true">↷</span> 5s
          </button>
        </div>

        <div className="player__progress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            aria-label="Song progress"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <label className="player__speed">
        <span>Speed</span>
        <select value={playbackRate} onChange={handleSpeedChange} aria-label="Playback speed">
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </label>
    </section>
  )
}

export default Player
