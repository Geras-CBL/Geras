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

// Coordenadas das lojas de teste em Aveiro
export const VOUCHER_COORDINATES: Record<
  string,
  { latitude: number; longitude: number }
> = {
  '1': { latitude: 40.6445, longitude: -8.6588 }, // Pingo Doce Aveiro
  '2': { latitude: 40.6385, longitude: -8.6488 }, // Farmácia Avenida
  '3': { latitude: 40.642, longitude: -8.65 }, // Continente Aveiro
};

// Obter a coordenada de uma loja de voucher
export function getVoucherCoordinate(
  id: string,
  storeName: string,
  index: number,
) {
  if (VOUCHER_COORDINATES[id]) {
    return VOUCHER_COORDINATES[id];
  }
  // Fallback determinístico perto de Aveiro
  const baseLat = 40.6405;
  const baseLng = -8.6538;
  const offset = (parseInt(id) || index || 0) * 0.003;
  return {
    latitude: baseLat + Math.sin(offset) * 0.005,
    longitude: baseLng + Math.cos(offset) * 0.005,
  };
}

// Obter a coordenada de um utilizador sénior
export function getUserCoordinate(userId: number) {
  const mockCoords: Record<number, { latitude: number; longitude: number }> = {
    1: { latitude: 40.6412, longitude: -8.635 }, // António
    2: { latitude: 40.6434, longitude: -8.653 }, // Maria
    3: { latitude: 40.6336, longitude: -8.655 }, // José
    4: { latitude: 40.6364, longitude: -8.6531 }, // Ana
  };
  if (mockCoords[userId]) return mockCoords[userId];

  const baseLat = 40.6405;
  const baseLng = -8.6538;
  const offset = (userId || 0) * 0.003;
  return {
    latitude: baseLat + Math.sin(offset) * 0.006,
    longitude: baseLng + Math.cos(offset) * 0.006,
  };
}
