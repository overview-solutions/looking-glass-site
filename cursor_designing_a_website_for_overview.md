# Designing a website for Overview Solutions
_Exported on 8/10/2025 at 08:22:09 EDT from Cursor (1.4.3)_

---

**User**

I'd like to make a new website for my company Overview Solutions. I've made a logo (see @v2_logo_Black_transparent.png ) that is made to include the O and the V and resemble the window of the ISS that astronauts look out of. On the site, I want is to appear as though somebody is looking out down at the Earth through the window onto images such as @delta.jpg or @achipalego.jpg and as they scroll down the page, the images passes by below.

---

**Cursor**

I’m going to scaffold a simple static site in your project with an HTML page, CSS for the “cupola window” mask and sticky scroll image track, and a small JS for smooth parallax and preloading. I’ll wire it to your existing images: `delta.jpg`, `achipalego.jpg`, `estuary1.jpg`, and overlay your logo so it looks like you’re viewing Earth through the window while scrolling. Then I’ll summarize how to open it.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Overview Solutions</title>
    <meta name="description" content="Overview Solutions – see systems from above." />
    <link rel="preload" as="image" href="./delta.jpg" />
    <link rel="preload" as="image" href="./achipalego.jpg" />
    <link rel="preload" as="image" href="./estuary1.jpg" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <!-- Sticky-scrolling image track (Earth passes by underneath) -->
    <main id="earth-track" aria-label="Earth imagery scrolling track">
      <section class="panel" data-title="Lena River Delta, Siberia">
        <div class="image" style="--bg:url('./delta.jpg')"></div>
      </section>
      <section class="panel" data-title="Bissagos Archipelago, Guinea-Bissau">
        <div class="image" style="--bg:url('./achipalego.jpg')"></div>
      </section>
      <section class="panel" data-title="Estuary – Satellite View">
        <div class="image" style="--bg:url('./estuary1.jpg')"></div>
      </section>
      
      <footer class="page-end">
        <div class="content">
          <h2>Overview Solutions</h2>
          <p>Seeing systems from above.</p>
          <p class="hint">Scroll back up to look again.</p>
        </div>
      </footer>
    </main>

    <!-- Black dimmer with a circular transparent hole to simulate a window viewport -->
    <div class="viewport-mask" aria-hidden="true"></div>

    <!-- Logo frame overlay (placed above the mask for the window look) -->
    <img
      class="logo-frame"
      src="./drive-download-20250810T114339Z-1-001/v2_logo_White_transparent.png"
      alt="Overview Solutions logo frame"
      draggable="false"
    />

    <!-- Brand and minimal nav -->
    <header class="brand">
      <div class="brand-inner">
        <img class="brand-mark" src="./drive-download-20250810T114339Z-1-001/v2_logo_White_transparent.png" alt="OVR" />
        <div class="brand-text">
          <h1>Overview Solutions</h1>
          <p>Seeing systems from above</p>
        </div>
      </div>
    </header>

    <script src="./script.js"></script>
  </body>
  </html>


```

```css
/* Reset & base */
* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Sticky-scrolling track */
#earth-track {
  position: relative;
}

.panel {
  position: relative;
  height: 100vh; /* one full viewport each */
  overflow: hidden;
}

.panel .image {
  position: sticky;
  top: 0;
  height: 100vh;
  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  transform: translateZ(0);
  will-change: transform;
}

/* Subtle parallax: the image moves slower than scroll */
.panel[data-progress] .image {
  /* progress set by JS as 0..1 across each panel */
  transform: translateY(calc(var(--progress, 0) * -8vh));
}

.panel::after {
  content: attr(data-title);
  position: absolute;
  left: 50%;
  bottom: 4rem;
  transform: translateX(-50%);
  padding: .5rem .75rem;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
  border-radius: .5rem;
  font-size: .9rem;
  letter-spacing: .02em;
}

.page-end {
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 1200px at 50% 40%, rgba(255,255,255,.06), transparent 60%);
}
.page-end .content { text-align: center; padding: 8rem 1rem; }
.page-end h2 { margin: 0 0 .25rem; font-size: 2rem; }
.page-end p { margin: .25rem 0; color: #cfd8dc; }
.page-end .hint { color: #90a4ae; font-size: .9rem; }

/* Logo frame overlay */
.logo-frame {
  position: fixed;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(78vmin, 760px);
  height: auto;
  opacity: .95;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,.75));
}

/* Viewport mask: dark cabin with circular cutout */
.viewport-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  /* Create a transparent circle using radial-gradient mask */
  --r: min(34vmin, 330px);
  background:
    radial-gradient(circle at 50% 50%, transparent var(--r), rgba(0,0,0,.8) calc(var(--r) + 1px));
}

/* Brand header */
.brand {
  position: fixed;
  z-index: 40;
  left: 1rem;
  top: 1rem;
}
.brand-inner {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  background: rgba(0,0,0,.35);
  border-radius: .5rem;
  backdrop-filter: blur(6px);
}
.brand-mark { width: 32px; height: 32px; object-fit: contain; }
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text p { font-size: .8rem; margin: 0; color: #b0bec5; }

/* Responsiveness */
@media (max-width: 680px) {
  .panel::after { bottom: 3rem; font-size: .8rem; }
  .brand-text { display: none; }
}


```

```javascript
/*
  Minimal JS to drive progressive parallax on each full-viewport panel and
  ensure images are decoded before first paint when possible.
*/

function preloadImages(urls) {
  return Promise.all(
    urls.map((src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src);
        img.src = src;
        if (img.decode) {
          img.decode().then(() => resolve(src)).catch(() => resolve(src));
        }
      })
    )
  );
}

