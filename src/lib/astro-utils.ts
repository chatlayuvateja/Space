/**
 * Astronomical utilities for computing satellite visibility.
 * Uses spherical trigonometry to calculate elevation angles,
 * solar position, and detect visible passes.
 */

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const EARTH_RADIUS_KM = 6371;

/** Observer location */
export interface ObserverLocation {
  latitude: number;
  longitude: number;
  altitude?: number; // meters above sea level
}

/** A single ISS position sample */
export interface ISSPositionSample {
  latitude: number;
  longitude: number;
  altitude: number; // km
  timestamp: number; // unix seconds
}

/** A detected visible pass */
export interface ISSPass {
  startTime: number; // unix seconds
  endTime: number;
  maxElevation: number; // degrees
  startAzimuth: number; // degrees
  endAzimuth: number;
  duration: number; // seconds
  peakIndex: number; // index into the pass array
}

/**
 * Calculate the elevation angle (degrees above horizon) from an observer
 * to a target (ISS) given their geodetic coordinates.
 * 
 * Positive = above horizon, negative = below.
 */
export function calculateElevationAngle(
  observer: ObserverLocation,
  target: { latitude: number; longitude: number; altitude: number }
): number {
  const obsLat = observer.latitude * DEG2RAD;
  const obsLon = observer.longitude * DEG2RAD;
  const obsAlt = (observer.altitude ?? 0) / 1000; // convert m to km
  
  const tgtLat = target.latitude * DEG2RAD;
  const tgtLon = target.longitude * DEG2RAD;
  const tgtAlt = target.altitude;

  // Geocentric coordinates of observer
  const obsR = EARTH_RADIUS_KM + obsAlt;
  const obsX = obsR * Math.cos(obsLat) * Math.cos(obsLon);
  const obsY = obsR * Math.cos(obsLat) * Math.sin(obsLon);
  const obsZ = obsR * Math.sin(obsLat);

  // Geocentric coordinates of target
  const tgtR = EARTH_RADIUS_KM + tgtAlt;
  const tgtX = tgtR * Math.cos(tgtLat) * Math.cos(tgtLon);
  const tgtY = tgtR * Math.cos(tgtLat) * Math.sin(tgtLon);
  const tgtZ = tgtR * Math.sin(tgtLat);

  // Vector from observer to target
  const dx = tgtX - obsX;
  const dy = tgtY - obsY;
  const dz = tgtZ - obsZ;

  // Distance
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  if (dist < 1) return 0;

  // Up vector at observer (normalized geocentric position)
  const obsNorm = Math.sqrt(obsX * obsX + obsY * obsY + obsZ * obsZ);
  const ux = obsX / obsNorm;
  const uy = obsY / obsNorm;
  const uz = obsZ / obsNorm;

  // Dot product of observer->target vector with up vector
  const dot = (dx * ux + dy * uy + dz * uz) / dist;

  // Elevation = arcsin of the vertical component
  const elevation = Math.asin(Math.max(-1, Math.min(1, dot))) * RAD2DEG;

  return elevation;
}

/**
 * Calculate the azimuth (compass direction) from observer to target.
 * Returns degrees from true north (0 = N, 90 = E, 180 = S, 270 = W).
 */
export function calculateAzimuth(
  observer: ObserverLocation,
  target: { latitude: number; longitude: number }
): number {
  const obsLat = observer.latitude * DEG2RAD;
  const obsLon = observer.longitude * DEG2RAD;
  const tgtLat = target.latitude * DEG2RAD;
  const tgtLon = target.longitude * DEG2RAD;

  const dLon = tgtLon - obsLon;

  const x = Math.sin(dLon) * Math.cos(tgtLat);
  const y = Math.cos(obsLat) * Math.sin(tgtLat) - Math.sin(obsLat) * Math.cos(tgtLat) * Math.cos(dLon);

  let azimuth = Math.atan2(x, y) * RAD2DEG;
  if (azimuth < 0) azimuth += 360;

  return azimuth;
}

