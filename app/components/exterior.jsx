'use client'

import Image from 'next/image'
import { useSceneTransition } from './scene-transition'
import styles from './exterior.module.css'

export default function Exterior() {
    const { transitionTo, isTransitioning } = useSceneTransition()

    function enterCasino() {
        transitionTo('/interior')
    }

    return (
        <main className={styles.entrance} aria-label="Alces Casino entrance">
            <link rel="preload" as="image" href="/interior.png" />
            <Image
                src="/Entrance.png"
                alt="The illuminated Alces Casino entrance at night"
                fill
                preload
                sizes="100vw"
                className={styles.entranceImage}
            />
            <button
                type="button"
                className={styles.exteriorEnter}
                onClick={enterCasino}
                disabled={isTransitioning}
            >
                ENTER
            </button>
        </main>
    )
}
