export const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatDistance = (meters) => {
  if (meters == null) return '';
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Generates an array of n elements (useful for placeholders/skeletons)
export const range = (n) => Array.from({ length: n }, (_, i) => i);

// Sanitize input to prevent XSS — strip HTML tags and dangerous characters
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// Simple client-side rate limiter for form submissions
const submitTimestamps = {}

export function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now()
  if (!submitTimestamps[key]) submitTimestamps[key] = []
  
  // Remove timestamps outside the window
  submitTimestamps[key] = submitTimestamps[key].filter(t => now - t < windowMs)
  
  if (submitTimestamps[key].length >= maxAttempts) {
    return { allowed: false, waitSeconds: Math.ceil((submitTimestamps[key][0] + windowMs - now) / 1000) }
  }
  
  submitTimestamps[key].push(now)
  return { allowed: true }
}

const OSRM_BASE_URL = import.meta.env.VITE_OSRM_URL || 'https://router.project-osrm.org'

/**
 * Get route distance and duration between waypoints using OSRM.
 * Waypoints: array of { lat, lng }
 * Returns: { distance_meters, duration_seconds } or null if failed
 */
export async function getOSRMRoute(waypoints) {
  try {
    const coords = waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';')
    const url = `${OSRM_BASE_URL}/route/v1/driving/${coords}?overview=false&annotations=false`
    
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) return null
    
    const data = await response.json()
    if (data.code !== 'Ok' || !data.routes?.length) return null
    
    return {
      distance_meters: data.routes[0].distance,
      duration_seconds: data.routes[0].duration,
    }
  } catch {
    return null
  }
}

/**
 * Calculate direction score between a driver and a rider.
 * Score = 1 - ((detour_distance - normal_distance) / normal_distance)
 * Clamped between 0 and 1. Higher = more on-route.
 * 
 * @param driverOrigin    { lat, lng } — driver's starting point
 * @param riderPickup     { lat, lng } — rider's pickup point  
 * @param destination     { lat, lng } — shared destination (campus)
 * @returns { score, detour_meters, detour_seconds } or null if OSRM fails
 */
export async function calculateDirectionScore(driverOrigin, riderPickup, destination) {
  // Route A: driver origin → destination (normal route)
  const normalRoute = await getOSRMRoute([driverOrigin, destination])
  if (!normalRoute) return null

  // Route B: driver origin → rider pickup → destination (detour route)  
  const detourRoute = await getOSRMRoute([driverOrigin, riderPickup, destination])
  if (!detourRoute) return null

  const normalDist  = normalRoute.distance_meters
  const detourDist  = detourRoute.distance_meters
  const detourExtra = detourDist - normalDist

  if (normalDist < 1) return null

  const score = Math.min(1.0, Math.max(0.0,
    parseFloat((1 - (detourExtra / normalDist)).toFixed(3))
  ))

  return {
    score,
    detour_meters:  Math.round(detourExtra),
    detour_seconds: Math.round(detourRoute.duration_seconds - normalRoute.duration_seconds),
  }
}