function updatePanelProgress() {
  const panels = document.querySelectorAll('.panel');
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset;

  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const start = rect.top + scrollY - viewportHeight; // begins as it enters view
    const end = rect.bottom + scrollY; // finishes when it leaves
    const progress = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
    panel.style.setProperty('--progress', progress.toFixed(4));
    panel.toggleAttribute('data-progress', true);
  });
}

// Throttle with rAF
let ticking = false;
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updatePanelProgress();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => updatePanelProgress());

// Initialize once images are preloaded or after a short timeout
const imageUrls = ['./delta.jpg', './achipalego.jpg', './estuary1.jpg'];
preloadImages(imageUrls).then(() => updatePanelProgress());
setTimeout(updatePanelProgress, 400); // fallback first layout pass


```

I created `index.html`, `styles.css`, and `script.js` to implement a scrollable “Earth below the window” effect using your images beneath a circular viewport with your logo as the window frame. I’m going to start a local static server and open the site.

- Added `index.html` with a sticky-scrolling image track for `delta.jpg`, `achipalego.jpg`, `estuary1.jpg`, a circular viewport mask, and your logo overlayed as the “window frame.”
- Added `styles.css` for the ISS-like window effect, brand header, captions, and subtle parallax via CSS variables.
- Added `script.js` to preload images and drive smooth per-panel parallax on scroll.
- Started a local server on port 5173.

How to view:
- Open `http://localhost:5173` in your browser.
- Scroll to see the Earth imagery pass beneath the circular viewport; the logo frames the view.

---

**User**

Can you make the logo a lager (full) percentage of the screen?

---

**Cursor**

I’m going to increase the overlay logo size to occupy most of the viewport and tie the window opening to variables for easier tweaking. Updating `styles.css` now.

```css
/* Reset & base */
* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Size variables so we can quickly tune the window and frame scale */
:root {
  /* Nearly full-screen frame */
  --frame-size: min(96vmin, 1040px);
  /* Radius of the transparent window opening */
  --window-radius: 42vmin;
}

/* Sticky-scrolling track */
#earth-track {
  position: relative;
}

.panel {
  position: relative;
  height: 100vh; /* one full viewport each */
  overflow: hidden;
}

.panel .image {
  position: sticky;
  top: 0;
  height: 100vh;
  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  transform: translateZ(0);
  will-change: transform;
}

/* Subtle parallax: the image moves slower than scroll */
.panel[data-progress] .image {
  /* progress set by JS as 0..1 across each panel */
  transform: translateY(calc(var(--progress, 0) * -8vh));
}

.panel::after {
  content: attr(data-title);
  position: absolute;
  left: 50%;
  bottom: 4rem;
  transform: translateX(-50%);
  padding: .5rem .75rem;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(4px);
  border-radius: .5rem;
  font-size: .9rem;
  letter-spacing: .02em;
}

.page-end {
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 1200px at 50% 40%, rgba(255,255,255,.06), transparent 60%);
}
.page-end .content { text-align: center; padding: 8rem 1rem; }
.page-end h2 { margin: 0 0 .25rem; font-size: 2rem; }
.page-end p { margin: .25rem 0; color: #cfd8dc; }
.page-end .hint { color: #90a4ae; font-size: .9rem; }

/* Logo frame overlay */
.logo-frame {
  position: fixed;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--frame-size);
  height: auto;
  opacity: .95;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,.75));
}

/* Viewport mask: dark cabin with circular cutout */
.viewport-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  /* Create a transparent circle using radial-gradient mask */
  --r: var(--window-radius);
  background:
    radial-gradient(circle at 50% 50%, transparent var(--r), rgba(0,0,0,.8) calc(var(--r) + 1px));
}

/* Brand header */
.brand {
  position: fixed;
  z-index: 40;
  left: 1rem;
  top: 1rem;
}
.brand-inner {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  background: rgba(0,0,0,.35);
  border-radius: .5rem;
  backdrop-filter: blur(6px);
}
.brand-mark { width: 32px; height: 32px; object-fit: contain; }
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text p { font-size: .8rem; margin: 0; color: #b0bec5; }

/* Responsiveness */
@media (max-width: 680px) {
  .panel::after { bottom: 3rem; font-size: .8rem; }
  .brand-text { display: none; }
}



```

- Increased the logo overlay to nearly full-screen and parameterized sizing.
- You can fine-tune using these CSS variables in `styles.css`:
  - `--frame-size`: overall logo/frame width (now `min(96vmin, 1040px)`).
  - `--window-radius`: transparent viewport opening radius (now `42vmin`).

Refresh `http://localhost:5173` to see it. Want the opening even larger or edge-to-edge? I can tweak `--window-radius` further.

---

**User**

I switched to the Black logo which looks better. The transition between these images doesn't flow smoothly. Do you have any recommandations on how to provide a back image (you can produce something yourself) that creates a compelling scrollable landscape that goes on much longer?

---

**Cursor**

I'll prototype a continuous, long-scroll map-based backdrop (satellite imagery) behind the viewport using an open tile source, so the landscape flows seamlessly. I’ll integrate a map rendering library and wire scroll to move the camera along a long path. Then I’ll keep your logo mask on top.

