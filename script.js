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


