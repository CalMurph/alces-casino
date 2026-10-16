'use client'

import Link from 'next/link'
import ReactDOM from 'react-dom'
import styles from './exterior.module.css'

export default function Splash() {
    ReactDOM.preload('/aint-that-a-kick-in-the-head.mp3', {
        as: 'audio',
        type: 'audio/mpeg',
        fetchPriority: 'high',
    })

    function startMusic() {
        const audio = document.getElementById('site-ambience-audio')
        if (audio instanceof HTMLAudioElement) {
            const firstTrack = '/aint-that-a-kick-in-the-head.mp3'
            const isFirstTrack = audio.src.endsWith(firstTrack)

            if (!isFirstTrack) {
                audio.src = firstTrack
            }

            if (!isFirstTrack || audio.paused) {
                audio.play().catch((error) => console.error('Could not play music:', error))
            }
        }
    }

    return (
        <main className={styles.splash}>
            <div className={styles.splashContent}>
                <p className={styles.brand}>ALCES CASINO</p>
                <h1>Let&apos;s gamble.</h1>
                <div className={styles.rule} aria-hidden="true" />
                <div className={styles.splashActions}>

                    <Link href="/entrance" className={styles.enterButton} onPointerDown={startMusic} onClick={startMusic}>
                        ENTER
                    </Link>
                </div>
            </div>
        </main>
    )
}
