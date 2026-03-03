import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '../ThemeContext';
import { getFlightProgress } from '../utils/flightProgress';

// Calculate the midpoint between two coordinates, handling antimeridian crossing
function getMidpoint(lat1, lng1, lat2, lng2) {
  const midLat = (lat1 + lat2) / 2;

  let dLng = lng2 - lng1;
  // If the difference is > 180°, the shorter path crosses the antimeridian
  if (dLng > 180) dLng -= 360;
  if (dLng < -180) dLng += 360;

  let midLng = lng1 + dLng / 2;
  // Normalize to -180..180
  if (midLng > 180) midLng -= 360;
  if (midLng < -180) midLng += 360;

  return { lat: midLat, lng: midLng };
}

// Calculate angular distance between two points for altitude scaling
function angularDistance(lat1, lng1, lat2, lng2) {
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  let dLng = lng2 - lng1;
  if (dLng > 180) dLng -= 360;
  if (dLng < -180) dLng += 360;
  dLng = toRad(dLng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 180 / Math.PI;
}

// Interpolate a point along the great circle arc at parameter t (0–1)
function interpolateGreatCircle(lat1, lng1, lat2, lng2, t) {
  const toRad = (d) => d * Math.PI / 180;
  const toDeg = (r) => r * 180 / Math.PI;

  const phi1 = toRad(lat1), lam1 = toRad(lng1);
  const phi2 = toRad(lat2), lam2 = toRad(lng2);

  let dLam = lam2 - lam1;
  if (dLam > Math.PI) dLam -= 2 * Math.PI;
  if (dLam < -Math.PI) dLam += 2 * Math.PI;
  const actualLam2 = lam1 + dLam;

  const d = 2 * Math.asin(Math.sqrt(
    Math.sin((phi2 - phi1) / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin((actualLam2 - lam1) / 2) ** 2
  ));

  if (d < 1e-10) return { lat: lat1, lng: lng1 };

  const a = Math.sin((1 - t) * d) / Math.sin(d);
  const b = Math.sin(t * d) / Math.sin(d);

  const x = a * Math.cos(phi1) * Math.cos(lam1) + b * Math.cos(phi2) * Math.cos(actualLam2);
  const y = a * Math.cos(phi1) * Math.sin(lam1) + b * Math.cos(phi2) * Math.sin(actualLam2);
  const z = a * Math.sin(phi1) + b * Math.sin(phi2);

  return {
    lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
    lng: toDeg(Math.atan2(y, x)),
  };
}

export default function GlobeMap({ flight }) {
  const { origin, destination } = flight;
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const { isDark } = useTheme();

  const hasCoords = origin.lat != null && origin.lng != null && destination.lat != null && destination.lng != null;

  // Calculate plane position for the globe
  const planePoint = useMemo(() => {
    if (!hasCoords) return null;

    const progress = getFlightProgress(flight);
    if (progress <= 0 || progress >= 100) return null;

    if (flight.live?.latitude != null && flight.live?.longitude != null) {
      return { lat: flight.live.latitude, lng: flight.live.longitude };
    }

    return interpolateGreatCircle(
      origin.lat, origin.lng,
      destination.lat, destination.lng,
      progress / 100
    );
  }, [hasCoords, flight, origin, destination]);

  const initGlobe = useCallback(async () => {
    if (!containerRef.current || !hasCoords) return;

    const Globe = (await import('globe.gl')).default;

    // Clean up previous instance
    if (globeRef.current) {
      globeRef.current._destructor?.();
      containerRef.current.innerHTML = '';
    }

    const arcData = [{
      startLat: origin.lat,
      startLng: origin.lng,
      endLat: destination.lat,
      endLng: destination.lng,
    }];

    const pointsData = [
      { lat: origin.lat, lng: origin.lng, label: origin.code, size: 0.6 },
      { lat: destination.lat, lng: destination.lng, label: destination.code, size: 0.6 },
    ];

    const labelsData = [
      { lat: origin.lat, lng: origin.lng, text: origin.code },
      { lat: destination.lat, lng: destination.lng, text: destination.code },
    ];

    // Calculate the right midpoint and altitude BEFORE creating the globe
    const mid = getMidpoint(origin.lat, origin.lng, destination.lat, destination.lng);
    const dist = angularDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    const altitude = Math.min(3.5, Math.max(1.5, dist / 40));

    const globeInstance = Globe();
    const globe = globeInstance
      .globeImageUrl(isDark
        ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
        : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
      )
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .width(containerRef.current.offsetWidth)
      .height(480)
      .atmosphereColor(isDark ? '#c4a882' : '#93c5fd')
      .atmosphereAltitude(0.2)
      // Flight arc
      .arcsData(arcData)
      .arcColor(() => '#c4a882')
      .arcDashLength(0.6)
      .arcDashGap(0.3)
      .arcDashAnimateTime(2500)
      .arcStroke(1.2)
      .arcAltitudeAutoScale(0.4)
      // Airport points
      .pointsData(pointsData)
      .pointColor(() => isDark ? '#fef3c7' : '#fbbf24')
      .pointAltitude(0.01)
      .pointRadius('size')
      // Airport labels
      .labelsData(labelsData)
      .labelText('text')
      .labelSize(1.8)
      .labelColor(() => isDark ? '#f7f3ec' : '#ffffff')
      .labelDotRadius(0.4)
      .labelAltitude(0.015)
      .labelResolution(2)
      // Plane marker via custom HTML layer
      .htmlElementsData(planePoint ? [planePoint] : [])
      .htmlLat('lat')
      .htmlLng('lng')
      .htmlAltitude(0.04)
      .htmlElement(() => {
        const el = document.createElement('div');
        el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="#1c1917" opacity="0.92"/>
          <g transform="translate(18,18) scale(0.7) translate(-18,-18)">
            <path d="M18 4 L20 14 L30 17 Q31 18 30 19 L20 22 L18 30 Q18 31 18 30 L16 22 L6 19 Q5 18 6 17 L16 14 Z" fill="#c4a882"/>
            <path d="M16.5 24 L15 28 Q14.5 29 15.5 28.5 L18 26 L20.5 28.5 Q21.5 29 21 28 L19.5 24" fill="#c4a882"/>
          </g>
        </svg>`;
        el.style.pointerEvents = 'none';
        el.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))';
        return el;
      });

    globe(containerRef.current);

    globeRef.current = globe;

    // Set initial point of view IMMEDIATELY (no animation) so it doesn't start over Africa
    globe.pointOfView({ lat: mid.lat, lng: mid.lng, altitude }, 0);

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
    globe.controls().enableZoom = true;

    // Stop auto-rotate on interaction
    globe.controls().addEventListener('start', () => {
      globe.controls().autoRotate = false;
    });
  }, [origin, destination, isDark, hasCoords, planePoint]);

  useEffect(() => {
    initGlobe();

    return () => {
      if (globeRef.current) {
        globeRef.current._destructor?.();
        globeRef.current = null;
      }
    };
  }, [initGlobe]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (globeRef.current && containerRef.current) {
        globeRef.current.width(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasCoords) return null;

  return (
    <div
      ref={containerRef}
      className="w-full globe-container"
      style={{ height: '480px' }}
    />
  );
}
