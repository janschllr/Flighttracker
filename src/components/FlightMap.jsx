import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getFlightProgress } from '../utils/flightProgress';

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

// Plane icon with rotation support
function createPlaneIcon(rotation) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" style="transform: rotate(${rotation}deg)">
    <defs>
      <filter id="ps" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="1" stdDeviation="2.5" flood-opacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#ps)">
      <circle cx="18" cy="18" r="15" fill="#1c1917" opacity="0.92"/>
      <g transform="translate(18,18) scale(0.7) translate(-18,-18)">
        <path d="M18 4 L20 14 L30 17 Q31 18 30 19 L20 22 L18 30 Q18 31 18 30 L16 22 L6 19 Q5 18 6 17 L16 14 Z" fill="#c4a882"/>
        <path d="M16.5 24 L15 28 Q14.5 29 15.5 28.5 L18 26 L20.5 28.5 Q21.5 29 21 28 L19.5 24" fill="#c4a882"/>
      </g>
    </g>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
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

// Calculate bearing between two points on the curved path
function getBearing(p1, p2) {
  const dLng = p2[1] - p1[1];
  const dLat = p2[0] - p1[0];
  // atan2 returns angle from east; convert to degrees from north
  const angle = Math.atan2(dLng, dLat) * (180 / Math.PI);
  return (angle + 360) % 360;
}

export function FlightMap({ flight }) {
  const { origin, destination } = flight;
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

  // Calculate plane position and rotation
  const planeData = useMemo(() => {
    if (!hasCoords || curvedPath.length === 0) return null;

    const progress = getFlightProgress(flight);
    if (progress <= 0 || progress >= 100) return null;

    // Use live coordinates if available
    if (flight.live?.latitude != null && flight.live?.longitude != null) {
      const liveLng = adjustForAntimeridian(origin.lng, flight.live.longitude);
      const rotation = flight.live.direction ?? 0;
      return { position: [flight.live.latitude, liveLng], rotation };
    }

    // Interpolate on curved path
    const t = progress / 100;
    const exactIndex = t * (curvedPath.length - 1);
    const idx = Math.floor(exactIndex);
    const frac = exactIndex - idx;

    const p1 = curvedPath[Math.min(idx, curvedPath.length - 1)];
    const p2 = curvedPath[Math.min(idx + 1, curvedPath.length - 1)];

    const lat = p1[0] + (p2[0] - p1[0]) * frac;
    const lng = p1[1] + (p2[1] - p1[1]) * frac;

    // Calculate bearing from surrounding points for smoother rotation
    const prevIdx = Math.max(0, idx - 1);
    const nextIdx = Math.min(curvedPath.length - 1, idx + 2);
    const rotation = getBearing(curvedPath[prevIdx], curvedPath[nextIdx]);

    return { position: [lat, lng], rotation };
  }, [hasCoords, curvedPath, flight, origin.lng]);

  const planeIcon = useMemo(() => {
    if (!planeData) return null;
    return createPlaneIcon(planeData.rotation);
  }, [planeData]);

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

          {/* Plane marker */}
          {planeData && planeIcon && (
            <Marker position={planeData.position} icon={planeIcon} zIndexOffset={1000} />
          )}

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