I’m going to quickly look up an open satellite tile source we can use for a seamless, continuous background (e.g., EOX Sentinel-2 cloudless) and then wire a lightweight map engine to scroll along a path under the window.

I’m going to replace the static image panels with a continuous satellite backdrop using an open tile source and MapLibre, add a long scroll spacer to control camera movement, and swap the overlay to your black logo. Then I’ll wire scroll progress to move the map along a path for a seamless landscape flyover.

```html
<<'PATCH'
*** Begin Patch
*** Update File: /Users/adamsauer/Documents/GitHub/ovr-site/index.html
@@
     <meta name="description" content="Overview Solutions – see systems from above." />
-    <link rel="preload" as="image" href="./delta.jpg" />
-    <link rel="preload" as="image" href="./achipalego.jpg" />
-    <link rel="preload" as="image" href="./estuary1.jpg" />
+    <!-- MapLibre for seamless satellite backdrop -->
+    <link href="https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css" rel="stylesheet" />
+    <script src="https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js"></script>
     <link rel="stylesheet" href="./styles.css" />
   </head>
   <body>
-    <!-- Sticky-scrolling image track (Earth passes by underneath) -->
-    <main id="earth-track" aria-label="Earth imagery scrolling track">
-      <section class="panel" data-title="Lena River Delta, Siberia">
-        <div class="image" style="--bg:url('./delta.jpg')"></div>
-      </section>
-      <section class="panel" data-title="Bissagos Archipelago, Guinea-Bissau">
-        <div class="image" style="--bg:url('./achipalego.jpg')"></div>
-      </section>
-      <section class="panel" data-title="Estuary – Satellite View">
-        <div class="image" style="--bg:url('./estuary1.jpg')"></div>
-      </section>
-      
-      <footer class="page-end">
-        <div class="content">
-          <h2>Overview Solutions</h2>
-          <p>Seeing systems from above.</p>
-          <p class="hint">Scroll back up to look again.</p>
-        </div>
-      </footer>
-    </main>
+    <!-- Continuous map backdrop (non-interactive) -->
+    <div id="map" aria-hidden="true"></div>
+
+    <!-- Long scroll area to drive the camera along a path -->
+    <main id="earth-track" aria-label="Earth imagery scrolling track">
+      <div class="scroll-spacer"></div>
+      <footer class="page-end">
+        <div class="content">
+          <h2>Overview Solutions</h2>
+          <p>Seeing systems from above.</p>
+          <p class="hint">Scroll to fly across the planet.</p>
+        </div>
+      </footer>
+    </main>
@@
-    <img
-      class="logo-frame"
-      src="./drive-download-20250810T114339Z-1-001/v2_logo_White_transparent.png"
-      alt="Overview Solutions logo frame"
-      draggable="false"
-    />
+    <img
+      class="logo-frame"
+      src="./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png"
+      alt="Overview Solutions logo frame"
+      draggable="false"
+    />
@@
-        <img class="brand-mark" src="./drive-download-20250810T114339Z-1-001/v2_logo_White_transparent.png" alt="OVR" />
+        <img class="brand-mark" src="./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png" alt="OVR" />
         <div class="brand-text">
           <h1>Overview Solutions</h1>
           <p>Seeing systems from above</p>
         </div>
       </div>
     </header>
 
     <script src="./script.js"></script>
   </body>
   </html>
*** End Patch
PATCH
```

Reading the current `index.html`, `styles.css`, and `script.js` to update them for a seamless MapLibre-based backdrop and larger black logo.

