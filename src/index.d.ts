// index.d.ts
import { RefObject } from 'react';

/**
 * Options for configuring the useSlider hook.
 */
export interface UseSliderOptions {
  /**
   * Enables automatic scrolling of the slider.
   * @default false
   */
  autoScroll?: boolean;

  /**
   * Determines if the slider should loop back to the first slide after reaching the last slide.
   * @default true
   */
  loop?: boolean;

  /**
   * Time in milliseconds for each slide transition during auto-scroll.
   * @default 3000
   */
  speed?: number;

  /**
   * Total number of slides in the slider.
   * This is required to calculate progress and looping.
   */
  totalSlides: number;
}

/**
 * Return values and functions from the useSlider hook.
 */
export interface UseSliderReturn {
  /**
   * The current slide index.
   */
  currentSlide: number;

  /**
   * The index of the previous slide.
   */
  prevIndex: number;

  /**
   * The index of the next slide.
   */
  nextIndex: number;

  /**
   * Function to go to the next slide.
   */
  nextSlide: () => void;

  /**
   * Function to go to the previous slide.
   */
  prevSlide: () => void;

  /**
   * Function to go to a specific slide by index.
   * @param index The index of the slide to navigate to.
   */
  goToSlide: (index: number) => void;

  /**
   * Progress of the current slide's time, ranging from 0 to 100.
   * Only updates when autoScroll is enabled.
   */
  slideTimeProgress: number;

  /**
   * Total progress of the slider based on the number of slides,
   * ranging from 0 to 100.
   */
  totalProgress: number;

  /**
   * Progress across the entire loop of slides (0 to 100),
   * resetting after reaching the last slide.
   */
  loopProgress: number;

  /**
   * Bullet progress, indicating the position within the slider in terms of bullets (0 to 100).
   */
  bulletProgress: number;

  /**
   * Current direction of slide transition, either 'next' or 'prev'.
   */
  direction: 'next' | 'prev';

  /**
   * Ref to the slider container for visibility tracking and other DOM-related operations.
   */
  sliderRef: RefObject<HTMLDivElement>;
}

/**
 * A custom React hook for managing a slider with auto-scroll, looping, progress tracking,
 * and directional navigation.
 * 
 * @param options Configuration options for the slider.
 * @returns An object with the current state and functions for controlling the slider.
 */
declare function useSlider(options: UseSliderOptions): UseSliderReturn;

export default useSlider;