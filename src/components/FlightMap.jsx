import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon — white text on dark pin for readability
function createAirportIcon(label) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="60" viewBox="0 0 52 60">
    <defs><filter id="s${label}" x="-20%" y="-10%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>
    <g filter="url(#s${label})">
      <path d="M26 56 C26 56 46 36 46 21 A20 20 0 0 0 6 21 C6 36 26 56 26 56Z" fill="#1c1917" stroke="#c4a882" stroke-width="1.5"/>
      <text x="26" y="25" text-anchor="middle" font-family="Syne,sans-serif" font-weight="800" font-size="11" fill="#f7f3ec">${label}</text>
    </g>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [52, 60],
    iconAnchor: [26, 60],
    popupAnchor: [0, -60],
  });
}

// Fit map bounds to both markers
function FitBounds({ bounds }) {
  const map = useMap();
  React.useEffect(() => {
    if (bounds) {
      // Get container size to calculate percentage-based padding
      const size = map.getSize();
      const padX = Math.round(size.x * 0.18);
      const padTop = Math.round(size.y * 0.22);
      const padBottom = Math.round(size.y * 0.15);
      map.fitBounds(bounds, { paddingTopLeft: [padX, padTop], paddingBottomRight: [padX, padBottom], maxZoom: 5 });
    }
  }, [map, bounds]);
  return null;
}

// Invalidate map size when container resizes
function MapResizeHandler() {
  const map = useMap();
  React.useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize({ animate: true }), 550);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

// Generate curved line between two points (great circle approximation)
function getCurvedPath(from, to, segments = 50) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = from[0] + (to[0] - from[0]) * t;

    // Handle the date line crossing
    let dLng = to[1] - from[1];
    if (Math.abs(dLng) > 180) {
      dLng = dLng > 0 ? dLng - 360 : dLng + 360;
    }
    const lng = from[1] + dLng * t;

    // Add curvature (arc upward)
    const arc = Math.sin(t * Math.PI) * Math.min(15, Math.abs(to[0] - from[0]) + Math.abs(dLng) * 0.08);
    points.push([lat + arc, lng]);
  }
  return points;
}

// Adjust destination longitude for antimeridian crossing so both markers
// appear on the same world copy in Leaflet
function adjustForAntimeridian(originLng, destLng) {
  let dLng = destLng - originLng;
  if (dLng > 180) return destLng - 360;
  if (dLng < -180) return destLng + 360;
  return destLng;
}

export function FlightMap({ origin, destination }) {
  const hasCoords = origin.lat != null && origin.lng != null && destination.lat != null && destination.lng != null;

  // Adjust destination longitude if route crosses the antimeridian
  const adjustedDestLng = useMemo(() => {
    if (!hasCoords) return destination.lng;
    return adjustForAntimeridian(origin.lng, destination.lng);
  }, [hasCoords, origin.lng, destination.lng]);

  const originPos = useMemo(() => hasCoords ? [origin.lat, origin.lng] : null, [hasCoords, origin.lat, origin.lng]);
  const destPos = useMemo(() => hasCoords ? [destination.lat, adjustedDestLng] : null, [hasCoords, destination.lat, adjustedDestLng]);

  const bounds = useMemo(() => {
    if (!originPos || !destPos) return null;
    return L.latLngBounds([originPos, destPos]);
  }, [originPos, destPos]);

  const curvedPath = useMemo(() => {
    if (!originPos || !destPos) return [];
    return getCurvedPath(originPos, destPos);
  }, [originPos, destPos]);

  const originIcon = useMemo(() => createAirportIcon(origin.code), [origin.code]);
  const destIcon = useMemo(() => createAirportIcon(destination.code), [destination.code]);

  if (!hasCoords) return null;

  return (
    <div className="w-full h-full relative">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          minZoom={2}
          scrollWheelZoom={true}
          dragging={true}
          zoomControl={false}
          attributionControl={false}
          worldCopyJump={false}
          style={{ height: '100%', width: '100%', background: '#f5f0e8' }}
          className="flight-map"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          />
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            pane="shadowPane"
          />
          <FitBounds bounds={bounds} />
          <MapResizeHandler />

          <Marker position={originPos} icon={originIcon} />
          <Marker position={destPos} icon={destIcon} />

          {/* Route line */}
          <Polyline
            positions={curvedPath}
            pathOptions={{
              color: '#c4a882',
              weight: 2.5,
              opacity: 0.8,
              dashArray: '8 6',
              className: 'flight-route-line',
            }}
          />
        </MapContainer>

      {/* Subtle edge fade */}
      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-[999]" />
      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-[999]" />

      {/* Attribution */}
      <div className="absolute bottom-1 right-2 text-[9px] text-stone-400/60 z-[1000] pointer-events-none">
        OpenStreetMap &middot; CARTO
      </div>
    </div>
  );
}
