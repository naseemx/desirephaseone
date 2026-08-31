# Hero Section Scroll Mechanics, Input Tracking & Ignore Architecture

> **Comprehensive Technical Deep-Dive:** How the MGS Realtor Hero section captures, interprets, virtualizes, throttles, and intentionally ignores user scroll and touch gestures across Desktop and Mobile devices.

---

## Table of Contents

1. [Executive Summary & Core Paradigm](#1-executive-summary--core-paradigm)
2. [State Machine & Time Accumulator Architecture](#2-state-machine--time-accumulator-architecture)
3. [The Input Virtualization Layer (GSAP Observer)](#3-the-input-virtualization-layer-gsap-observer)
4. [Desktop vs. Mobile: Input Inversion & Divergent Philosophies](#4-desktop-vs-mobile-input-inversion--divergent-philosophies)
5. [Complete Matrix: When Scroll Is Handled vs. When It Is Ignored](#5-complete-matrix-when-scroll-is-handled-vs-when-it-is-ignored)
6. [The 2-Second Pause Cooldown (Inertia & Momentum Filter)](#6-the-2-second-pause-cooldown-inertia--momentum-filter)
7. [Floating-Point Tolerances & Boundary Clamping (`- 0.1s`)](#7-floating-point-tolerances--boundary-clamping---01s)
8. [Navbar Visibility Synchronization & 50ms Settle Delay](#8-navbar-visibility-synchronization--50ms-settle-delay)
9. [Mobile Touch Re-Entry Engine & Rubber-Band Interception](#9-mobile-touch-re-entry-engine--rubber-band-interception)
10. [Mobile 100dvh Layout Shift Prevention (Pixel Height Pinning)](#10-mobile-100dvh-layout-shift-prevention-pixel-height-pinning)
11. [On-Screen Arrow Navigation & Idle Timer Synchronization](#11-on-screen-arrow-navigation--idle-timer-synchronization)
12. [Next.js Hydration & Triple-Check Asynchronous Scroll Restoration](#12-nextjs-hydration--triple-check-asynchronous-scroll-restoration)
13. [Event Propagation Isolation (`stopPropagation` on UI Overlays)](#13-event-propagation-isolation-stoppropagation-on-ui-overlays)
14. [Video Autoplay Promise Shielding (`playSafe`) & Video Crossfading](#14-video-autoplay-promise-shielding-playsafe--video-crossfading)
15. [Performance Throttling & Frame Rendering Loop](#15-performance-throttling--frame-rendering-loop)
16. [Component Unmount & Lifecycle Teardown Safeguards](#16-component-unmount--lifecycle-teardown-safeguards)
17. [Quick Reference & Troubleshooting Guide for Developers](#17-quick-reference--troubleshooting-guide-for-developers)

---

## 1. Executive Summary & Core Paradigm

Traditional web animations bind visual elements directly to the native window scroll offset:
$$\text{frameIndex} = \text{Math.floor}\left(\frac{\text{window.scrollY}}{\text{totalScrollableHeight}} \times \text{totalFrames}\right)$$

In contrast, the MGS Realtor Hero section implements **Virtual Input Decoupling**:

```
[User Input: Wheel / Touch / Pointer]
                  │
                  ▼
      [GSAP Observer Filter]
                  │
        (Intercept / Evaluate)
                  │
         ┌────────┴────────┐
         ▼                 ▼
   [IGNORED]          [ACCEPTED]
 (During Cooldown,         │
  Mid-Playback Mob,        ▼
  or Unlocked Body)   [State Machine Update]
                      (currentPhase / playState)
                                   │
                                   ▼
                       [GSAP Ticker Virtual Clock]
                       (virtualTime += deltaSec)
                                   │
                                   ▼
                       [Canvas 24fps Frame Paint]
```

### The 4 Core Architectural Principles:
1. **Scroll Does NOT Move the Viewport (Initially):** On initial page load, `document.body.style.overflow = "hidden"`. The user physically cannot scroll the web page down.
2. **Scroll Acts as a State Trigger:** Mouse wheel ticks and finger swipes do not drag an element by $N$ pixels; instead, they trigger phase transitions and set velocity states (`playState = 1` or `-1`).
3. **Time-Based Playback, Not Position-Based Scrubbing:** A single scroll flick initiates time progression on a 24fps virtual clock (`virtualTime`), scrubbing preloaded WebP frames smoothly over time via requestAnimationFrame.
4. **Selective Input Rejection (Ignoring):** To deliver a cinematic, non-disorienting experience, the engine deliberately drops, suppresses, or blocks scroll events depending on active animation states, trackpad inertia cooldowns, and device types.

---

## 2. State Machine & Time Accumulator Architecture

The entire hero interaction is dictated by internal engine variables operating inside the React `useGSAP` hook:

```typescript
// 1. Current narrative phase of the Hero
let currentPhase = 0; 
// 0 = Ambient cloud looping video
// 1 = Scrubbing frame sequence from Frame 0 up to Pause Checkpoint
// 2 = Scrubbing frame sequence from Pause Checkpoint to final frame

// 2. Playback velocity state
let playState = 0; 
// -1 = Playing in reverse (scrubbing backwards)
//  0 = Idle / Paused at a designated checkpoint
//  1 = Playing forward (scrubbing forwards)

// 3. Viewport lock flag
let scrollLocked = true; 
// true  = Window locked at Y=0, overflow: hidden, GSAP Observer active
// false = Native document scroll enabled, observer disabled

// 4. Decoupled virtual clock (seconds)
let virtualTime = 0.0; 

// 5. High-inertia debouncing ref
const pauseCooldownRef = useRef(false);
```

### Device Sequence Specifications

| Configuration Parameter | Desktop Sequence (`DESKTOP`) | Mobile Sequence (`MOBILE`) |
| :--- | :--- | :--- |
| **Total Frames** | 127 frames | 162 frames |
| **Frame Rate** | 24 fps | 24 fps |
| **Resolution** | 1920 × 1080 (16:9) | 900 × 1600 (9:16) |
| **Pause Keyframe** | Frame 74 (0-index: 73) | Frame 101 (0-index: 100) |
| **Pause Time (`pauseTime`)** | $\frac{73}{24} \approx 3.0416\text{s}$ | $\frac{100}{24} \approx 4.1667\text{s}$ |
| **Total Duration (`duration`)** | $\frac{127}{24} \approx 5.2916\text{s}$ | $\frac{162}{24} = 6.7500\text{s}$ |
| **Breakpoint Trigger** | `window.innerWidth >= 768` | `window.innerWidth < 768` |

---

## 3. The Input Virtualization Layer (GSAP Observer)

The component registers GSAP's `Observer` plugin to listen to low-level browser interaction events:

```typescript
const observer = Observer.create({
  target: window,
  type: "wheel,touch,pointer",
  preventDefault: !isMobileDevice,
  onDown: (self: any) => { /* ... */ },
  onUp: (self: any) => { /* ... */ },
});
```

### 1. Event Types Listened: `"wheel,touch,pointer"`
- **`wheel`**: Catches mouse scroll wheels, trackpad two-finger scrolls, and Magic Mouse gesture flicks.
- **`touch`**: Catches mobile and tablet capacitive touch swipes (`touchstart`, `touchmove`, `touchend`).
- **`pointer`**: Catches stylus or pointer events on touch-enabled laptops (e.g. Surface Pro, iPad with trackpad/pencil).

### 2. Multi-Touch & Pointer Identification
```typescript
const isTouchGesture = Boolean(
  self?.isTouch ||
  (self?.event && (self.event.type?.startsWith("touch") || self.event?.pointerType === "touch"))
);
```
This check ensures that Windows hybrid laptops or iPad browsers that emit pointer events with `pointerType === "touch"` are routed to the touch branch rather than desktop wheel logic.

### 3. The `preventDefault: !isMobileDevice` Rule
- **On Desktop (`!isMobileDevice = true`)**: `preventDefault: true` is passed to the Observer.
  - **Why:** This completely blocks the native browser engine from processing the wheel delta. It eliminates viewport jitter, eliminates macOS rubber-band bounce at page top, and guarantees the page cannot scroll naturally while `scrollLocked` is true.
- **On Mobile (`!isMobileDevice = false`)**: `preventDefault: false` is passed to the Observer.
  - **Why:** Calling `preventDefault()` unconditionally on mobile touch events breaks mobile browser gesture heuristics (pinch-to-zoom, system pull-down menus, and browser navigation). Instead, mobile input suppression is handled selectively by custom touch listeners with non-passive thresholds (see [Section 9](#9-mobile-touch-re-entry-engine--rubber-band-interception)).

---

## 4. Desktop vs. Mobile: Input Inversion & Divergent Philosophies

One of the most critical engineering details in this codebase is the **mathematical inversion of input direction** between desktop and touch devices.

```typescript
onDown: (self: any) => {
  const isTouchGesture = Boolean(
    self?.isTouch ||
    (self?.event && (self.event.type?.startsWith("touch") || self.event?.pointerType === "touch"))
  );
  if (isTouchGesture) {
    handleMobileScrollReverse(); // Swipe down = pull content down = move backward
  } else {
    handleScrollForward();       // Wheel down = move forward
  }
},
onUp: (self: any) => {
  const isTouchGesture = Boolean(
    self?.isTouch ||
    (self?.event && (self.event.type?.startsWith("touch") || self.event?.pointerType === "touch"))
  );
  if (isTouchGesture) {
    handleMobileScrollForward(); // Swipe up = push content up = move forward
  } else {
    handleScrollReverse();       // Wheel up = move backward
  }
}
```

### Why Does This Inversion Exist?

#### 1. Desktop Wheel Coordinate System:
- When a user scrolls their mouse wheel **downwards** (towards themselves) or pushes two fingers forward on a trackpad with natural scrolling, the browser generates a **positive $\Delta Y$**.
- In GSAP Observer, this positive delta triggers **`onDown`**.
- In web browsing, scrolling "down" means **advancing forward** in content.
- Therefore: `Desktop onDown` $\rightarrow$ `handleScrollForward()`.
- Conversely, scrolling the wheel **upwards** generates negative $\Delta Y$, triggering **`onUp`**.
- Therefore: `Desktop onUp` $\rightarrow$ `handleScrollReverse()`.

#### 2. Mobile Touch Coordinate System:
- When a mobile user wants to scroll "down" to see the next section, their physical gesture is to **swipe their finger UPWARDS** across the screen (dragging the page up).
- In GSAP touch coordinates, dragging a finger upwards generates a negative directional vector, triggering **`onUp`**.
- Therefore: `Touch onUp` $\rightarrow$ `handleMobileScrollForward()`.
- When a user wants to go back to previous content, they **drag their finger DOWNWARDS**.
- In GSAP touch coordinates, dragging downwards triggers **`onDown`**.
- Therefore: `Touch onDown` $\rightarrow$ `handleMobileScrollReverse()`.

---

## 5. Complete Matrix: When Scroll Is Handled vs. When It Is Ignored

The following master table documents every possible condition under which user scroll is either **Accepted and Processed** or **Suppressed and Ignored**.

| Condition / State | User Input Action | Desktop Behavior | Mobile Behavior | Reason for Ignoring / Handling |
| :--- | :--- | :--- | :--- | :--- |
| **`scrollLocked === false`**<br>(Page Unlocked) | Any scroll / swipe down | **IGNORED** by Hero.<br>Passed to native page. | **IGNORED** by Hero.<br>Passed to native page. | `if (!scrollLocked) return;`<br>Observer disabled. Native body scroll takes over to browse the website. |
| **`scrollLocked === false`**<br>and `window.scrollY > 0` | Any scroll / swipe up | **IGNORED** by Hero.<br>Handled by native page. | **IGNORED** by Hero.<br>Handled by native page. | Page is scrolling back towards top. Hero remains inactive until top edge is reached. |
| **`scrollLocked === false`**<br>and `window.scrollY <= 0` | Scroll / swipe up (towards top) | **HANDLED** via `onNativeScroll`<br>Re-locks scroll to Hero. | **HANDLED** via Touch Re-entry<br>Needs $\Delta Y > 20\text{px}$ drag. | Re-entry condition met. Locks body, stops native scroll, restores Phase 2 idle state. |
| **Phase 0 (Cloud Loop)**<br>`currentPhase = 0` | Scroll / swipe down | **HANDLED**<br>Transitions to Phase 1. | **HANDLED**<br>Transitions to Phase 1. | Starts frame animation. Hides navbar, hides hints, crossfades video to canvas. |
| **Phase 0 (Cloud Loop)**<br>`currentPhase = 0` | Scroll / swipe up | **IGNORED**<br>Nothing happens. | **IGNORED**<br>Nothing happens. | `if (currentPhase > 0)` check fails. User cannot reverse past the beginning. |
| **Phase 1 Playback**<br>`playState === 1`<br>($0 < t < \text{pauseTime}$) | Scroll / swipe down | **ACCEPTED**<br>Maintains forward state. | **IGNORED**<br>Discards input. | **Mobile Ignore:** `if (playState !== 0) return;`<br>Prevents gesture spamming during mobile animation. |
| **Phase 1 Playback**<br>`playState === 1`<br>($0 < t < \text{pauseTime}$) | Scroll / swipe up | **HANDLED**<br>Sets `playState = -1`.<br>Reverses immediately. | **IGNORED**<br>Discards input. | **Desktop:** Allows real-time direction reversal.<br>**Mobile:** Rejects mid-animation reversals to save GPU/battery. |
| **Pause Checkpoint Reached**<br>`pauseCooldownRef = true`<br>(First 2000ms) | Scroll / swipe down | **IGNORED**<br>Input discarded. | **IGNORED**<br>Input discarded. | **Cooldown Guard:** Blocks trackpad inertia and fast double-swipes so user sees cards. |
| **Pause Checkpoint Reached**<br>`pauseCooldownRef = true`<br>(First 2000ms) | Scroll / swipe up | **IGNORED**<br>Input discarded. | **IGNORED**<br>Input discarded. | Cooldown protects both directions during the initial 2 seconds of card display. |
| **Pause Checkpoint Idle**<br>`pauseCooldownRef = false`<br>(After 2000ms) | Scroll / swipe down | **HANDLED**<br>Transitions to Phase 2. | **HANDLED**<br>Transitions to Phase 2. | Cooldown expired. Cards fade out, sequence scrubs forward towards completion. |
| **Pause Checkpoint Idle**<br>`pauseCooldownRef = false`<br>(After 2000ms) | Scroll / swipe up | **HANDLED**<br>Sets `playState = -1`.<br>Scrubs back to Phase 0. | **HANDLED**<br>Sets `playState = -1`.<br>Scrubs back to Phase 0. | User actively chooses to retreat back to the beginning cloud loop. |
| **Phase 2 Playback**<br>`playState === 1`<br>($\text{pauseTime} < t < \text{end}$) | Scroll / swipe down | **ACCEPTED**<br>Maintains forward state. | **IGNORED**<br>Discards input. | Mobile rejects extra swipes while scrubbing to the end. |
| **Phase 2 Playback**<br>`playState === 1`<br>($\text{pauseTime} < t < \text{end}$) | Scroll / swipe up | **HANDLED**<br>Sets `playState = -1`.<br>Scrubs back to pause. | **IGNORED**<br>Discards input. | Desktop allows reversing back to checkpoint. Mobile waits for completion. |
| **Final Frame Reached**<br>`virtualTime >= duration - 0.1` | Scroll / swipe down | **HANDLED**<br>Triggers `unlockScroll()`. | **HANDLED**<br>Triggers `unlockScroll()`. | Sequence complete. Height pinned, body overflow set to auto, observer disabled. |

---

## 6. The 2-Second Pause Cooldown (Inertia & Momentum Filter)

One of the most elusive bugs in virtual scroll engineering is **Trackpad Momentum Spillover**:

```
[User gives a firm trackpad flick on MacBook]
                 │
                 ▼
  [~30-50 wheel events fired over 1.5 seconds]
                 │
                 ▼
  [Event 1-5: Triggers Phase 1 start]
  [Event 6-20: Animation scrubs to Pause Frame (takes ~3s)]
                 │
  WITHOUT COOLDOWN:
  [Event 21-30: Still firing from inertia when pause point is reached!]
  [Result: Instantly skips the Pause Checkpoint without user ever seeing the cards!]
```

### The Cooldown Implementation:

```typescript
// Inside tickerFunc when hitting pauseTime:
if (virtualTime >= pauseTime) {
  virtualTime = pauseTime;
  playState = 0; // go idle, stop rendering forward
  setShowPauseCards(true);
  setShowNavbar(true);

  // START 2-SECOND COOLDOWN
  pauseCooldownRef.current = true;
  setTimeout(() => {
    pauseCooldownRef.current = false;
  }, 2000);

  startPhase1IdleTimer();
}
```

### How Handlers Enforce the Cooldown:

```typescript
const handleScrollForward = () => {
  if (!scrollLocked) return;
  if (currentPhase === 1) {
    // HARD BLOCK: Ignore any scroll while in cooldown
    if (pauseCooldownRef.current) return;
    // ...
  }
};

const handleScrollReverse = () => {
  if (!scrollLocked) return;
  // HARD BLOCK: Ignore reverse scroll while in cooldown
  if (currentPhase === 1 && pauseCooldownRef.current) return;
  // ...
};
```

This guarantees that **all lingering trackpad inertia is completely absorbed and discarded** during the 2000ms window. The user is guaranteed 2 full seconds to observe the Featured Property Cards before any subsequent scroll can advance the narrative.

---

## 7. Floating-Point Tolerances & Boundary Clamping (`- 0.1s`)

In high-frame-rate rendering loops using delta accumulators (`virtualTime += deltaTime / 1000`), two subtle mathematical hazards occur:
1. **IEEE 754 precision mismatches:** `virtualTime` may land on `3.0416666666666665` instead of `3.041666666666666`.
2. **Boundary overflow at sequence end:** If `virtualTime == duration`, `Math.floor(virtualTime * fps)` can calculate an index equal to `frameCount` (out of bounds).

The codebase applies two critical clamping strategies:

### 1. The 100ms Tolerance Guard at Pause Checkpoints
```typescript
if (playState === 0 && virtualTime >= pauseTime - 0.1) {
  currentPhase = 2;
  playState = 1;
  setShowPauseCards(false);
  // ...
}
```
Using `virtualTime >= pauseTime - 0.1` ensures that if `virtualTime` stopped at `3.0415s` (just milliseconds under `pauseTime`), the user's forward scroll input will still reliably register and advance to Phase 2 rather than being rejected as "not at checkpoint".

### 2. The Final Frame Boundary Clamp (`duration - 0.1`)
```typescript
if (virtualTime >= duration - 0.1) {
  virtualTime = duration - 0.1;
  playState = 0;
  // ...
}
```
Clamping to `duration - 0.1` guarantees that:
- `frameIndex` always evaluates to `config.frameCount - 1` (the exact crisp final frame).
- The animation never overflows or paints a black frame.
- The canvas remains stable and active while final overlays appear.

---

## 8. Navbar Visibility Synchronization & 50ms Settle Delay

The [Navbar](file:///Users/nash/Documents/paid/realstate/src/components/ui/Navbar.tsx) dynamically shifts visibility and styling based on scroll phase:

| Phase / State | Navbar State | Rationale |
| :--- | :--- | :--- |
| **Initial Mount (Phase 0)** | `visible = true` (Glass transparent) | User sees brand logo and primary menu navigation immediately. |
| **Phase 1 Active Scrub** | `visible = false` (Fades out) | Hidden during frame animation for an uninhibited, full-bleed cinematic effect. |
| **Phase 1 Pause Checkpoint** | `visible = true` (Glass transparent) | Restored alongside Featured Property Cards so users can browse menu links. |
| **Phase 2 Active Scrub** | `visible = false` (Fades out) | Hidden again while scrubbing towards sequence completion. |
| **Final Frame Reached** | `visible = true` (Fades in) | **Displayed FIRST before scroll unlocks** to ensure zero layout shift. |
| **Rest of Website (`scrollY > 20`)** | `visible = true` (Solid background) | Standard sticky navigation behavior. |

### The 50ms Settle Delay Before Scroll Unlock:

```typescript
// Inside tickerFunc when reaching final frame:
setShowNavbar(true);
setShowProgress(false);
setShowFinalOverlay(true);

// Small delay before unlocking scroll to let Navbar settle
if (scrollLocked) {
  setTimeout(() => {
    unlockScroll();
  }, 50);
}
```

**Why 50ms?**
When the final frame is reached, React schedules state updates for the Navbar and Overlays. If `document.body.style.overflow = "auto"` were called synchronously in the exact same frame:
1. Browser renders the scrollbar track immediately.
2. The navbar renders in an intermediate transparency state before its solid class is applied.
3. This creates an unsightly visual flicker.
The 50ms delay gives the GPU one or two render cycles to paint the solid Navbar and final overlays before native window scrolling commences.

---

## 9. Mobile Touch Re-Entry Engine & Rubber-Band Interception

When the user scrolls past the Hero into the rest of the website, `document.body.style.overflow = "auto"` allows native window scrolling. 

However, getting back into the Hero on mobile devices poses a notorious mobile browser challenge: **iOS Safari Elastic Bouncing (Rubber-Banding)**.

### Why Standard Scroll Listeners Fail on Mobile:
On mobile Safari and Chrome Android, scrolling to the top of the page causes the viewport to bounce past `scrollY = 0` (negative scroll offset). Native `window.addEventListener("scroll")` events during rubber-banding fire asynchronously and erratically, leading to visual flickering or failure to detect when the user is trying to re-enter the Hero.

### The Specialized Touch Re-Entry Solution:

```typescript
// Touch re-entry for mobile: detect swipe-down (scroll up) at scrollY=0
let reentryTouchStartY = 0;

const onReentryTouchStart = (e: TouchEvent) => {
  reentryTouchStartY = e.touches[0].clientY;
};

const onReentryTouchMove = (e: TouchEvent) => {
  // Only check when the user is at the very top of the page
  if (window.scrollY <= 0) {
    const deltaY = e.touches[0].clientY - reentryTouchStartY;
    
    // THRESHOLD FILTER: Ignore micro-jitters, only accept deliberate pulls > 20px
    if (deltaY > 20) { // Finger dragged down -> user wants to scroll back up
      e.preventDefault(); // Stop native iOS rubber-band bounce
      removeReentryListeners();
      lockScroll();
      
      currentPhase = 2; // Re-enter Hero at the end of the animation
      playState = 0;    // Wait for subsequent tap or swipe
      setActiveArrows("none");
      startPhase1IdleTimer();
    }
  }
};
```

### 3 Key Engineering Highlights:
1. **Passive: false on touchmove:** The touchmove listener must be `{ passive: false }` so that `e.preventDefault()` can cancel the native elastic bounce before Safari initiates it.
2. **20px Noise Deadband:** Accidental finger tremors or small touch taps will not trigger re-entry. The user must intentionally swipe down more than 20 pixels.
3. **Smooth Scroll Normalization:** When re-locking, `window.scrollTo({ top: 0, behavior: "smooth" })` safely resets any fractional sub-pixel scroll offset without a jarring visual pop.

---

## 10. Mobile 100dvh Layout Shift Prevention (Pixel Height Pinning)

Modern mobile browsers dynamically hide and reveal the top URL address bar and bottom navigation toolbar as the user scrolls.

```
Address Bar Visible:   Viewport Height = 650px (100svh)
Address Bar Collapsed: Viewport Height = 730px (100lvh)
100dvh shifts dynamically between 650px and 730px!
```

### The Problem:
If `<section className="h-[100dvh]">` remains bound to `100dvh` after the document scroll is unlocked, the moment the user scrolls down and the browser address bar collapses, the hero section's height expands by ~80px. This causes the entire page content underneath ("Trusted By", "Neighborhoods") to **jump violently down the screen**.

### The Pixel-Pinning Fix:

```typescript
const unlockScroll = () => {
  scrollLocked = false;
  observer.disable();

  // STEP 1: Pin the hero container to its exact pixel height
  // BEFORE enabling native scroll
  const container = containerRef.current;
  if (container) {
    const currentHeight = container.getBoundingClientRect().height;
    container.style.height = `${currentHeight}px`; // e.g. "724px"
  }

  // STEP 2: Delay overflow change by one animation frame
  // to allow the pinned pixel style to commit to the layout tree
  requestAnimationFrame(() => {
    document.body.style.overflow = "auto";
    if (isMobileDevice) addReentryListeners();
  });
};
```

### The Release on Re-Entry:

```typescript
const lockScroll = () => {
  scrollLocked = true;
  document.body.style.overflow = "hidden";

  // Restore the container to dvh-based height when returning to hero
  const container = containerRef.current;
  if (container) {
    container.style.height = ""; // Reset style attribute back to CSS h-[100dvh]
  }
  // ...
};
```

---

## 11. On-Screen Arrow Navigation & Idle Timer Synchronization

Because mobile users may not immediately know they can swipe up/down, floating glassmorphic chevron buttons (`ChevronLeft` and `ChevronRight`) provide explicit tap targets:

```
[Mobile Screen Bottom Right]
┌─────────────┐
│ [ < ] [ > ] │ (Rendered at bottom: 96px, right: 20px)
└─────────────┘
```

### Button Visibility Rules (`activeArrows`):

| Hero Phase | Active Arrows State | Visible Buttons | Trigger Behavior |
| :--- | :--- | :--- | :--- |
| **Phase 0 (Initial Idle)** | `"none"` (First 3s)<br>`"forward"` (After 3s idle) | Right Chevron Only | Advances from cloud video to Phase 1 scrub |
| **Phase 1 Scrubbing** | `"none"` | None (hidden & unclickable) | Disabled during active frame animation |
| **Phase 1 Pause (Cards)** | `"none"` (During 2s cooldown)<br>`"both"` (After 2s idle) | Both Left and Right Chevrons | Left: Scrubs back to Phase 0<br>Right: Resumes scrub to Phase 2 |
| **Phase 2 Scrubbing** | `"none"` | None (hidden & unclickable) | Disabled during active frame animation |
| **Final Frame / Unlocked** | `"none"` | None (hidden & unclickable) | Hidden; user now uses native scroll |

### Tapping Forward at the End of Sequence:
In Phase 2 when playback has stopped, tapping the forward chevron explicitly unlocks scrolling:
```typescript
} else if (currentPhase === 2) {
  if (playState === 0) {
    unlockScroll();
    setActiveArrows("none");
  }
}
```

### Idle Timer State Machine:

```typescript
const startPhase0IdleTimer = () => {
  if (scrollHintTimerRef.current) clearTimeout(scrollHintTimerRef.current);
  scrollHintTimerRef.current = setTimeout(() => {
    setShowScrollHint(true); // "Scroll or tap" pill appears
    if (isMobileDeviceRef.current) setActiveArrows("forward");
  }, 3000);
};

const startPhase1IdleTimer = () => {
  if (continueHintTimerRef.current) clearTimeout(continueHintTimerRef.current);
  continueHintTimerRef.current = setTimeout(() => {
    setShowContinueHint(true); // "Continue scrolling" pill appears
    if (isMobileDeviceRef.current) setActiveArrows("both");
  }, 2000);
};
```

Any accepted user scroll or tap immediately calls `clearAllHints()`, hiding the pills and chevrons until another idle duration elapses.

---

## 12. Next.js Hydration & Triple-Check Asynchronous Scroll Restoration

### 1. Browser Back-Button & Page Refresh Handling (`checkScrollPosition`)
When a user visits a subpage (e.g. `/portfolio`) and presses the browser "Back" button, or reloads the page while halfway down the homepage, the browser restores `window.scrollY > 0`.

If the hero blindly locked the scroll on mount, the user would be trapped at a lower scroll position without access to the Hero or the rest of the site.

```typescript
const checkScrollPosition = () => {
  if (window.scrollY > 50) {
    scrollLocked = false;
    document.body.style.overflow = "auto";
    observer.disable();

    // Pin hero height immediately to prevent dvh jump
    const container = containerRef.current;
    if (container) {
      container.style.height = `${container.getBoundingClientRect().height}px`;
    }
    
    currentPhase = 2;
    virtualTime = duration - 0.1; // Jump directly to final frame
    playState = 0;
    
    setShowPauseCards(false);
    setShowFinalOverlay(true);
    setShowNavbar(true);
    setShowProgress(false);
    setScrollProgress(1);
    
    if (isMobileDevice) {
      setActiveArrows("none");
      addReentryListeners(); // Enable swipe-down re-entry
    }
    
    // Crossfade canvas to active state
    if (vid0 && canvas) {
      canvas.style.opacity = "1";
      vid0.style.opacity = "0";
    }
    renderFrame();
  }
};

// ── Cascaded verification to account for Next.js hydration & async browser restoration ──
checkScrollPosition();
const t1 = setTimeout(checkScrollPosition, 50);
const t2 = setTimeout(checkScrollPosition, 150);
```

### Why a 3-Tier Check (Immediate, 50ms, 150ms)?
In modern browsers with client-side hydration:
- At time 0ms (`useEffect` execution), `window.scrollY` often reports `0` because the browser's layout engine has not yet restored the previous scroll offset.
- Between 20ms and 120ms, the browser asynchronously pushes the restored scroll position.
- If only a single synchronous check existed, the hero would erroneously lock the page at $Y=0$. The 50ms and 150ms timers catch late restorations and immediately release native scroll.

### 2. Navbar Logo & "Home" Click Handler (`reset-hero-start`)
When the user clicks the "Home" link or brand logo in the navigation header from anywhere on the page, a custom event is dispatched:

```typescript
// Inside Navbar.tsx:
if ((href === "/" || href === "/#home") && currentPath === "/") {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.dispatchEvent(new CustomEvent("reset-hero-start"));
}
```

The Hero's event listener responds:
1. Scrolls smoothly to top: `window.scrollTo({ top: 0, behavior: "smooth" })`.
2. Locks scroll: `lockScroll()`.
3. Resets state machine: `currentPhase = 0`, `virtualTime = 0`, `playState = 1`.
4. Resets visual layers: Hides cards, hides final overlay, shows cloud video at `currentTime = 0`, fades canvas to `opacity: 0`.
5. Starts the Phase 0 idle timer.

---

## 13. Event Propagation Isolation (`stopPropagation` on UI Overlays)

The hero contains several interactive UI layers that sit visually on top of the `<canvas>`:
- [HeroCards.tsx](file:///Users/nash/Documents/paid/realstate/src/components/home/HeroCards.tsx) (Featured Property Cards during Phase 1 Pause)
- [ReviewMarquee.tsx](file:///Users/nash/Documents/paid/realstate/src/components/home/ReviewMarquee.tsx) (Interactive Client Reviews & Modal)
- [VideoShowcase.tsx](file:///Users/nash/Documents/paid/realstate/src/components/home/VideoShowcase.tsx) (YouTube Video Popup Modal)

### How Touch & Click Leaks Are Prevented:
1. **Container Pointer Events Inversion:** The overlay wrappers use `pointer-events-none`, while the individual card elements apply `pointer-events-auto`.
2. **Explicit Event Stop Propagation:** Interactive buttons and links call `e.stopPropagation()`:
   ```typescript
   <button
     onClick={(e) => {
       e.stopPropagation();
       handleRedirect(prop.link, prop.isExternal);
     }}
   >
   ```
   This stops the click or touch event from bubbling up to `window`, preventing GSAP Observer or the mobile touch re-entry engine from interpreting an intentional button tap as a scroll drag!

---

## 14. Video Autoplay Promise Shielding (`playSafe`) & Video Crossfading

### The `playSafe` Helper:
Modern browsers reject `HTMLMediaElement.play()` with an `AbortError` if `play()` is interrupted by a pause or when running in background tabs.

```typescript
const playSafe = (vid: HTMLVideoElement) => {
  if (vid.paused) {
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Silently handle DOMException AbortError
      });
    }
  }
};
```
Whenever the animation returns to Phase 0 (cloud loop), `playSafe(vid0)` guarantees smooth video resumption without throwing unhandled promise rejections in the browser console.

### Bidirectional Video $\leftrightarrow$ Canvas Crossfading:
- **Forward transition (`transitionToMain`)**:
  Canvas immediately set to `opacity: 1`, `zIndex: 10`. Video remains at `zIndex: 20` and smoothly animates its opacity to `0` over 0.5s via GSAP.
- **Reverse transition (`transitionToCloud`)**:
  Video immediately set to `opacity: 1`, `zIndex: 10`. Canvas remains at `zIndex: 20` and smoothly animates its opacity to `0` over 0.5s.

This z-index staging guarantees that during the 0.5s fade, the user never sees an empty background or black flash.

---

## 15. Performance Throttling & Frame Rendering Loop

The rendering pipeline is driven by `gsap.ticker`, synchronized with the screen refresh rate (60Hz / 120Hz ProMotion):

```typescript
const tickerFunc = (time: number, deltaTime: number) => {
  if (!vid0 || !canvas) return;
  const deltaSec = deltaTime / 1000;

  if (playState === 1) {
    if (currentPhase === 1) {
      virtualTime += deltaSec;
      if (virtualTime >= pauseTime) {
        virtualTime = pauseTime;
        playState = 0; // Stop advancing
        // ... trigger cooldown & show cards
      }
      renderFrame();
    } else if (currentPhase === 2) {
      virtualTime += deltaSec;
      if (virtualTime >= duration - 0.1) {
        virtualTime = duration - 0.1;
        playState = 0; // Stop advancing
        // ... trigger unlockScroll
      }
      renderFrame();
    }
  } else if (playState === -1) {
    // Reverse logic decrementing virtualTime
    // ...
  }
};
```

### Frame Index Calculation:
$$\text{frameIndex} = \min\left(\text{frameCount} - 1, \max\left(0, \lfloor\text{virtualTime} \times \text{fps}\rfloor\right)\right)$$

The canvas context directly paints the preloaded image object:
```typescript
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
```

### Throttled Progress Bar Updates:
React state updates inside a 60fps ticker can cause CPU bottlenecks. Progress updates are throttled using a modulo tick counter:

```typescript
const updateProgress = () => {
  progressTickRef.current++;
  // Only re-render React state every 3rd frame (~20fps update rate)
  if (progressTickRef.current % 3 === 0 && currentPhase > 0) {
    setScrollProgress(virtualTime / duration);
  }
};
```

---

## 16. Component Unmount & Lifecycle Teardown Safeguards

If a user clicks an external link or navigates away via Next.js router while in the middle of Phase 1 or Phase 2, `document.body.style.overflow = "hidden"` could accidentally persist, permanently breaking scrolling on the subsequent page.

The cleanup callback in `useGSAP` rigorously resets all global mutations:

```typescript
return () => {
  gsap.ticker.remove(tickerWithProgress);
  observer.kill();
  removeReentryListeners();
  window.removeEventListener("scroll", onNativeScroll);
  window.removeEventListener("reset-hero-start", onResetHeroStart);
  clearAllHints();
  clearTimeout(t1);
  clearTimeout(t2);

  // CRITICAL: Guarantee document scroll is restored
  document.body.style.overflow = "auto";
  
  // Clear any pinned inline height on container
  if (containerRef.current) {
    containerRef.current.style.height = "";
  }
  triggerForwardRef.current = null;
  triggerBackwardRef.current = null;
};
```

---

## 17. Quick Reference & Troubleshooting Guide for Developers

### How to Modify Key Parameters:

| Task | File Location | Code Modification |
| :--- | :--- | :--- |
| **Change Desktop Pause Checkpoint** | `Hero.tsx`, line 21 | Modify `pauseTime: X / 24` where $X$ is the 0-indexed frame number. |
| **Change Mobile Pause Checkpoint** | `Hero.tsx`, line 33 | Modify `pauseTime: X / 24` where $X$ is the 0-indexed frame number. |
| **Shorten or Lengthen Cooldown** | `Hero.tsx`, lines 293, 351 | Change the `2000` ms duration in `setTimeout(..., 2000)`. |
| **Adjust Mobile Re-entry Sensitivity** | `Hero.tsx`, line 203 | Change `deltaY > 20` to a smaller (more sensitive) or larger (less sensitive) pixel value. |
| **Change Idle Hint Timers** | `Hero.tsx`, lines 136, 144 | Adjust `3000` (Phase 0) or `2000` (Phase 1) millisecond timers. |
| **Change Mobile Breakpoint** | `Hero.tsx`, line 39 | Modify `const MOBILE_BREAKPOINT = 768;`. |

### Debugging Checklist:
- **Hero skips past cards on trackpad:** Check if `pauseCooldownRef.current` is being bypassed or if `setTimeout` was cleared prematurely.
- **Mobile jumps when scroll unlocks:** Ensure `container.style.height = ${currentHeight}px` executes before `overflow = "auto"`.
- **Cannot scroll back up into hero on iOS:** Verify `onReentryTouchMove` has `{ passive: false }` on the event listener.
- **Canvas is blank during scrub:** Check browser console for 404 errors on image sequence paths (`/frames/` or `/frames_mob/`). Ensure `img.complete && img.naturalWidth !== 0` passes in `renderFrame()`.
- **Page locked on back navigation:** Ensure `checkScrollPosition` timers (0ms, 50ms, 150ms) are executing and `scrollY > 50` threshold is reached.