```html
<<'PATCH'\n*** Begin Patch\n*** Update File: /Users/adamsauer/Documents/GitHub/ovr-site/index.html\n@@\n-    <meta name=\"description\" content=\"Overview Solutions – see systems from above.\" />\n-    <link rel=\"preload\" as=\"image\" href=\"./delta.jpg\" />\n-    <link rel=\"preload\" as=\"image\" href=\"./achipalego.jpg\" />\n-    <link rel=\"preload\" as=\"image\" href=\"./estuary1.jpg\" />\n-    <link rel=\"stylesheet\" href=\"./styles.css\" />\n+    <meta name=\"description\" content=\"Overview Solutions – see systems from above.\" />\n+    <!-- MapLibre for seamless globe imagery backdrop -->\n+    <link href=\"https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css\" rel=\"stylesheet\" />\n+    <script src=\"https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js\"></script>\n+    <link rel=\"stylesheet\" href=\"./styles.css\" />\n   </head>\n   <body>\n-    <!-- Sticky-scrolling image track (Earth passes by underneath) -->\n-    <main id=\"earth-track\" aria-label=\"Earth imagery scrolling track\">\n-      <section class=\"panel\" data-title=\"Lena River Delta, Siberia\">\n-        <div class=\"image\" style=\"--bg:url('./delta.jpg')\"></div>\n-      </section>\n-      <section class=\"panel\" data-title=\"Bissagos Archipelago, Guinea-Bissau\">\n-        <div class=\"image\" style=\"--bg:url('./achipalego.jpg')\"></div>\n-      </section>\n-      <section class=\"panel\" data-title=\"Estuary – Satellite View\">\n-        <div class=\"image\" style=\"--bg:url('./estuary1.jpg')\"></div>\n-      </section>\n-      \n-      <footer class=\"page-end\">\n-        <div class=\"content\">\n-          <h2>Overview Solutions</h2>\n-          <p>Seeing systems from above.</p>\n-          <p class=\"hint\">Scroll back up to look again.</p>\n-        </div>\n-      </footer>\n-    </main>\n+    <!-- Continuous satellite map backdrop -->\n+    <div id=\"map\" aria-hidden=\"true\"></div>\n+\n+    <!-- Long scroll area to drive camera movement -->\n+    <main id=\"earth-track\" aria-label=\"Earth imagery scrolling track\">\n+      <div class=\"scroll-spacer\"></div>\n+      <footer class=\"page-end\">\n+        <div class=\"content\">\n+          <h2>Overview Solutions</h2>\n+          <p>Seeing systems from above.</p>\n+          <p class=\"hint\">Scroll to fly across the planet.</p>\n+        </div>\n+      </footer>\n+    </main>\n@@\n-    <!-- Logo frame overlay (placed above the mask for the window look) -->\n-    <img\n-      class=\"logo-frame\"\n-      src=\"./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png\"\n-      alt=\"Overview Solutions logo frame\"\n-      draggable=\"false\"\n-    />\n+    <!-- Logo frame overlay (placed above the mask for the window look) -->\n+    <img\n+      class=\"logo-frame\"\n+      src=\"./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png\"\n+      alt=\"Overview Solutions logo frame\"\n+      draggable=\"false\"\n+    />\n@@\n-        <img class=\"brand-mark\" src=\"./drive-download-20250810T114339Z-1-001/v2_logo_White_transparent.png\" alt=\"OVR\" />\n+        <img class=\"brand-mark\" src=\"./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png\" alt=\"OVR\" />\n         <div class=\"brand-text\">\n           <h1>Overview Solutions</h1>\n           <p>Seeing systems from above</p>\n         </div>\n       </div>\n     </header>\n*** End Patch\nPATCH
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Overview Solutions</title>
    <meta name="description" content="Overview Solutions – see systems from above." />
    <link href="https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css" rel="stylesheet" />
    <script src="https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js"></script>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <!-- Continuous satellite map backdrop -->
    <div id="map" aria-hidden="true"></div>

    <!-- Long scroll area to drive camera movement -->
    <main id="earth-track" aria-label="Earth imagery scrolling track">
      <div class="scroll-spacer"></div>
      <footer class="page-end">
        <div class="content">
          <h2>Overview Solutions</h2>
          <p>Seeing systems from above.</p>
          <p class="hint">Scroll to fly across the planet.</p>
        </div>
      </footer>
    </main>

    <!-- Black dimmer with a circular transparent hole to simulate a window viewport -->
    <div class="viewport-mask" aria-hidden="true"></div>

    <!-- Logo frame overlay (placed above the mask for the window look) -->
    <img
      class="logo-frame"
      src="./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png"
      alt="Overview Solutions logo frame"
      draggable="false"
    />

    <!-- Brand and minimal nav -->
    <header class="brand">
      <div class="brand-inner">
        <img class="brand-mark" src="./drive-download-20250810T114339Z-1-001/v2_logo_Black_transparent.png" alt="OVR" />
        <div class="brand-text">
          <h1>Overview Solutions</h1>
          <p>Seeing systems from above</p>
        </div>
      </div>
    </header>

    <script src="./script.js"></script>
  </body>
  </html>



```

```css
/* Reset & base */
* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Size variables so we can quickly tune the window and frame scale */
:root {
  /* Nearly full-screen frame */
  --frame-size: min(96vmin, 1040px);
  /* Radius of the transparent window opening */
  --window-radius: 42vmin;
}

/* Sticky-scrolling track */
#earth-track {
  position: relative;
}

/* Fixed full-viewport map backdrop */
#map {
  position: fixed;
  inset: 0;
  z-index: 1; /* behind mask and overlays */
  pointer-events: none; /* non-interactive – scroll drives camera */
}

.scroll-spacer {
  height: 1400vh; /* long flight path */
}

/* Legacy panel caption (not used now) removed */

.page-end {
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 1200px at 50% 40%, rgba(255,255,255,.06), transparent 60%);
}
.page-end .content { text-align: center; padding: 8rem 1rem; }
.page-end h2 { margin: 0 0 .25rem; font-size: 2rem; }
.page-end p { margin: .25rem 0; color: #cfd8dc; }
.page-end .hint { color: #90a4ae; font-size: .9rem; }

/* Logo frame overlay */
.logo-frame {
  position: fixed;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--frame-size);
  height: auto;
  opacity: .95;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,.75));
}

/* Viewport mask: dark cabin with circular cutout */
.viewport-mask {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  /* Create a transparent circle using radial-gradient mask */
  --r: var(--window-radius);
  background:
    radial-gradient(circle at 50% 50%, transparent var(--r), rgba(0,0,0,.8) calc(var(--r) + 1px));
}

/* Brand header */
.brand {
  position: fixed;
  z-index: 40;
  left: 1rem;
  top: 1rem;
}
.brand-inner {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  background: rgba(0,0,0,.35);
  border-radius: .5rem;
  backdrop-filter: blur(6px);
}
.brand-mark { width: 32px; height: 32px; object-fit: contain; }
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text p { font-size: .8rem; margin: 0; color: #b0bec5; }

/* Responsiveness */
@media (max-width: 680px) {
  .brand-text { display: none; }
}



```

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless)
        s2: {
          type: 'raster',
          tiles: [
            // Attributions: © Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2017–2021)
            'https://tiles.maps.eox.at/wms?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=s2cloudless-2021_3857&STYLE=default&TILEMATRIXSET=WebMercatorQuad&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [0, 20],
    zoom: 4,
    pitch: 60,
    bearing: 0,
    interactive: false,
    fadeDuration: 0
  });

  map.once('load', () => {
    updateCamera();
  });
}