/**
 * Get the compass direction name from azimuth degrees.
 */
export function azimuthToDirection(azimuth: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(azimuth / 22.5) % 16;
  return dirs[index];
}

/**
 * Calculate the sun's declination (in radians) for a given time.
 * Uses a simplified solar position algorithm (accuracy ~1°).
 */
export function getSolarDeclination(timestamp: number): number {
  // Days since J2000.0 (Jan 1, 2000 12:00 UTC)
  const days = timestamp / 86400 - 10957.5; // approximate days since J2000
  
  // Mean anomaly of the sun (degrees)
  const meanAnomaly = (357.5291 + 0.98560028 * days) % 360;
  
  // Equation of center
  const equationCenter = 1.9148 * Math.sin(meanAnomaly * DEG2RAD) + 
                         0.02 * Math.sin(2 * meanAnomaly * DEG2RAD) + 
                         0.0003 * Math.sin(3 * meanAnomaly * DEG2RAD);
  
  // Ecliptic longitude (degrees)
  const eclipticLongitude = (meanAnomaly + equationCenter + 180 + 102.9372) % 360;
  
  // Obliquity of the ecliptic (degrees)
  const obliquity = 23.44 - 0.0000004 * days;
  
  // Declination (radians)
  const declination = Math.asin(
    Math.sin(obliquity * DEG2RAD) * Math.sin(eclipticLongitude * DEG2RAD)
  );
  
  return declination;
}

/**
 * Calculate the sun's approximate right ascension (degrees) from a timestamp.
 */
function getSunRightAscension(timestamp: number): number {
  const days = timestamp / 86400 - 10957.5;
  const meanAnomaly = (357.5291 + 0.98560028 * days) % 360;
  const equationCenter = 1.9148 * Math.sin(meanAnomaly * DEG2RAD) +
                          0.02 * Math.sin(2 * meanAnomaly * DEG2RAD) +
                          0.0003 * Math.sin(3 * meanAnomaly * DEG2RAD);
  const eclipticLongitude = (meanAnomaly + equationCenter + 180 + 102.9372) % 360;
  const obliquity = (23.44 - 0.0000004 * days) * DEG2RAD;
  
  // RA = atan2(cos(ε) * sin(λ), cos(λ))
  const ra = Math.atan2(
    Math.cos(obliquity) * Math.sin(eclipticLongitude * DEG2RAD),
    Math.cos(eclipticLongitude * DEG2RAD)
  ) * RAD2DEG;
  
  return ((ra % 360) + 360) % 360;
}

/**
 * Calculate the solar elevation angle (degrees) for a given observer and time.
 * Negative values mean the sun is below the horizon.
 */
export function getSolarElevation(
  observer: ObserverLocation,
  timestamp: number
): number {
  const lat = observer.latitude * DEG2RAD;
  const lon = observer.longitude * DEG2RAD;

  const solarDec = getSolarDeclination(timestamp);
  const sunRA = getSunRightAscension(timestamp);

  // Greenwich Mean Sidereal Time (approximate)
  const days = timestamp / 86400 - 10957.5;
  const gmst = (280.1600 + 360.9856235 * days) % 360;
  
  // Local Hour Angle of the sun = GMST + longitude - RA_sun
  const hourAngle = ((gmst + lon - sunRA + 180) % 360 - 180) * DEG2RAD;

  // Solar elevation = asin(sin(φ)*sin(δ) + cos(φ)*cos(δ)*cos(H))
  const elevation = Math.asin(
    Math.sin(lat) * Math.sin(solarDec) +
    Math.cos(lat) * Math.cos(solarDec) * Math.cos(hourAngle)
  ) * RAD2DEG;

  return elevation;
}

/**
 * Check if it's nighttime at the observer's location (sun below -6° = civil twilight).
 */
export function isNighttime(observer: ObserverLocation, timestamp: number): boolean {
  const solarElevation = getSolarElevation(observer, timestamp);
  return solarElevation < -6;
}

