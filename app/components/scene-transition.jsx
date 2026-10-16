'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from './scene-transition.module.css'

const SceneTransitionContext = createContext(null)
const FADE_DURATION = 650
const COVER_DURATION = 665

export function SceneTransitionProvider({ children }) {
    const router = useRouter()
    const pathname = usePathname()
    const [phase, setPhase] = useState('idle')
    const targetPath = useRef(null)
    const coverTimer = useRef(null)
    const reducedMotion = useRef(false)

    const transitionTo = useCallback((path) => {
        if (targetPath.current) return

        targetPath.current = path
        reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setPhase('covering')

        coverTimer.current = window.setTimeout(() => {
            setPhase('covered')
            router.push(path)
        }, reducedMotion.current ? 0 : COVER_DURATION)
    }, [router])

    useEffect(() => {
        if (phase !== 'covered' || pathname !== targetPath.current) return

        const timer = window.setTimeout(() => setPhase('revealing'), 0)
        return () => window.clearTimeout(timer)
    }, [phase, pathname])

    useEffect(() => {
        if (phase !== 'revealing') return

        const timer = window.setTimeout(() => {
            setPhase('idle')
            targetPath.current = null
        }, reducedMotion.current ? 0 : FADE_DURATION)
        return () => window.clearTimeout(timer)
    }, [phase])

    useEffect(() => {
        function handleHistoryNavigation() {
            if (!targetPath.current) return
            if (coverTimer.current !== null) window.clearTimeout(coverTimer.current)
            setPhase('revealing')
        }

        window.addEventListener('popstate', handleHistoryNavigation)

        return () => {
            window.removeEventListener('popstate', handleHistoryNavigation)
            if (coverTimer.current !== null) window.clearTimeout(coverTimer.current)
        }
    }, [])

    const isTransitioning = phase !== 'idle'

    return (
        <SceneTransitionContext.Provider value={{ transitionTo, isTransitioning }}>
            {children}
            <div
                className={`${styles.overlay} ${phase === 'covering' || phase === 'covered' ? styles.black : ''} ${isTransitioning ? styles.active : ''}`}
                aria-hidden="true"
            />
        </SceneTransitionContext.Provider>
    )
}

export function useSceneTransition() {
    const context = useContext(SceneTransitionContext)
    if (!context) throw new Error('useSceneTransition must be used inside SceneTransitionProvider')
    return context
}
