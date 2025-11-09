/*
  Drive a seamless satellite backdrop using MapLibre GL.
  We lock the map to the viewport, and map camera follows a long
  great-circle style path as you scroll.
*/

const mapContainer = document.getElementById('map');
let map;
let introAnimating = false;
let mapInteractive = false; // Track if map is in interactive mode

// Choose a featured flyover. Options sketched for future:
// - Ganges-Brahmaputra Delta (Bangladesh)
// - Niger Delta (Nigeria)
// - Lena River Delta (Russia)
// - Okavango Delta (Botswana)
const flyover = {
  name: 'Ganges-Brahmaputra Delta',
  // Bearing 90°: east is up, so to move visually DOWN the coast we go westward
  startLon: 89.8,
  endLon: 88.8,
  lat: 21.9,
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
    // Boost color vibrancy of raster tiles
    try {
      map.setPaintProperty('s2', 'raster-saturation', 0.35);
      map.setPaintProperty('s2', 'raster-contrast', 0.2);
      map.setPaintProperty('s2', 'raster-brightness-min', 0.02);
      map.setPaintProperty('s2', 'raster-brightness-max', 1.05);
    } catch (e) {
      console.warn('Could not set raster style properties', e);
    }

    // Intro zoom: from global view to the flyover start, then hand off to scroll
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      introAnimating = true;
      // Start from a global-esque top-down view
      map.jumpTo({ center: [flyover.startLon, 0], zoom: 1.8, bearing: 0, pitch: 0 });
      // Ease into the target start view
      map.easeTo({
        center: [flyover.startLon, fixedLatitude],
        zoom: flyover.zoom,
        bearing: flyover.bearing,
        pitch: 0,
        duration: 2800,
        easing: (t) => (t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t),
        essential: true
      });
      map.once('moveend', () => {
        introAnimating = false;
        updateCamera();
      });
    } else {
      updateCamera();
    }
  });
}

// Straight-south track: keep longitude fixed, vary latitude only
const startLongitude = flyover.startLon;
const endLongitude = flyover.endLon;
const fixedLatitude = flyover.lat;
function lerp(a, b, t) { return a + (b - a) * t; }

function updateCamera() {
  if (!map || mapInteractive) return; // Don't update if in interactive mode
  // Tie camera progress to total page scroll for consistent feel with cards
  const doc = document.documentElement;
  const totalScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  const y = window.scrollY || window.pageYOffset;
  // Apply a slight speed multiplier so map and cards feel in sync
  const speed = 1.0; // 1.0 == match; increase to move map faster
  const t = Math.min(1, Math.max(0, (y * speed) / totalScroll));
  const lon = lerp(startLongitude, endLongitude, t);
  const zoom = flyover.zoom; // constant zoom tuned for detail
  map.jumpTo({ center: [lon, fixedLatitude], zoom, bearing: flyover.bearing, pitch: 0 });
}

let ticking = false;
function onScroll() {
  if (!map || introAnimating || mapInteractive) return; // Don't scroll-update in interactive mode
  if (!ticking) {
    requestAnimationFrame(() => { updateCamera(); ticking = false; });
    ticking = true;
  }
}

// Toggle map interactivity
function enableMapInteraction() {
  if (!map) return;
  mapInteractive = true;
  mapContainer.style.pointerEvents = 'auto';
  map.dragPan.enable();
  map.scrollZoom.enable();
  map.doubleClickZoom.enable();
  mapContainer.style.cursor = 'grab';
}

function disableMapInteraction() {
  if (!map) return;
  mapInteractive = false;
  mapContainer.style.pointerEvents = 'none';
  map.dragPan.disable();
  map.scrollZoom.disable();
  map.doubleClickZoom.disable();
  mapContainer.style.cursor = '';
  // Return to scroll position
  updateCamera();
}

// Click on map to enable interaction
mapContainer.addEventListener('click', (e) => {
  if (!mapInteractive) {
    e.stopPropagation();
    enableMapInteraction();
  }
});

// Click outside map to disable interaction
document.addEventListener('click', (e) => {
  if (mapInteractive && !mapContainer.contains(e.target)) {
    disableMapInteraction();
  }
});

// ESC key to exit interactive mode
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mapInteractive) {
    disableMapInteraction();
  }
});

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateCamera);

// Initialize
if (window.maplibregl) {
  initMap();
} else {
  // If CDN fails, keep page usable
  console.warn('MapLibre failed to load');
}

/*
  Anti-spam form protection
  Combines honeypot fields with timing checks to filter automated bots
*/

const contactForm = document.getElementById('contactForm');
const timestampField = document.getElementById('formTimestamp');

// Record when the form was loaded (bots submit too quickly)
let formLoadTime = Date.now();

if (contactForm && timestampField) {
  // Set the timestamp when form loads
  timestampField.value = formLoadTime;
  
  contactForm.addEventListener('submit', function(e) {
    // Check honeypot fields - if any are filled, it's likely a bot
    const honeyFields = [
      document.querySelector('input[name="_honey"]'),
      document.querySelector('input[name="website"]'),
      document.querySelector('input[name="company_name"]')
    ];
    
    for (let field of honeyFields) {
      if (field && field.value !== '') {
        e.preventDefault();
        console.warn('Bot detected: honeypot field filled');
        // Silently fail - don't give bots feedback
        return false;
      }
    }
    
    // Check if form was submitted too quickly (less than 3 seconds)
    const submitTime = Date.now();
    const timeDiff = (submitTime - formLoadTime) / 1000; // in seconds
    
    if (timeDiff < 3) {
      e.preventDefault();
      alert('Please take a moment to review your message before submitting.');
      return false;
    }
    
    // If we get here, it's likely a legitimate submission
    return true;
  });
}