/**
 * Detect visible ISS passes from a series of position samples.
 * 
 * A pass is detected when:
 * 1. Elevation > minElevation (default 10°)
 * 2. At least 3 consecutive samples meet the threshold
 * 3. It's nighttime at the observer's location
 * 
 * Returns an array of passes with start/end times and peak elevation.
 */
export function detectPasses(
  positions: ISSPositionSample[],
  observer: ObserverLocation,
  options?: { minElevation?: number }
): ISSPass[] {
  const minElev = options?.minElevation ?? 10;

  if (positions.length < 3) return [];

  // Compute elevation for each position
  const elevations = positions.map((pos) => ({
    ...pos,
    elevation: calculateElevationAngle(observer, pos),
    azimuth: calculateAzimuth(observer, pos),
  }));

  // Group consecutive samples above threshold into passes
  const passes: ISSPass[] = [];
  let inPass = false;
  let passStart = 0;
  let passMaxElev = -90;
  let passMaxIdx = 0;
  let passStartAz = 0;
  let passCount = 0;

  for (let i = 0; i < elevations.length; i++) {
    const sample = elevations[i];

    if (sample.elevation >= minElev) {
      if (!inPass) {
        // Start of a new pass
        inPass = true;
        passStart = i;
        passMaxElev = sample.elevation;
        passMaxIdx = i;
        passStartAz = sample.azimuth;
        passCount = 1;
      } else {
        passCount++;
        if (sample.elevation > passMaxElev) {
          passMaxElev = sample.elevation;
          passMaxIdx = i;
        }
      }
    } else {
      if (inPass) {
        // End of a pass — only record if it lasted enough samples
        if (passCount >= 3) {
          const start = elevations[passStart];
          const peak = elevations[passMaxIdx];
          const end = elevations[i - 1];
          
          const endAz = calculateAzimuth(observer, elevations[i - 1]);

          // Check if it's nighttime during the pass
          const isDark = isNighttime(observer, peak.timestamp);

          if (isDark) {
            passes.push({
              startTime: start.timestamp,
              endTime: end.timestamp,
              maxElevation: Math.round(passMaxElev * 10) / 10,
              startAzimuth: Math.round(passStartAz * 10) / 10,
              endAzimuth: Math.round(endAz * 10) / 10,
              duration: end.timestamp - start.timestamp,
              peakIndex: passMaxIdx,
            });
          }
        }
        inPass = false;
      }
    }
  }

  // Handle pass at the end of the array
  if (inPass && passCount >= 3) {
    const start = elevations[passStart];
    const peak = elevations[passMaxIdx];
    const end = elevations[elevations.length - 1];
    const endAz = calculateAzimuth(observer, end);
    const isDark = isNighttime(observer, peak.timestamp);

    if (isDark) {
      passes.push({
        startTime: start.timestamp,
        endTime: end.timestamp,
        maxElevation: Math.round(passMaxElev * 10) / 10,
        startAzimuth: Math.round(passStartAz * 10) / 10,
        endAzimuth: Math.round(endAz * 10) / 10,
        duration: end.timestamp - start.timestamp,
        peakIndex: passMaxIdx,
      });
    }
  }

  return passes;
}

/**
 * Format a UNIX timestamp to a localized time string.
 */
export function formatPassTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Format a UNIX timestamp to a localized date string.
 */
export function formatPassDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

/**
 * Format duration in seconds to a human-readable string.
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

/**
 * Get a descriptive visibility rating based on max elevation.
 */
export function getVisibilityRating(maxElevation: number): {
  label: string;
  color: string;
} {
  if (maxElevation >= 80) return { label: "Excellent", color: "#34d399" };
  if (maxElevation >= 60) return { label: "Very Good", color: "#22d3ee" };
  if (maxElevation >= 40) return { label: "Good", color: "#60a5fa" };
  if (maxElevation >= 20) return { label: "Fair", color: "#fbbf24" };
  return { label: "Poor", color: "#f87171" };
}
