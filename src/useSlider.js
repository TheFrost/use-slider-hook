import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for creating a slider with auto-scroll, loop functionality, progress tracking, and more.
 * 
 * @param {Object} options - The configuration options for the slider.
 * @param {boolean} [options.autoScroll=false] - Enables automatic slide progression.
 * @param {boolean} [options.loop=true] - Enables looping; when false, stops at the last slide.
 * @param {number} [options.speed=3000] - Duration in milliseconds for each slide when autoScroll is enabled.
 * @param {number} options.totalSlides - The total number of slides in the slider.
 * 
 * @returns {Object} - The state and functions to control the slider.
 * @property {number} currentSlide - The index of the current slide.
 * @property {number} prevIndex - The index of the previous slide.
 * @property {number} nextIndex - The index of the next slide.
 * @property {Function} nextSlide - Advances to the next slide.
 * @property {Function} prevSlide - Moves to the previous slide.
 * @property {Function} goToSlide - Moves directly to a specified slide by index.
 * @property {number} slideTimeProgress - The progress of the current slide as a percentage (0-100).
 * @property {number} totalProgress - The progress of the entire slider as a percentage (0-100).
 * @property {number} loopProgress - The progress of the loop as a percentage, considering all slides in the loop.
 * @property {number} bulletProgress - The progress for bullets as a percentage (0-100) based on the current slide position.
 * @property {string} direction - The direction of slide transition ("next" or "prev").
 * @property {React.MutableRefObject} sliderRef - A ref for the slider container to detect visibility.
 * 
 * @author TheFrost - Creative Frontend Developer
 * @contributors ChatGPT (OpenAI)
 */
