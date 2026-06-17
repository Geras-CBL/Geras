// @ts-ignore
import { API_KEY_MAPS } from '@env';

// Função para calcular distância em Km entre duas coordenadas (Fórmula Haversine)
export function getDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function parsePostGISPoint(
  location: any,
): { latitude: number; longitude: number } | null {
  if (!location) return null;
  // Caso 1: Retorna como String WKT - "POINT(longitude latitude)"
  if (typeof location === 'string') {
    const match = location.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      const longitude = parseFloat(match[1]);
      const latitude = parseFloat(match[2]);
      return { latitude, longitude };
    }

    // Caso 2: Hexadecimal EWKB (formato padrão de ponto geográfico retornado pelo Supabase)
    if (/^[0-9a-fA-F]{50}$/.test(location)) {
      const isLittleEndian = location.substring(0, 2) === '01';
      const xHex = location.substring(18, 34);
      const yHex = location.substring(34, 50);

      const parseDouble = (hexStr: string) => {
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          const byteIndex = isLittleEndian ? i : 7 - i;
          bytes[byteIndex] = parseInt(hexStr.substring(i * 2, i * 2 + 2), 16);
        }
        const view = new DataView(bytes.buffer);
        return view.getFloat64(0, true);
      };

      try {
        const longitude = parseDouble(xHex);
        const latitude = parseDouble(yHex);
        return { latitude, longitude };
      } catch (e) {
        console.error('Erro ao decodificar ponto EWKB hexadecimal:', e);
      }
    }
  }
  if (
    typeof location === 'object' &&
    location.type === 'Point' &&
    Array.isArray(location.coordinates)
  ) {
    const [longitude, latitude] = location.coordinates;
    return { latitude, longitude };
  }
  return null;
}

export async function geocodeAddress(
  address: string,
  zipCode: string,
  local: string,
): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const query = `${address}, ${zipCode} ${local}, Portugal`;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      query,
    )}&key=${API_KEY_MAPS}`;
    const response = await fetch(url);
    const json = await response.json();
    if (json.status === 'OK' && json.results && json.results.length > 0) {
      const { lat, lng } = json.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
    console.warn('Geocoding falhou ou sem resultados:', json.status);
    return null;
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    return null;
  }
}

// Obter a coordenada de uma loja de voucher
export function getVoucherCoordinate(
  dbLocation: any,
  indexOrId: number | string = 0,
): { latitude: number; longitude: number } {
  const parsed = parsePostGISPoint(dbLocation);
  if (parsed) return parsed;
  // Fallback determinístico perto de Aveiro se a BD não tiver localização registada
  const baseLat = 40.6405;
  const baseLng = -8.6538;
  const idNum =
    typeof indexOrId === 'string' ? parseInt(indexOrId) || 0 : indexOrId;
  const offset = idNum * 0.003;
  return {
    latitude: baseLat + Math.sin(offset) * 0.005,
    longitude: baseLng + Math.cos(offset) * 0.005,
  };
}

// Obter a coordenada de um utilizador sénior
export function getUserCoordinate(
  dbLocation: any,
  userId: number = 0,
): { latitude: number; longitude: number } {
  const parsed = parsePostGISPoint(dbLocation);
  if (parsed) return parsed;
  // Fallback determinístico perto de Aveiro se a BD não tiver localização registada
  const baseLat = 40.6405;
  const baseLng = -8.6538;
  const offset = (userId || 0) * 0.003;
  return {
    latitude: baseLat + Math.sin(offset) * 0.006,
    longitude: baseLng + Math.cos(offset) * 0.006,
  };
}
