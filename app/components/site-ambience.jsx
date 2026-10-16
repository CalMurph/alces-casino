'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './site-ambience.module.css'

const tracks = [
    { title: "Rags to Riches", artist: 'Tony Bennet', src: '/music.mp3'},
    { title: "Ain't That a Kick in the Head", artist: 'Dean Martin', src: '/aint-that-a-kick-in-the-head.mp3' },
    { title: 'Luck Be a Lady', artist: 'Frank Sinatra', src: '/lady-luck.mp3' },
    { title: 'L-O-V-E', artist: 'Nat King Cole', src: '/love.mp3' },
    { title: 'People = Shit', artist: 'Slipknot', src: '/people-equal-shit.mp3' },
    { title: 'Sway', artist: 'Dean Martin', src: '/sway.mp3' },
]

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0:00'
    return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`
}

async function playAudio(audio, name) {
    try {
        await audio.play()
    } catch (error) {
        console.error(`Could not play ${name}:`, error)
    }
}

export default function SiteAmbience() {
    const pathname = usePathname()
    const musicRef = useRef(null)
    const ambienceRef = useRef(null)
    const [trackIndex, setTrackIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playerOpen, setPlayerOpen] = useState(false)
    const [playlistOpen, setPlaylistOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const isInterior = pathname === '/interior'
    const track = tracks[trackIndex]

    function selectTrack(index) {
        const audio = musicRef.current
        if (!audio) return

        if (index === trackIndex) {
            audio.currentTime = 0
        } else {
            audio.src = tracks[index].src
            setTrackIndex(index)
            setCurrentTime(0)
            setDuration(0)
        }

        setPlaylistOpen(false)
        void playAudio(audio, tracks[index].title)
    }

    function skipTrack(direction) {
        const audio = musicRef.current
        if (!audio) return

        if (direction < 0 && audio.currentTime > 3) {
            audio.currentTime = 0
            return
        }

        selectTrack((trackIndex + direction + tracks.length) % tracks.length)
    }

    function togglePlayback() {
        const audio = musicRef.current
        if (!audio) return
        if (audio.paused) void playAudio(audio, track.title)
        else audio.pause()
    }

    function seek(event) {
        const audio = musicRef.current
        if (!audio || !Number.isFinite(audio.duration)) return
        audio.currentTime = Number(event.target.value)
        setCurrentTime(audio.currentTime)
    }

    useEffect(() => {
        const ambience = ambienceRef.current
        if (!ambience) return

        if (isInterior && isPlaying) {
            ambience.volume = 0.25
            void playAudio(ambience, 'interior ambience')
        } else {
            ambience.pause()
            if (!isInterior) ambience.currentTime = 0
        }
    }, [isInterior, isPlaying])

    return (
        <>
            <audio
                id="site-ambience-audio"
                ref={musicRef}
                src={tracks[0].src}
                preload="auto"
                onPlay={(event) => {
                    const index = tracks.findIndex((song) => event.currentTarget.currentSrc.endsWith(song.src))
                    if (index >= 0) setTrackIndex(index)
                    setIsPlaying(true)
                }}
                onPause={() => setIsPlaying(false)}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onEnded={() => selectTrack((trackIndex + 1) % tracks.length)}
            />
            <audio id="interior-ambience-audio" ref={ambienceRef} src="/ambience.mp3" loop preload="metadata" />

            {isInterior && (
                playerOpen ? (
                    <aside className={styles.player} id="music-player-panel" aria-label="Music player">
                        <div className={styles.panelHeader}>
                            <span>ALCES CASINO · MUSIC</span>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={() => {
                                    setPlayerOpen(false)
                                    setPlaylistOpen(false)
                                }}
                                aria-label="Close music player"
                            >×</button>
                        </div>
                        <div className={styles.mainRow}>
                            <div className={styles.record} aria-hidden="true">
                                <span className={styles.discFace}>
                                    <span className={styles.discLabel} />
                                </span>
                                <span className={styles.needle} />
                            </div>
                            <button
                                type="button"
                                className={styles.songButton}
                                onClick={() => setPlaylistOpen((open) => !open)}
                                aria-expanded={playlistOpen}
                                aria-controls="music-track-list"
                                aria-label={`Change song. Current song: ${track.title} by ${track.artist}`}
                            >
                                <span className={styles.eyebrow}>NOW PLAYING <span>· {String(trackIndex + 1).padStart(2, '0')} / {String(tracks.length).padStart(2, '0')}</span></span>
                                <strong className={styles.title}>{track.title}</strong>
                                <span className={styles.artist}>{track.artist} <span aria-hidden="true">⌄</span></span>
                            </button>
                            <div className={styles.controls}>
                                <button type="button" className={styles.skipButton} onClick={() => skipTrack(-1)} aria-label="Previous song">⏮</button>
                                <button type="button" className={styles.playButton} onClick={togglePlayback} aria-label={isPlaying ? 'Pause music' : 'Play music'} aria-pressed={isPlaying}>{isPlaying ? 'Ⅱ' : '▶'}</button>
                                <button type="button" className={styles.skipButton} onClick={() => skipTrack(1)} aria-label="Next song">⏭</button>
                            </div>
                        </div>
                        <div className={styles.progressRow}>
                            <span>{formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 1}
                                step="1"
                                value={Math.min(currentTime, duration || 1)}
                                onChange={seek}
                                disabled={!duration}
                                aria-label={`Seek within ${track.title}`}
                            />
                            <span>{formatTime(duration)}</span>
                        </div>
                        <div className={styles.playlist} id="music-track-list" hidden={!playlistOpen}>
                            <div className={styles.playlistHeader}>
                                <span>THE CASINO PLAYLIST</span>
                                <span>{tracks.length} TRACKS</span>
                            </div>
                            {tracks.map((song, index) => (
                                <button
                                    key={song.src}
                                    type="button"
                                    className={`${styles.playlistTrack} ${index === trackIndex ? styles.selected : ''}`}
                                    onClick={() => selectTrack(index)}
                                    aria-label={`Play ${song.title} by ${song.artist}`}
                                    aria-current={index === trackIndex ? 'true' : undefined}
                                >
                                    <span className={styles.trackNumber}>{String(index + 1).padStart(2, '0')}</span>
                                    <span className={styles.playlistSong}>
                                        <strong>{song.title}</strong>
                                        <small>{song.artist}</small>
                                    </span>
                                    <span className={styles.trackIndicator} aria-hidden="true">{index === trackIndex && isPlaying ? '♫' : '▶'}</span>
                                </button>
                            ))}
                        </div>
                    </aside>
                ) : (
                    <button
                        type="button"
                        className={styles.discTrigger}
                        onClick={() => setPlayerOpen(true)}
                        aria-label="Open music player"
                    >
                        <span className={styles.discFace} aria-hidden="true">
                            <span className={styles.discLabel} />
                        </span>
                        <span className={styles.needle} aria-hidden="true" />
                    </button>
                )
            )}
        </>
    )
}