export const useSlider = ({
  autoScroll = false,
  loop = true,
  speed = 3000,
  totalSlides = 0
}) => {
  const [indexState, setIndexState] = useState({
    currentSlide: 0,
    prevIndex: totalSlides - 1,
    nextIndex: 1
  })
  const currentSlideRef = useRef(0)
  const [slideTimeProgress, setSlideTimeProgress] = useState(0)
  const [totalProgress, setTotalProgress] = useState(0)
  const [loopProgress, setLoopProgress] = useState(0)
  const [bulletProgress, setBulletProgress] = useState(0)
  const [direction, setDirection] = useState('next')
  const [isVisible, setIsVisible] = useState(false)
  const sliderRef = useRef(null)
  const slideProgressIntervalRef = useRef(null)
  const loopProgressIntervalRef = useRef(null)
  const isAnimating = useRef(false)
  const isInitialized = useRef(false)

  const calculateBulletProgress = (totalSlides, activeIndex) => {
    if (activeIndex < 0) activeIndex = 0
    if (activeIndex >= totalSlides) activeIndex = totalSlides - 1
    return (activeIndex / (totalSlides - 1)) * 100
  }

  const updateIndexes = useCallback((newCurrentSlide, prevSlide = null) => {
    const prevIndex = prevSlide !== null ? prevSlide : (newCurrentSlide === 0 ? (loop ? totalSlides - 1 : 0) : newCurrentSlide - 1)
    const nextIndex = newCurrentSlide === totalSlides - 1 ? (loop ? 0 : totalSlides - 1) : newCurrentSlide + 1
    setIndexState({ currentSlide: newCurrentSlide, prevIndex, nextIndex })
    currentSlideRef.current = newCurrentSlide
  }, [loop, totalSlides])

  const nextSlide = useCallback(() => {
    if (isAnimating.current || !isInitialized.current) return

    isAnimating.current = true
    setDirection('next')

    const newSlide = loop
      ? (currentSlideRef.current + 1) % totalSlides
      : Math.min(currentSlideRef.current + 1, totalSlides - 1)

    if (!loop && newSlide === currentSlideRef.current) {
      clearInterval(slideProgressIntervalRef.current)
      setSlideTimeProgress(100)
      isAnimating.current = false
      return
    }

    updateIndexes(newSlide, currentSlideRef.current)
    startSlideProgress()
    isAnimating.current = false
  }, [loop, totalSlides, updateIndexes])

  const prevSlide = useCallback(() => {
    setDirection('prev')

    const newSlide = loop
      ? (currentSlideRef.current - 1 + totalSlides) % totalSlides
      : Math.max(currentSlideRef.current - 1, 0)
    updateIndexes(newSlide, currentSlideRef.current)
    startSlideProgress()
  }, [loop, totalSlides, updateIndexes])

  const startSlideProgress = useCallback(() => {
    if (!autoScroll || speed <= 0) return

    clearInterval(slideProgressIntervalRef.current)
    let progressTime = 0
    const interval = 100

    slideProgressIntervalRef.current = setInterval(() => {
      progressTime += interval
      const slideProgress = (progressTime / speed) * 100
      setSlideTimeProgress(slideProgress)

      if (slideProgress >= 100) {
        clearInterval(slideProgressIntervalRef.current)
        setSlideTimeProgress(0)

        if (loop || currentSlideRef.current < totalSlides - 1) {
          nextSlide()
        }
      }
    }, interval)
  }, [nextSlide, speed, autoScroll, loop, totalSlides])

  const handleLoopProgress = useCallback((initialProgress = 0) => {
    clearInterval(loopProgressIntervalRef.current)
    let loopTime = initialProgress
    const loopDuration = speed * totalSlides
    const interval = 100

    loopProgressIntervalRef.current = setInterval(() => {
      loopTime += interval
      const progress = (loopTime / loopDuration) * 100
      setLoopProgress(progress)

      if (progress >= 100) {
        loopTime = 0
      }
    }, interval)
  }, [speed, totalSlides])

  const goToSlide = useCallback(
    (index) => {
      if (index === currentSlideRef.current) return

      clearInterval(slideProgressIntervalRef.current)
      clearInterval(loopProgressIntervalRef.current)

      const newSlide = loop ? index % totalSlides : Math.min(Math.max(index, 0), totalSlides - 1)
      setDirection(newSlide > currentSlideRef.current ? 'next' : 'prev')

      updateIndexes(newSlide, currentSlideRef.current)

      if (autoScroll && speed > 0) {
        const initialProgress = newSlide * speed
        handleLoopProgress(initialProgress)
        startSlideProgress()
      }
    },
    [loop, totalSlides, speed, startSlideProgress, handleLoopProgress, autoScroll, updateIndexes]
  )

  /**
   * useEffect to observe visibility of the slider container.
   * Sets `isVisible` based on whether the slider is in the viewport.
   * This controls whether auto-scroll and progress tracking should be active.
   */
  useEffect(() => {
    if (!autoScroll) return

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (sliderRef.current) observer.observe(sliderRef.current)

    return () => observer.disconnect()
  }, [autoScroll])

  /**
   * useEffect to manage slider state when visibility changes.
   * Clears intervals and resets progress if the slider is not visible.
   * Restarts the slide progress when the slider becomes visible.
   */
  useEffect(() => {
    if (!isVisible) {
      clearInterval(slideProgressIntervalRef.current)
      clearInterval(loopProgressIntervalRef.current)
      setSlideTimeProgress(0)
    } else {
      goToSlide(currentSlideRef.current)
    }
  }, [isVisible, goToSlide])

  /**
   * useEffect to start auto-scroll and progress tracking when conditions are met.
   * Initializes slideTimeProgress and loopProgress when `autoScroll` and `isVisible` are true.
   * Ensures the progress intervals are cleared when conditions are not met or on unmount.
   */
  useEffect(() => {
    if (isInitialized.current) {
      if (autoScroll && isVisible && speed > 0) {
        startSlideProgress()
        handleLoopProgress()
      } else {
        setSlideTimeProgress(0)
        clearInterval(slideProgressIntervalRef.current)
        clearInterval(loopProgressIntervalRef.current)
      }
    } else {
      isInitialized.current = true
    }

    return () => {
      clearInterval(slideProgressIntervalRef.current)
      clearInterval(loopProgressIntervalRef.current)
    }
  }, [autoScroll, startSlideProgress, handleLoopProgress, speed, isVisible])

  /**
   * useEffect to calculate `totalProgress` and `bulletProgress` based on the current slide.
   * This runs every time the `currentSlide` changes, updating the respective progress states.
   */
  useEffect(() => {
    const totalProg = ((indexState.currentSlide + 1) / totalSlides) * 100
    setTotalProgress(totalProg)
    setBulletProgress(calculateBulletProgress(totalSlides, indexState.currentSlide))
  }, [indexState.currentSlide, totalSlides])

  return {
    currentSlide: indexState.currentSlide,
    prevIndex: indexState.prevIndex,
    nextIndex: indexState.nextIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    slideTimeProgress,
    totalProgress,
    loopProgress,
    bulletProgress,
    direction,
    sliderRef
  }
}