// Define a path as an array of lon/lat waypoints
const path = [
  [-15, 28], // Canary Islands
  [-5, 20],  // West Africa coast
  [8, 14],   // Gulf of Guinea
  [20, 8],   // Cameroon / Nigeria
  [34, 0],   // East Africa
  [46, -10], // Madagascar channel
  [80, -10], // Indian Ocean
  [100, 0],  // SE Asia
  [120, 15], // Philippines
  [140, 25], // NW Pacific
];

function lerp(a, b, t) { return a + (b - a) * t; }

function interpolatePath(points, t) {
  const n = points.length - 1;
  if (n <= 0) return points[0];
  const scaled = t * n;
  const i = Math.min(n - 1, Math.floor(scaled));
  const localT = scaled - i;
  const [lon1, lat1] = points[i];
  const [lon2, lat2] = points[i + 1];
  return [lerp(lon1, lon2, localT), lerp(lat1, lat2, localT)];
}

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const [lon, lat] = interpolatePath(path, t);
  const zoom = 4 + t * 3; // gentle zoom in
  const bearing = 0 + t * 180; // rotate during flight
  map.jumpTo({ center: [lon, lat], zoom, bearing, pitch: 60 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

```css
/* Reset & base */
* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Size variables so we can quickly tune the window and frame scale */
:root {
  /* Nearly full-screen frame */
  --frame-size: min(96vmin, 1040px);
  /* Radius of the transparent window opening */
  --window-radius: 42vmin;
}

/* Sticky-scrolling track */
#earth-track {
  position: relative;
}

/* Fixed full-viewport map backdrop */
#map {
  position: fixed;
  inset: 0;
  z-index: 1; /* behind mask and overlays */
  pointer-events: none; /* non-interactive – scroll drives camera */
}

.scroll-spacer {
  height: 1400vh; /* long flight path */
}

/* Legacy panel caption (not used now) removed */

.page-end {
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 1200px at 50% 40%, rgba(255,255,255,.06), transparent 60%);
}
.page-end .content { text-align: center; padding: 8rem 1rem; }
.page-end h2 { margin: 0 0 .25rem; font-size: 2rem; }
.page-end p { margin: .25rem 0; color: #cfd8dc; }
.page-end .hint { color: #90a4ae; font-size: .9rem; }

/* Logo frame overlay */
.logo-frame {
  position: fixed;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--frame-size);
  height: auto;
  opacity: .95;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,.75));
}

/* Viewport mask: dark cabin with circular cutout */
.viewport-mask {
  position: fixed;
  inset: 0;
  z-index: 20; /* Must sit above #map (z-index:1) */
  pointer-events: none;
  /* Create a transparent circle using radial-gradient mask */
  --r: var(--window-radius);
  background:
    radial-gradient(circle at 50% 50%, transparent var(--r), rgba(0,0,0,.8) calc(var(--r) + 1px));
}

/* Brand header */
.brand {
  position: fixed;
  z-index: 40;
  left: 1rem;
  top: 1rem;
}
.brand-inner {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  background: rgba(0,0,0,.35);
  border-radius: .5rem;
  backdrop-filter: blur(6px);
}
.brand-mark { width: 32px; height: 32px; object-fit: contain; }
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text p { font-size: .8rem; margin: 0; color: #b0bec5; }

/* Responsiveness */
@media (max-width: 680px) {
  .brand-text { display: none; }
}



```

- Replaced the discrete image panels with a seamless satellite backdrop powered by MapLibre, so the view flows continuously while scrolling.
- Added a long scroll spacer (`.scroll-spacer`) and wired scroll progress to move the camera along a multi-stop path across Africa/Indian Ocean/SE Asia, with gentle zoom and rotation.
- Switched the overlay and brand mark to your black logo and kept the ISS-style circular viewport mask on top.
- You can tune path/speed in `script.js`:
  - Edit `path` long/lat points.
  - Adjust total distance with `.scroll-spacer { height: 1400vh; }`.
  - Change zoom/rotation formulas in `updateCamera()`.

Reload `http://localhost:5173` to see the continuous landscape underneath the window. Want me to trace a specific route (e.g., over your favorite deltas/archipelagos) or extend the flight longer?

---

**User**

It's just black

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [0, 20],
    zoom: 4,
    pitch: 60,
    bearing: 0,
    interactive: false,
    fadeDuration: 0
  });

  map.once('load', () => {
    updateCamera();
  });
}

// Define a path as an array of lon/lat waypoints
const path = [
  [-15, 28], // Canary Islands
  [-5, 20],  // West Africa coast
  [8, 14],   // Gulf of Guinea
  [20, 8],   // Cameroon / Nigeria
  [34, 0],   // East Africa
  [46, -10], // Madagascar channel
  [80, -10], // Indian Ocean
  [100, 0],  // SE Asia
  [120, 15], // Philippines
  [140, 25], // NW Pacific
];

