// index.d.ts
import { RefObject } from 'react';

/**
 * Configuration options for the useSlider hook
 */
export interface UseSliderConfig {
  /** Enable automatic slide transition */
  autoScroll?: boolean;
  /** Loop back to the first slide when reaching the last */
  loop?: boolean;
  /** Transition duration in milliseconds */
  speed?: number;
  /** Total number of slides */
  totalSlides: number;
}

/**
 * The return type for the useSlider hook, describing the states and functions available
 */
export interface UseSliderReturn {
  /** Current slide index */
  currentSlide: number;
  /** Previous slide index */
  prevIndex: number;
  /** Next slide index */
  nextIndex: number;
  /** Go to the next slide */
  nextSlide: () => void;
  /** Go to the previous slide */
  prevSlide: () => void;
  /** Go to a specific slide by index */
  goToSlide: (index: number) => void;
  /** Progress of the current slide time (0 to 100%) */
  slideTimeProgress: number;
  /** Total progress across all slides (0 to 100%) */
  totalProgress: number;
  /** Overall loop progress (0 to 100%) */
  loopProgress: number;
  /** Bullet progress for indicating slide position (0 to 100%) */
  bulletProgress: number;
  /** Current transition direction ('next' or 'prev') */
  direction: 'next' | 'prev';
  /** Ref for the slider container to observe visibility */
  sliderRef: RefObject<HTMLDivElement>;
}

/**
 * Custom hook for managing a slider with various states and functionalities
 * 
 * @param config - Configuration options for the slider
 * @returns An object containing the slider's state and control functions
 */
export function useSlider(config: UseSliderConfig): UseSliderReturn;