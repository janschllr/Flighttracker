import React, { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../ThemeContext';

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

export default function GlobeMap({ origin, destination }) {
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const { isDark } = useTheme();

  const hasCoords = origin.lat != null && origin.lng != null && destination.lat != null && destination.lng != null;

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
      .labelResolution(2);

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
  }, [origin, destination, isDark, hasCoords]);

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