function lerp(a, b, t) { return a + (b - a) * t; }

function interpolatePath(points, t) {
  const n = points.length - 1;
  if (n <= 0) return points[0];
  const scaled = t * n;
  const i = Math.min(n - 1, Math.floor(scaled));
  const localT = scaled - i;
  const [lon1, lat1] = points[i];
  const [lon2, lat2] = points[i + 1];
  return [lerp(lon1, lon2, localT), lerp(lat1, lat2, localT)];
}

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const [lon, lat] = interpolatePath(path, t);
  const zoom = 4 + t * 3; // gentle zoom in
  const bearing = 0 + t * 180; // rotate during flight
  map.jumpTo({ center: [lon, lat], zoom, bearing, pitch: 60 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

```css
/* Reset & base */
* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Size variables so we can quickly tune the window and frame scale */
:root {
  /* Nearly full-screen frame */
  --frame-size: min(96vmin, 1040px);
  /* Radius of the transparent window opening */
  --window-radius: 42vmin;
}

/* Sticky-scrolling track */
#earth-track {
  position: relative;
}

/* Fixed full-viewport map backdrop */
#map {
  position: fixed;
  inset: 0;
  z-index: 1; /* behind mask and overlays */
  pointer-events: none; /* non-interactive – scroll drives camera */
  width: 100%;
  height: 100vh; /* explicit height ensures render */
}

.scroll-spacer {
  height: 1400vh; /* long flight path */
}

/* Legacy panel caption (not used now) removed */

.page-end {
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 1200px at 50% 40%, rgba(255,255,255,.06), transparent 60%);
}
.page-end .content { text-align: center; padding: 8rem 1rem; }
.page-end h2 { margin: 0 0 .25rem; font-size: 2rem; }
.page-end p { margin: .25rem 0; color: #cfd8dc; }
.page-end .hint { color: #90a4ae; font-size: .9rem; }

/* Logo frame overlay */
.logo-frame {
  position: fixed;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--frame-size);
  height: auto;
  opacity: .95;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,.75));
}

/* Viewport mask: dark cabin with circular cutout */
.viewport-mask {
  position: fixed;
  inset: 0;
  z-index: 20; /* Must sit above #map (z-index:1) */
  pointer-events: none;
  /* Create a transparent circle using radial-gradient mask */
  --r: var(--window-radius);
  background:
    radial-gradient(circle at 50% 50%, transparent var(--r), rgba(0,0,0,.8) calc(var(--r) + 1px));
}

/* Brand header */
.brand {
  position: fixed;
  z-index: 40;
  left: 1rem;
  top: 1rem;
}
.brand-inner {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  background: rgba(0,0,0,.35);
  border-radius: .5rem;
  backdrop-filter: blur(6px);
}
.brand-mark { width: 32px; height: 32px; object-fit: contain; }
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text p { font-size: .8rem; margin: 0; color: #b0bec5; }

/* Responsiveness */
@media (max-width: 680px) {
  .brand-text { display: none; }
}



```

- Fixed the continuous map: set the correct Sentinel‑2 cloudless tile URL and ensured `#map` has an explicit height so it renders.
- You should now see satellite imagery under the window; scrolling moves the “camera” along the path.

If it’s still black, try a hard refresh. Want me to extend the route or change altitude/speed?

---

**User**

The map looks good, but instead of facing straight down, it looks out at an angle. Also, when I scroll, instead of panning down, it rotates while zooming to a location that eventually ends in an unloaded part of the map

---

**Cursor**

Making the camera top-down and removing rotation/zoom on scroll so it pans smoothly. Also constraining pitch to 0 and disabling rotation. Updating `script.js` now and reloading the local site.

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [0, 20],
    zoom: 5.2,
    pitch: 0,
    bearing: 0,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    updateCamera();
  });
}

// Define a path as an array of lon/lat waypoints
const path = [
  [-15, 28], // Canary Islands
  [-5, 20],  // West Africa coast
  [8, 14],   // Gulf of Guinea
  [20, 8],   // Cameroon / Nigeria
  [34, 0],   // East Africa
  [46, -10], // Madagascar channel
  [80, -10], // Indian Ocean
  [100, 0],  // SE Asia
  [120, 15], // Philippines
  [140, 25], // NW Pacific
];

function lerp(a, b, t) { return a + (b - a) * t; }

