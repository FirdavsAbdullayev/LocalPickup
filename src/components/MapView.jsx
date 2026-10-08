import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ─── Provayder abstraksiya ──────────────────────────────────────────────────
// Default: OSM (bepul, kalit talab qilmaydi).
// Boshqa provayder: VITE_MAP_PROVIDER=yandex|google + VITE_MAP_TOKEN ni kiriting.
// Yandex/Google to'liq integrasiya uchun o'z JS SDK'larini talab qiladi —
// bu yerda ular uchun rastr tile URL'lari ishlatiladi (oson almashtiriladi).
const PROVIDER = import.meta.env.VITE_MAP_PROVIDER || 'osm';

const TILE_URLS = {
  osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  yandex: 'https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=21.07.04&z={z}&x={x}&y={y}&scale=1&lang=uz_UZ',
  google: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
};

const TILE_ATTRIBUTIONS = {
  osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  yandex: '&copy; <a href="https://yandex.com/maps">Yandex Maps</a>',
  google: '&copy; Google Maps',
};

// Default marker ikonkasini Vite bilan to'g'ri ishlashi uchun
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = defaultIcon;

const DEFAULT_CENTER = [41.311081, 69.240562]; // Toshkent

const MapView = ({
  markers = [],
  center = DEFAULT_CENTER,
  zoom = 13,
  height = '480px',
  pickMode = false,
  picked = null,
  onPick,
  className = '',
}) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const pickedMarkerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    const tileUrl = TILE_URLS[PROVIDER] || TILE_URLS.osm;
    let tileOptions = { maxZoom: 19, attribution: TILE_ATTRIBUTIONS[PROVIDER] || TILE_ATTRIBUTIONS.osm };
    if (PROVIDER === 'google') tileOptions = { maxZoom: 19, attribution: TILE_ATTRIBUTIONS.google, crossOrigin: true };

    L.tileLayer(tileUrl, tileOptions).addTo(map);

    layerRef.current = L.layerGroup().addTo(map);

    if (pickMode) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        if (pickedMarkerRef.current) map.removeLayer(pickedMarkerRef.current);
        pickedMarkerRef.current = L.marker([lat, lng]).addTo(map);
        onPick?.(+lat.toFixed(6), +lng.toFixed(6));
      });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      pickedMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Markerlarni yangilash
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    markers.forEach((m) => {
      if (!Number.isFinite(m.lat) || !Number.isFinite(m.lng)) return;
      const marker = L.marker([m.lat, m.lng]);
      if (m.title) {
        const link = m.slug ? `<a href="/shops/${m.slug}">${m.title}</a>` : m.title;
        marker.bindPopup(`<strong>${m.title}</strong>${link !== m.title ? `<br/>${link}` : ''}`);
      }
      marker.addTo(layer);
    });

    if (pickMode && picked) {
      if (pickedMarkerRef.current) map.removeLayer(pickedMarkerRef.current);
      pickedMarkerRef.current = L.marker([picked.lat, picked.lng]).addTo(map);
    }

    if (markers.length === 0 && !pickMode) {
      map.setView(center, zoom);
    } else if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.filter(m => Number.isFinite(m.lat) && Number.isFinite(m.lng)).map(m => [m.lat, m.lng]));
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, picked, pickMode]);

  return <div ref={containerRef} className={`rounded-xl border border-slate-200 shadow-sm ${className}`} style={{ height }} />;
};

export default MapView;
export { PROVIDER };