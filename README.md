
# useSlider Hook

A custom React hook for creating sliders with auto-scroll, looping, and progress tracking, ideal for carousels and image galleries.

## Features

- Auto-scroll with customizable speed
- Loop functionality to repeat slides
- Bullet and slide progress tracking
- Directional navigation (next/previous)
- Visibility detection to pause when the slider is out of view

## Installation

You can install this hook via NPM:

```bash
npm install @frost084/use-slider-hook
```

## Usage

Import the hook in your component and configure it with options as needed.

```javascript
import { useSlider } from '@frost084/use-slider-hook'

const MySliderComponent = () => {
  const {
    currentSlide,
    prevIndex,
    nextIndex,
    nextSlide,
    prevSlide,
    goToSlide,
    slideTimeProgress,
    totalProgress,
    loopProgress,
    bulletProgress,
    direction,
    sliderRef
  } = useSlider({
    autoScroll: true,       // Enable automatic slide transition
    loop: true,             // Loop back to the first slide
    speed: 3000,            // Transition duration in milliseconds
    totalSlides: 5          // Total number of slides
  })

  return (
    <div ref={sliderRef}>
      <button onClick={prevSlide}>Previous</button>
      <button onClick={nextSlide}>Next</button>
      <div>Current Slide: {currentSlide}</div>
      <div>Slide Time Progress: {slideTimeProgress}%</div>
      <div>Total Progress: {totalProgress}%</div>
      <div>Loop Progress: {loopProgress}%</div>
      <div>Bullet Progress: {bulletProgress}%</div>
      <div>Direction: {direction}</div>
    </div>
  )
}
```

## API

### Hook Options

| Option       | Type    | Default | Description                                           |
|--------------|---------|---------|-------------------------------------------------------|
| `autoScroll` | boolean | `false` | Enables automatic slide transition                    |
| `loop`       | boolean | `true`  | Enables looping of slides                             |
| `speed`      | number  | `3000`  | Time in ms for each slide transition                  |
| `totalSlides`| number  | `0`     | Total number of slides in the slider                  |

### Returned Values

| Value              | Type     | Description                                                     |
|--------------------|----------|-----------------------------------------------------------------|
| `currentSlide`     | number   | Index of the current slide                                      |
| `prevIndex`        | number   | Index of the previous slide                                     |
| `nextIndex`        | number   | Index of the next slide                                         |
| `nextSlide`        | function | Function to go to the next slide                                |
| `prevSlide`        | function | Function to go to the previous slide                            |
| `goToSlide`        | function | Function to go directly to a specified slide by index           |
| `slideTimeProgress`| number   | Progress of the current slide as a percentage (0 to 100)        |
| `totalProgress`    | number   | Progress of the entire slider as a percentage (0 to 100)        |
| `loopProgress`     | number   | Progress of the loop as a percentage, considering all slides in the loop |
| `bulletProgress`   | number   | Progress for bullets as a percentage based on the current slide |
| `direction`        | string   | Direction of the slide transition ("next" or "prev")            |
| `sliderRef`        | ref      | Reference to the slider container for visibility tracking       |

## License

This project is licensed under the MIT License.

---

Developed by **TheFrost - Creative Frontend Developer** with contributions from ChatGPT (OpenAI).