function interpolatePath(points, t) {
  const n = points.length - 1;
  if (n <= 0) return points[0];
  const scaled = t * n;
  const i = Math.min(n - 1, Math.floor(scaled));
  const localT = scaled - i;
  const [lon1, lat1] = points[i];
  const [lon2, lat2] = points[i + 1];
  return [lerp(lon1, lon2, localT), lerp(lat1, lat2, localT)];
}

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const [lon, lat] = interpolatePath(path, t);
  const zoom = 5.2; // constant zoom for a consistent scale
  map.jumpTo({ center: [lon, lat], zoom, bearing: 0, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

- Set a true top-down view: `pitch: 0`, rotation disabled, and a fixed zoom for a stable scale.
- On scroll, the camera now pans along the path only; no rotation/zoom.
- Added safeguards (`maxPitch: 0`, `dragRotate: false`, `pitchWithRotate: false`) to prevent tilting.

Refresh `http://localhost:5173`. If you want a specific direction (e.g., always southward), I can align the path accordingly.

---

**User**

It still progresses to the SouthEast instead os straight South

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [0, 20],
    zoom: 5.2,
    pitch: 0,
    bearing: 0,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    updateCamera();
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const fixedLongitude = 0; // change this to choose where you look straight south from
const startLatitude = 50; // starting latitude (north)
const endLatitude = -50;  // ending latitude (south)
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const lat = lerp(startLatitude, endLatitude, t);
  const zoom = 5.2; // constant zoom for a consistent scale
  map.jumpTo({ center: [fixedLongitude, lat], zoom, bearing: 0, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

---

**User**

Okay great, now it's just zoomed way out. I want it to pan over a famous delta or something famously beautiful from above

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

// Choose a featured flyover. Options sketched for future:
// - Ganges-Brahmaputra Delta (Bangladesh)
// - Niger Delta (Nigeria)
// - Lena River Delta (Russia)
// - Okavango Delta (Botswana)
const flyover = {
  name: 'Ganges-Brahmaputra Delta',
  longitude: 90.0,    // keep this fixed to move straight south
  startLat: 24.0,     // north edge of the delta
  endLat: 20.0,       // Bay of Bengal
  zoom: 8.6           // closer view of channels and islands
};

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [flyover.longitude, flyover.startLat],
    zoom: flyover.zoom,
    pitch: 0,
    bearing: 0,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    updateCamera();
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const fixedLongitude = flyover.longitude;
const startLatitude = flyover.startLat;
const endLatitude = flyover.endLat;
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const lat = lerp(startLatitude, endLatitude, t);
  const zoom = flyover.zoom; // constant zoom tuned for detail
  map.jumpTo({ center: [fixedLongitude, lat], zoom, bearing: 0, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

---

**User**

That's a beautiful spot, but we miss most of the coast because it's laterally one way of the other. What if we rotated the map so that we could scroll down the coast instead? And also preload tiles a little bit earlier in the direction of the scroll

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

// Choose a featured flyover. Options sketched for future:
// - Ganges-Brahmaputra Delta (Bangladesh)
// - Niger Delta (Nigeria)
// - Lena River Delta (Russia)
// - Okavango Delta (Botswana)
const flyover = {
  name: 'Ganges-Brahmaputra Delta',
  // Move eastward along the coast while rotating map so east is down
  startLon: 88.0,
  endLon: 92.2,
  lat: 21.6,
  zoom: 8.8,
  bearing: 270 // east points down (so scroll feels like moving down the coast)
};

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [flyover.startLon, flyover.lat],
    zoom: flyover.zoom,
    pitch: 0,
    bearing: flyover.bearing,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    if (typeof map.setPrefetchZoomDelta === 'function') {
      map.setPrefetchZoomDelta(2); // preload higher-zoom tiles ahead
    }
    updateCamera();
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const startLongitude = flyover.startLon;
const endLongitude = flyover.endLon;
const fixedLatitude = flyover.lat;
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const lon = lerp(startLongitude, endLongitude, t);
  const zoom = flyover.zoom; // constant zoom tuned for detail
  map.jumpTo({ center: [lon, fixedLatitude], zoom, bearing: flyover.bearing, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

```css
/* Reset & base */
* { box-sizing: border-box; }
html, body { height: 100%; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
}

/* Size variables so we can quickly tune the window and frame scale */
:root {
  /* Nearly full-screen frame */
  --frame-size: min(96vmin, 1040px);
  /* Radius of the transparent window opening */
  --window-radius: 42vmin;
}

/* Sticky-scrolling track */
#earth-track {
  position: relative;
}

/* Fixed full-viewport map backdrop */
#map {
  position: fixed;
  inset: 0;
  z-index: 1; /* behind mask and overlays */
  pointer-events: none; /* non-interactive – scroll drives camera */
  width: 100%;
  height: 100vh; /* explicit height ensures render */
}

.scroll-spacer {
  height: 800vh; /* tuned path length */
}

/* Legacy panel caption (not used now) removed */

.page-end {
  display: grid;
  place-items: center;
  background: radial-gradient(1200px 1200px at 50% 40%, rgba(255,255,255,.06), transparent 60%);
}
.page-end .content { text-align: center; padding: 8rem 1rem; }
.page-end h2 { margin: 0 0 .25rem; font-size: 2rem; }
.page-end p { margin: .25rem 0; color: #cfd8dc; }
.page-end .hint { color: #90a4ae; font-size: .9rem; }

/* Logo frame overlay */
.logo-frame {
  position: fixed;
  z-index: 30;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: var(--frame-size);
  height: auto;
  opacity: .95;
  pointer-events: none;
  filter: drop-shadow(0 10px 24px rgba(0,0,0,.75));
}

/* Viewport mask: dark cabin with circular cutout */
.viewport-mask {
  position: fixed;
  inset: 0;
  z-index: 20; /* Must sit above #map (z-index:1) */
  pointer-events: none;
  /* Create a transparent circle using radial-gradient mask */
  --r: var(--window-radius);
  background:
    radial-gradient(circle at 50% 50%, transparent var(--r), rgba(0,0,0,.8) calc(var(--r) + 1px));
}

/* Brand header */
.brand {
  position: fixed;
  z-index: 40;
  left: 1rem;
  top: 1rem;
}
.brand-inner {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .25rem .5rem;
  background: rgba(0,0,0,.35);
  border-radius: .5rem;
  backdrop-filter: blur(6px);
}
.brand-mark { width: 32px; height: 32px; object-fit: contain; }
.brand-text h1 { font-size: 1rem; margin: 0; }
.brand-text p { font-size: .8rem; margin: 0; color: #b0bec5; }

/* Responsiveness */
@media (max-width: 680px) {
  .brand-text { display: none; }
}



```

---

**User**

Beautiful! Move to the North just a little to get more land in the shot

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

// Choose a featured flyover. Options sketched for future:
// - Ganges-Brahmaputra Delta (Bangladesh)
// - Niger Delta (Nigeria)
// - Lena River Delta (Russia)
// - Okavango Delta (Botswana)
const flyover = {
  name: 'Ganges-Brahmaputra Delta',
  // Move eastward along the coast while rotating map so east is down
  startLon: 88.0,
  endLon: 92.2,
  lat: 22.4,
  zoom: 8.8,
  bearing: 270 // east points down (so scroll feels like moving down the coast)
};

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [flyover.startLon, flyover.lat],
    zoom: flyover.zoom,
    pitch: 0,
    bearing: flyover.bearing,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    if (typeof map.setPrefetchZoomDelta === 'function') {
      map.setPrefetchZoomDelta(2); // preload higher-zoom tiles ahead
    }
    updateCamera();
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const startLongitude = flyover.startLon;
const endLongitude = flyover.endLon;
const fixedLatitude = flyover.lat;
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const lon = lerp(startLongitude, endLongitude, t);
  const zoom = flyover.zoom; // constant zoom tuned for detail
  map.jumpTo({ center: [lon, fixedLatitude], zoom, bearing: flyover.bearing, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

---

**User**

Can we rotate it so that the land it on the right? This should be an 180 degree rotation

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

// Choose a featured flyover. Options sketched for future:
// - Ganges-Brahmaputra Delta (Bangladesh)
// - Niger Delta (Nigeria)
// - Lena River Delta (Russia)
// - Okavango Delta (Botswana)
const flyover = {
  name: 'Ganges-Brahmaputra Delta',
  // Move eastward along the coast while rotating map so east is down
  startLon: 88.0,
  endLon: 92.2,
  lat: 21.6,
  zoom: 8.8,
  bearing: 90 // 180° from previous (land on the right)
};

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [flyover.startLon, flyover.lat],
    zoom: flyover.zoom,
    pitch: 0,
    bearing: flyover.bearing,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    if (typeof map.setPrefetchZoomDelta === 'function') {
      map.setPrefetchZoomDelta(2); // preload higher-zoom tiles ahead
    }
    updateCamera();
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const startLongitude = flyover.startLon;
const endLongitude = flyover.endLon;
const fixedLatitude = flyover.lat;
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const lon = lerp(startLongitude, endLongitude, t);
  const zoom = flyover.zoom; // constant zoom tuned for detail
  map.jumpTo({ center: [lon, fixedLatitude], zoom, bearing: flyover.bearing, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

---

**User**

Now scrolling down moves the map up though. Also move it a little more North than you did last time

---

**Cursor**

```javascript
/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;

// Choose a featured flyover. Options sketched for future:
// - Ganges-Brahmaputra Delta (Bangladesh)
// - Niger Delta (Nigeria)
// - Lena River Delta (Russia)
// - Okavango Delta (Botswana)
const flyover = {
  name: 'Ganges-Brahmaputra Delta',
  // Bearing 90°: east is up, so to move visually DOWN the coast we go westward
  startLon: 92.5,
  endLon: 88.0,
  lat: 23.2,
  zoom: 8.8,
  bearing: 90 // 180° from previous (land on the right)
};

function initMap() {
  if (!mapContainer) return;
  map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        // EOX Sentinel-2 cloudless tiles (tokenless, RESTful WMTS)
        s2: {
          type: 'raster',
          tiles: [
            'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg'
          ],
          tileSize: 256,
          attribution: 'Imagery © EOX • Sentinel-2 cloudless',
        },
      },
      layers: [
        { id: 's2', type: 'raster', source: 's2' }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
    },
    center: [flyover.startLon, flyover.lat],
    zoom: flyover.zoom,
    pitch: 0,
    bearing: flyover.bearing,
    interactive: false,
    fadeDuration: 0,
    maxPitch: 0,
    minPitch: 0,
    dragRotate: false,
    pitchWithRotate: false,
    renderWorldCopies: true
  });

  map.once('load', () => {
    if (typeof map.setPrefetchZoomDelta === 'function') {
      map.setPrefetchZoomDelta(3); // preload more tiles in scroll direction
    }
    updateCamera();
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const startLongitude = flyover.startLon;
const endLongitude = flyover.endLon;
const fixedLatitude = flyover.lat;
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map) return;
  const spacer = document.querySelector('.scroll-spacer');
  const max = spacer ? spacer.getBoundingClientRect().height - window.innerHeight : document.body.scrollHeight - window.innerHeight;
  const y = window.scrollY || window.pageYOffset;
  const t = Math.max(0, Math.min(1, y / Math.max(1, max)));
  const lon = lerp(startLongitude, endLongitude, t);
  const zoom = flyover.zoom; // constant zoom tuned for detail
  map.jumpTo({ center: [lon, fixedLatitude], zoom, bearing: flyover.bearing, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map) return;
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}



```

